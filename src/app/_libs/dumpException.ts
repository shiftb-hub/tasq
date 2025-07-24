import {
  SupabaseUserNotFoundError,
  AppUserNotFoundError,
  UserPermissionDeniedError,
} from "@/app/_libs/errors";

/**
 * エラーダンプ関数
 * @param e - 発生した例外
 * @param context - 例外が発生した処理や機能の情報
 * @param meta - 追加出力したい任意オブジェクト（オプション）
 * @example
 * ```typescript
 * try {
 *   const userService = new UserService(prisma);
 *   user = await userService.getById(userId);
 *   ...
 * } catch (e) {
 *   dumpError(e, "プロフィール更新", { userId, reqBody });
 * }
 * ```
 */
export const dumpError = (
  e: unknown,
  context: string,
  meta?: unknown,
): void => {
  const prefix = `[${context}] 失敗`;
  let msg = "";
  let detail: Record<string, unknown> = {};

  // カスタムエラーの判定と処理
  if (e instanceof Error) {
    if (e instanceof SupabaseUserNotFoundError) {
      msg = "ユーザーが見つかりません";
    } else if (e instanceof AppUserNotFoundError) {
      msg = "アプリDBにユーザーが見つかりません";
    } else if (e instanceof UserPermissionDeniedError) {
      msg = "権限が不足しています";
    } else {
      msg = "予期しないエラーが発生しました";
    }

    detail = {
      type: e.constructor.name,
      message: e.message,
      stack: e.stack,
    };
  } else {
    msg = "予期しない例外が発生しました";
    detail = {
      type: typeof e,
      value: e,
    };
  }

  // 出力データの構築
  const output: Record<string, unknown> = {
    context,
    error: msg,
    details: detail,
  };

  // 追加情報がある場合は含める
  if (meta) {
    output.meta = meta;
  }
  console.error(`${prefix} - ${msg}:`);
  console.error(JSON.stringify(output, null, 2));
};
