/**
 * Supabaseの認証情報からユーザーが取得できなかった場合のエラー
 * 主に supabase.auth.getUser() でユーザーが取得できなかった場合にthrowされる
 */
export class SupabaseUserNotFoundError extends Error {
  readonly timestamp: Date;

  constructor(message = "User not found in Supabase Auth") {
    super(message);
    this.name = "SupabaseUserNotFoundError";
    this.timestamp = new Date();
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SupabaseUserNotFoundError);
    }
  }
}

/**
 * SupabaseのAuthにはユーザーが存在するが、アプリDBには存在しない場合のエラー
 */
export class AppUserNotFoundError extends Error {
  readonly supabaseId: string;
  readonly timestamp: Date;

  constructor(
    supabaseId: string,
    message = "User not found in application database",
  ) {
    super(message);
    this.name = "AppUserNotFoundError";
    this.supabaseId = supabaseId;
    this.timestamp = new Date();
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppUserNotFoundError);
    }
  }
}
