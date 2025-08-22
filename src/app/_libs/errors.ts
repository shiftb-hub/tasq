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

/**
 * 学習ログが見つからなかった場合のエラー
 */
export class LearningLogNotFoundError extends Error {
  readonly learningLogId: string;
  readonly timestamp: Date;

  constructor(
    learningLogId: string,
    message = "Learning log not found in application database",
  ) {
    super(message);
    this.name = "LearningLogNotFoundError";
    this.learningLogId = learningLogId;
    this.timestamp = new Date();
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LearningLogNotFoundError);
    }
  }
}

/**
 * ユーザーが必要な権限を持たないために操作が拒否された場合のエラー
 */
export class UserPermissionDeniedError extends Error {
  readonly userId: string;
  readonly actualRole: string;
  readonly requiredRole?: string;
  readonly action?: string;
  readonly timestamp: Date;

  constructor({
    userId,
    actualRole,
    requiredRole,
    action,
    message = "User does not have sufficient permissions to perform this action",
  }: {
    userId: string;
    actualRole: string;
    requiredRole?: string;
    action?: string;
    message?: string;
  }) {
    super(message);
    this.name = "UserPermissionDeniedError";
    this.userId = userId;
    this.actualRole = actualRole;
    this.requiredRole = requiredRole;
    this.action = action;
    this.timestamp = new Date();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UserPermissionDeniedError);
    }
  }
}

export const isPrismaNotFoundError = (error: unknown): boolean => {
  return error instanceof Error && "code" in error && error.code === "P2025";
};
