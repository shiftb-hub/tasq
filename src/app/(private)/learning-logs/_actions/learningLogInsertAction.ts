"use server";

// DB接続・サービス層・認証
import prisma from "@/app/_libs/prisma";
import { authenticateAppUser } from "@/app/_libs/authenticateUser";

// 型定義・バリデーションスキーマ
import { learningLogInsertRequestSchema } from "@/app/_types/LearningLog";
import type { User as AppUser } from "@prisma/client";
import type { LearningLogInsertRequest } from "@/app/_types/LearningLog";

// ユーティリティ
import { dumpError } from "@/app/_libs/dumpException";
import { LearningLogService } from "@/app/_services/learningLogService";

// ServerActionの戻り値
type LearningLogInsertActionResult =
  | { success: true; errorMessageForUser?: never }
  | { success: false; errorMessageForUser: string };

/**
 * 学習ログを新規作成する Server Action
 *
 * @param learningLogInsertRequest - 学習ログ新規作成リクエスト
 * @returns 学習ログ新規作成処理結果
 */
export const learningLogInsertAction = async (
  learningLogInsertRequest: LearningLogInsertRequest,
): Promise<LearningLogInsertActionResult> => {
  let user: AppUser | null = null;
  try {
    // バックエンド認証（クライアント偽装対策）
    user = await authenticateAppUser();

    // バックエンドバリデーション（引数改竄対策）
    learningLogInsertRequest = learningLogInsertRequestSchema.parse(learningLogInsertRequest);

    // 学習ログの新規作成処理（LearningLogService）
    const learningLogService = new LearningLogService(prisma);
    await learningLogService.create(user.id, learningLogInsertRequest);
    return { success: true } satisfies LearningLogInsertActionResult;
  } catch (e) {
    dumpError(e, "学習ログの新規作成処理 (ServerAction)", {
      userId: user?.id,
      learningLogInsertRequest,
    });
    return {
      success: false,
      errorMessageForUser:
        "バックエンドで発生した予期せぬエラーにより学習ログの新規作成処理に失敗しました。再度お試しください。",
    } satisfies LearningLogInsertActionResult;
  }
};
