"use server";

// DB接続・サービス層・認証
import prisma from "@/app/_libs/prisma";
import { Prisma as PRS } from "@prisma/client";
import { UserService } from "@/app/_services/userService";
import { authenticateAppUser } from "@/app/_libs/authenticateUser";

// 型定義・バリデーションスキーマ
import { profileUpdateRequestSchema } from "./_types/ProfileUpdateRequest";
import type { User as AppUser } from "@prisma/client";
import type { ProfileUpdateRequest } from "./_types/ProfileUpdateRequest";

// ユーティリティ
import { dumpError } from "@/app/_libs/dumpException";
import { isDevelopmentEnv } from "@/app/_configs/app-config";

// ServerActionの戻り値
type ProfileUpdateActionResult = {
  success: boolean;
  errorMessageForUser: string | undefined;
};

/**
 * ユーザープロフィール更新を処理する Server Action
 *
 * @param profileUpdateRequest - プロフィール更新情報
 * @returns プロフィール更新処理結果
 */
export const profileUpdateAction = async (
  profileUpdateRequest: ProfileUpdateRequest,
): Promise<ProfileUpdateActionResult> => {
  let user: AppUser | null = null;
  try {
    // TODO:デバッグとUX調整のための遅延（本番では削除）
    if (isDevelopmentEnv) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // バックエンド認証（Server Action: クライアント偽装対策）
    user = await authenticateAppUser();

    // バックエンドバリデーション（Server Action: 引数改竄対策）
    profileUpdateRequest =
      profileUpdateRequestSchema.parse(profileUpdateRequest);

    // ユーザープロフィール更新処理
    // - 必須項目（name, bio）はそのまま設定
    // - オプショナル項目は undefined → null に変換（DB制約対応）
    const result = await new UserService(prisma).update(user.id, {
      // 必須フィールド
      name: profileUpdateRequest.name,
      bio: profileUpdateRequest.bio,

      // オプショナルフィールド（undefined → null変換）
      job: profileUpdateRequest.job ?? null,
      currentChapter: profileUpdateRequest.currentChapter,
      slackId: profileUpdateRequest.slackId ?? null,
      instagramId: profileUpdateRequest.instagramId ?? null,
      threadsId: profileUpdateRequest.threadsId ?? null,
      xId: profileUpdateRequest.xId ?? null,
      githubId: profileUpdateRequest.githubId ?? null,
      profileImageKey: profileUpdateRequest.profileImageKey ?? null,
    } satisfies PRS.UserUpdateInput);
    if (!result) throw new Error("ユーザー情報の更新に失敗しました");

    return {
      success: true,
      errorMessageForUser: undefined,
    } satisfies ProfileUpdateActionResult;
  } catch (e) {
    dumpError(e, "プロフィール更新処理 (ServerAction) ", {
      user,
      profileUpdateRequest,
    });
    return {
      success: false,
      errorMessageForUser:
        "バックエンドで発生した予期せぬエラーでプロフィール更新処理に失敗しました。再度お試しください。",
    } satisfies ProfileUpdateActionResult;
  }
};
