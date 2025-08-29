import { describe, expect, test } from "vitest";
import { runInRollbackTx } from "../setup/prisma.setup";
import { LearningLogService } from "@/app/_services/learningLogService";
import { UserService } from "@/app/_services/userService";
import { mockLearningLog } from "./helpers/common-mock-data";
import {
  LearningLogNotFoundError,
  UserPermissionDeniedError,
} from "@/app/_libs/errors";
import { v4 as uuid } from "uuid";

describe("LearningLogService delete", () => {
  test("他のユーザーの学習ログ削除でUserPermissionDeniedErrorが発生する", async () => {
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

      // ユーザBがユーザAの学習ログを削除しようとする
      await expect(
        learningLogService.delete(userBId, createdLog.id),
      ).rejects.toThrow(UserPermissionDeniedError);
    });
  });

  test("学習ログを正常に削除できる", async () => {
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

      const initialCount = await learningLogService.count();

      // 削除実行（所有者として）
      await learningLogService.delete(userId, createdLog.id);

      // 削除確認
      expect(await learningLogService.count()).toBe(initialCount - 1);

      // 取得できないことの確認
      await expect(
        learningLogService.getByIdWithOwnershipCheck(null, createdLog.id),
      ).rejects.toThrow(LearningLogNotFoundError);
    });
  });

  test("存在しない学習ログの削除でLearningLogNotFoundErrorが発生する", async () => {
    await runInRollbackTx(async (tx) => {
      const learningLogService = new LearningLogService(tx);
      const nonExistentId = uuid();

      await expect(
        learningLogService.delete(null, nonExistentId),
      ).rejects.toThrow(LearningLogNotFoundError);
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

      const initialCount = await learningLogService.count();

      // userId=nullで削除（所有権チェックをスキップ）
      await learningLogService.delete(null, createdLog.id);

      // 削除確認
      expect(await learningLogService.count()).toBe(initialCount - 1);

      // 取得できないことの確認
      await expect(
        learningLogService.getByIdWithOwnershipCheck(null, createdLog.id),
      ).rejects.toThrow(LearningLogNotFoundError);
    });
  });
});
