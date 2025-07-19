"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type {
  AuthError,
  SignInWithPasswordCredentials,
} from "@supabase/supabase-js";

import { createSupabaseServerClient } from "@/app/_libs/supabase/serverClient";
import type { LoginRequest } from "@/app/_types/LoginRequest";

// 戻り値の型定義
type LoginActionResult = {
  success: false;
  error: string;
};

// エラーメッセージの定数定義
const AUTH_ERROR_MESSAGES = {
  invalid_credentials: "メールアドレスまたはパスワードが正しくありません",
  email_not_confirmed: "メールアドレスが確認されていません",
  over_request_rate_limit: "しばらく時間をおいてから再度お試しください",
  user_not_found: "ユーザーが見つかりません",
  signup_disabled: "新規登録が無効になっています",
} as const;

const FALLBACK_ERROR_MESSAGE = "ログインに失敗しました";
const UNEXPECTED_ERROR_MESSAGE = "予期しないエラーが発生しました";

const mapAuthErrorToUserMessage = (authError: AuthError): string =>
  AUTH_ERROR_MESSAGES[authError.code as keyof typeof AUTH_ERROR_MESSAGES] ??
  FALLBACK_ERROR_MESSAGE;

/**
 * ユーザーログインを処理するServer Action
 * 成功時はホームページにリダイレクト、失敗時はエラーメッセージを返す
 *
 * @param loginRequest - ログイン情報（メールアドレスとパスワード）
 * @returns 失敗時はエラー情報、成功時はリダイレクト（never）
 */
export const loginAction = async (
  loginRequest: LoginRequest,
): Promise<LoginActionResult | never> => {
  let authError: AuthError | null = null;

  try {
    // 擬似的に1秒の遅延を追加（デバッグ用）
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const supabase = await createSupabaseServerClient();
    const credentials: SignInWithPasswordCredentials = {
      email: loginRequest.email,
      password: loginRequest.password,
    };
    const { error } = await supabase.auth.signInWithPassword(credentials);
    if (error) authError = error; // 認証エラーをセット
  } catch (error) {
    console.error("Unexpected login error:", {
      email: loginRequest.email,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return {
      success: false,
      error: UNEXPECTED_ERROR_MESSAGE,
    } as LoginActionResult;
  }

  // 認証エラーがある場合はエラーメッセージを返す
  if (authError) {
    console.warn("Authentication failed:", {
      email: loginRequest.email,
      errorCode: authError.status,
      errorMessage: authError.message,
    });
    return {
      success: false,
      error: mapAuthErrorToUserMessage(authError),
    } as LoginActionResult;
  }

  // 成功時の処理（try-catchの外で実行してNEXT_REDIRECTエラーを回避）
  console.info("User logged in successfully:", { email: loginRequest.email });
  revalidatePath("/", "layout");
  redirect("/");
};
