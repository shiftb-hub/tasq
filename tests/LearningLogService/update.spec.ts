import { describe, expect, test } from "vitest";
import { runInRollbackTx } from "../setup/prisma.setup";
import { LearningLogService } from "@/app/_services/learningLogService";
import { UserService } from "@/app/_services/userService";
import { mockLearningLog } from "./helpers/common-mock-data";
import type { LearningLogUpdateRequest } from "@/app/_types/LearningLog";
import {
  LearningLogNotFoundError,
  UserPermissionDeniedError,
} from "@/app/_libs/errors";
import { v4 as uuid } from "uuid";

describe("LearningLogService update", () => {
  test("学習ログを正常に更新できる", async () => {
    await runInRollbackTx(async (tx) => {
      // ユーザ作成
      const userId = uuid();
      const userName = "検査 官太郎";
      const userService = new UserService(tx);
      await userService.createAsStudent(userId, userName);

      // 学習ログ作成
      const learningLogService = new LearningLogService(tx);
      const createdLog = await learningLogService.create(
        userId,
        mockLearningLog,
      );

      // 更新データ準備
      const updateData: LearningLogUpdateRequest = {
        id: createdLog.id,
        title: "更新されたタイトル",
        description: "更新された内容",
        reflections: "更新された振り返り",
        spentMinutes: 240,
        startedAt: new Date("2025-08-14T10:00:00Z"),
        endedAt: new Date("2025-08-14T14:00:00Z"),
      };

      // 更新実行（所有者として）
      await learningLogService.update(userId, createdLog.id, updateData);

      // 更新結果の確認
      const updatedLog = await learningLogService.getByIdWithOwnershipCheck(
        userId,
        createdLog.id,
      );
      expect(updatedLog.title).toBe(updateData.title);
      expect(updatedLog.description).toBe(updateData.description);
      expect(updatedLog.reflections).toBe(updateData.reflections);
      expect(updatedLog.spentMinutes).toBe(updateData.spentMinutes);
      expect(updatedLog.startedAt).toEqual(updateData.startedAt);
      expect(updatedLog.endedAt).toEqual(updateData.endedAt);
    });
  });

  test("存在しない学習ログの更新でLearningLogNotFoundErrorが発生する", async () => {
    await runInRollbackTx(async (tx) => {
      const learningLogService = new LearningLogService(tx);
      const nonExistentId = uuid();

      const updateData: LearningLogUpdateRequest = {
        id: nonExistentId,
        title: "存在しないログの更新",
        description: "これは失敗するはず",
        reflections: "更新されない",
        spentMinutes: 60,
        startedAt: new Date(),
        endedAt: new Date(),
      };

      await expect(
        learningLogService.update(null, nonExistentId, updateData),
      ).rejects.toThrow(LearningLogNotFoundError);
    });
  });

  test("他のユーザーの学習ログ更新でUserPermissionDeniedErrorが発生する", async () => {
    await runInRollbackTx(async (tx) => {
      // ユーザA作成
      const userAId = uuid();
      const userAName = "品質 管理代";
      const userService = new UserService(tx);
      await userService.createAsStudent(userAId, userAName);

      // ユーザB作成
      const userBId = uuid();
      const userBName = "不具合 退治丸";
      await userService.createAsStudent(userBId, userBName);

      // ユーザAの学習ログ作成
      const learningLogService = new LearningLogService(tx);
      const createdLog = await learningLogService.create(
        userAId,
        mockLearningLog,
      );

      const updateData: LearningLogUpdateRequest = {
        id: createdLog.id,
        title: "不正な更新",
        description: "他人のログを更新しようとしている",
        reflections: "これは失敗するはず",
        spentMinutes: 60,
        startedAt: new Date(),
        endedAt: new Date(),
      };

      // ユーザBがユーザAの学習ログを更新しようとする
      await expect(
        learningLogService.update(userBId, createdLog.id, updateData),
      ).rejects.toThrow(UserPermissionDeniedError);
    });
  });

  test("userId=nullで所有権チェックをスキップする", async () => {
    await runInRollbackTx(async (tx) => {
      // ユーザ作成
      const userId = uuid();
      const userName = "検査 官太郎";
      const userService = new UserService(tx);
      await userService.createAsStudent(userId, userName);

      // 学習ログ作成
      const learningLogService = new LearningLogService(tx);
      const createdLog = await learningLogService.create(
        userId,
        mockLearningLog,
      );

      const updateData: LearningLogUpdateRequest = {
        id: createdLog.id,
        title: "管理者による更新",
        description: "所有権チェックなしの更新",
        reflections: "管理者権限での変更",
        spentMinutes: 300,
        startedAt: new Date("2025-08-15T08:00:00Z"),
        endedAt: new Date("2025-08-15T13:00:00Z"),
      };

      // userId=nullで更新（所有権チェックをスキップ）
      await learningLogService.update(null, createdLog.id, updateData);

      // 更新結果の確認
      const updatedLog = await learningLogService.getByIdWithOwnershipCheck(
        null,
        createdLog.id,
      );
      expect(updatedLog.title).toBe("管理者による更新");
      expect(updatedLog.description).toBe("所有権チェックなしの更新");
    });
  });
});
