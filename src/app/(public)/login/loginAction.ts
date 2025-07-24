"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/app/_libs/prisma";
import { UserService } from "@/app/_services/userService";
import { createSupabaseServerClient } from "@/app/_libs/supabase/serverClient";
import type { LoginRequest } from "@/app/_types/LoginRequest";
import type {
  AuthError,
  SignInWithPasswordCredentials,
} from "@supabase/supabase-js";
import { isDevelopmentEnv } from "@/app/_configs/app-config";
import { th } from "zod/v4/locales";

// 戻り値の型定義
type LoginActionResult = {
  success: boolean;
  redirectTo: string | undefined;
  errorMessageForUser: string | undefined;
};

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
  // 想定外の Auth error code が発生した場合はログ出力
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
 * @param loginRequest - ログイン情報（メールアドレスとパスワード）
 * @returns ログイン結果（成功時はリダイレクト先を含む、失敗時はエラーメッセージを含む）
 */
export const loginAction = async (
  loginRequest: LoginRequest,
): Promise<LoginActionResult> => {
  try {
    // TODO:デバッグとUX調整のための遅延（本番では削除）
    if (isDevelopmentEnv) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    const supabase = await createSupabaseServerClient();
    const credentials: SignInWithPasswordCredentials = {
      email: loginRequest.email,
      password: loginRequest.password,
    };
    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    if (error) {
      return {
        success: false,
        redirectTo: undefined,
        errorMessageForUser: mapAuthErrorToUserMessage(error),
      };
    }
    const userId = data.user?.id;
    if (!userId) {
      throw new Error("Supabase認証は成功したがユーザーIDの取得に失敗");
    }

    // Supabase認証済みユーザーに対応する「AppUser」が存在しなければ新規作成
    const userService = new UserService(prisma);
    const wasCreated = await userService.createIfNotExists(
      userId,
      loginRequest.email.split("@")[0],
    );

    revalidatePath("/", "layout"); // サーバサイドのキャッシュを更新

    //「AppUser」が新規作成された場合は `/settings` に、それ以外は `/` にリダイレクト
    return {
      success: true,
      redirectTo: wasCreated ? "/settings" : "/",
      errorMessageForUser: undefined,
    } satisfies LoginActionResult;
  } catch (e) {
    const ee = e instanceof Error ? { message: e.message, stack: e.stack } : e;
    console.error(`ログイン処理の失敗（${loginRequest.email}）`, ee);
    return {
      success: false,
      redirectTo: undefined,
      errorMessageForUser:
        "予期せぬエラーでログイン処理に失敗しました。再度お試しください。",
    } satisfies LoginActionResult;
  }
};
