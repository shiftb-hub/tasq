"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/app/_libs/prisma";
import { UserService } from "@/app/_services/userService";
import { createSupabaseServerClient } from "@/app/_libs/supabase/serverClient";
import { loginRequestSchema } from "@/app/_types/LoginRequest";
import type { LoginRequest } from "@/app/_types/LoginRequest";
import type {
  AuthError,
  SignInWithPasswordCredentials,
} from "@supabase/supabase-js";
import { isDevelopmentEnv } from "@/app/_configs/app-config";
import { dumpError } from "@/app/_libs/dumpException";
import type { LoginActionResult } from "./_types/LoginActionResult";

/// ユーザー向けのエラーメッセージの定義
/// Supabase Auth error code と ユーザー向けエラーメッセージ の対応付け
/// https://supabase.com/docs/guides/auth/debugging/error-codes#auth-error-codes-table
const AUTH_ERROR_MESSAGES = {
  invalid_credentials: "メールアドレスまたはパスワードが正しくありません。",
  email_not_confirmed: "メールアドレスが確認されていません。",
  over_request_rate_limit: "しばらく時間をおいてから再度お試しください。",
  user_not_found: "ユーザーが見つかりません。",
  signup_disabled: "新規登録が無効になっています。",
} as const;

const mapAuthErrorToUserMessage = (authError: AuthError): string => {
  const userMessage =
    AUTH_ERROR_MESSAGES[authError.code as keyof typeof AUTH_ERROR_MESSAGES];
  if (!userMessage) {
    console.error("Unknown auth error code encountered:", {
      code: authError.code,
      message: authError.message,
      status: authError.status,
    });
    return "ログイン処理に失敗しました。";
  }
  return userMessage;
};

/**
 * ユーザーログインを処理する Server Action
 * 成功時はホームページにリダイレクト、失敗時はエラーメッセージを返す
 *
 * @param rawLoginRequest - ログイン情報（メールアドレスとパスワード）
 * @returns ログイン結果（成功時はリダイレクト先を含む、失敗時はエラーメッセージを含む）
 */
export const loginAction = async (
  rawLoginRequest: LoginRequest,
): Promise<LoginActionResult> => {
  try {
    // TODO:デバッグとUX調整のための遅延（本番では削除）
    if (isDevelopmentEnv) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // バックエンドバリデーション（引数改竄対策）
    const parsedRequest = loginRequestSchema.safeParse(rawLoginRequest);
    if (!parsedRequest.success) {
      return {
        success: false,
        errorMessageForUser:
          "メールアドレスまたはパスワードの書式が正しくありません。",
      } satisfies LoginActionResult;
    }
    const loginRequest = parsedRequest.data;

    const supabase = await createSupabaseServerClient();
    const credentials: SignInWithPasswordCredentials = {
      email: loginRequest.email,
      password: loginRequest.password,
    };
    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    if (error) {
      // Supabaseに接続不可のときの特別処理
      if (error.name === "AuthRetryableFetchError") {
        console.error(
          "Supabase接続に失敗。Supabaseの稼働状況を確認してください。",
        );
        return {
          success: false,
          errorMessageForUser:
            "DB接続に失敗しました。しばらく時間をおいてから再度お試しください。",
        } satisfies LoginActionResult;
      }
      // 通常の認証エラー処理
      return {
        success: false,
        errorMessageForUser: mapAuthErrorToUserMessage(error),
      } satisfies LoginActionResult;
    }

    // 通常、このエラーが発生することはあり得ない（念のためチェック）
    const userId = data.user?.id;
    if (!userId) {
      throw new Error("Supabase認証は成功したがユーザーIDの取得に失敗");
    }

    // SupabaseIDに対応するユーザが「AppUser」が存在しなければ、
    // 「AppUser」を新規作成する wasCreated => true
    const userService = new UserService(prisma);
    const wasCreated = await userService.createIfNotExists(
      userId,
      loginRequest.email.split("@")[0].trim() || "user", // 名前の初期値
    );

    // サーバサイドのキャッシュを更新
    revalidatePath("/", "layout");

    //「AppUser」が新規作成された場合は `/settings` に、それ以外は `/` にリダイレクト
    return {
      success: true,
      redirectTo: wasCreated ? "/settings" : "/",
    } satisfies LoginActionResult;
  } catch (e) {
    dumpError(e, "ログイン処理（ServerAction）", { rawLoginRequest });
    return {
      success: false,
      errorMessageForUser:
        "予期せぬエラーによりログイン処理に失敗しました。再度お試しください。",
    } satisfies LoginActionResult;
  }
};
