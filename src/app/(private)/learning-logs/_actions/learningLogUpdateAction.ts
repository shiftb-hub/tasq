"use server";

// DB接続・サービス層・認証
import prisma from "@/app/_libs/prisma";
import { authenticateAppUser } from "@/app/_libs/authenticateUser";

// 型定義・バリデーションスキーマ
import type { User as AppUser } from "@prisma/client";
import type { LearningLogUpdateRequest } from "@/app/_types/LearningLog";
import { learningLogUpdateRequestSchema } from "@/app/_types/LearningLog";

// ユーティリティ
import { dumpError } from "@/app/_libs/dumpException";
import { LearningLogService } from "@/app/_services/learningLogService";

// ServerActionの戻り値
type LearningLogUpdateActionResult =
  | { success: true; errorMessageForUser?: never }
  | { success: false; errorMessageForUser: string };

/**
 * 学習ログを更新作成する Server Action
 *
 * @param learningLogUpdateRequest - 学習ログ新規作成リクエスト
 * @returns 学習ログ新規作成処理結果
 */
export const learningLogUpdateAction = async (
  learningLogUpdateRequest: LearningLogUpdateRequest,
): Promise<LearningLogUpdateActionResult> => {
  let user: AppUser | null = null;
  try {
    // バックエンド認証（クライアント偽装対策）
    user = await authenticateAppUser();

    // バックエンドバリデーション（引数改竄対策）
    learningLogUpdateRequest = learningLogUpdateRequestSchema.parse(learningLogUpdateRequest);
    const { id: logId } = learningLogUpdateRequest;

    // 学習ログの更新処理（LearningLogService）
    const learningLogService = new LearningLogService(prisma);
    await learningLogService.update(user.id, logId, learningLogUpdateRequest);

    return { success: true } satisfies LearningLogUpdateActionResult;
  } catch (e) {
    dumpError(e, "学習ログの更新処理 (ServerAction)", {
      userId: user?.id,
      learningLogUpdateRequest: learningLogUpdateRequest,
    });
    return {
      success: false,
      errorMessageForUser:
        "バックエンドで発生した予期せぬエラーにより学習ログの更新処理に失敗しました。再度お試しください。",
    } satisfies LearningLogUpdateActionResult;
  }
};
