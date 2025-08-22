import { describe, expect, test } from "vitest";
import { runInRollbackTx } from "../setup/prisma.setup";
import { LearningLogService } from "@/app/_services/learningLogService";
import { UserService } from "@/app/_services/userService";
import { mockLearningLog } from "./helpers/common-mock-data";
import { v4 as uuid } from "uuid";
import { Role } from "@prisma/client";

describe("LearningLogService tryGetById", () => {
  test("存在する学習ログを正常に取得できる", async () => {
    await runInRollbackTx(async (tx) => {
      // (1) ユーザ作成
      const userId = uuid();
      const userName = "検査 官太郎";
      const userService = new UserService(tx);
      await userService.createAsStudent(userId, userName);

      // (2) 学習ログ作成
      const learningLogService = new LearningLogService(tx);
      const createdLog = await learningLogService.create(
        userId,
        mockLearningLog,
      );

      // (3) tryGetByIdでの取得テスト
      const retrievedLog = await learningLogService.tryGetById(createdLog.id);

      // (4) 取得結果の検証
      expect(retrievedLog).toBeDefined();
      expect(retrievedLog!.id).toBe(createdLog.id);
      expect(retrievedLog!.userId).toBe(userId);
      expect(retrievedLog!.title).toBe(mockLearningLog.title);
    });
  });

  test("存在しない学習ログを指定すると null が取得できる", async () => {
    await runInRollbackTx(async (tx) => {
      const learningLogService = new LearningLogService(tx);
      const nonExistentId = uuid();

      const result = await learningLogService.tryGetById(nonExistentId);
      expect(result).toBeNull();
    });
  });

  test("selectオプションで指定フィールドのみを取得できる", async () => {
    await runInRollbackTx(async (tx) => {
      // (1) ユーザー作成
      const userId = uuid();
      const userName = "検査 官太郎";
      const userService = new UserService(tx);
      await userService.createAsStudent(userId, userName);

      // (2) 学習ログ作成
      const learningLogService = new LearningLogService(tx);
      const createdLog = await learningLogService.create(
        userId,
        mockLearningLog,
      );

      // (3) selectオプションで id / description / spentMinutes のみを取得指定
      const selectedLog = await learningLogService.tryGetById(createdLog.id, {
        select: {
          id: true,
          description: true,
          spentMinutes: true,
        },
      });
      expect(selectedLog).toBeDefined();
      expect(selectedLog!.id).toBe(createdLog.id);
      expect(selectedLog!.description).toBe(mockLearningLog.description);
      expect(selectedLog!.spentMinutes).toBe(mockLearningLog.spentMinutes);

      // (4) 選択していないフィールドは undefined であることを確認
      expect(selectedLog!.title).toBeUndefined();
      expect(selectedLog!.reflections).toBeUndefined();
      expect(selectedLog!.userId).toBeUndefined();
    });
  });

  test("includeオプションでUserリレーションを含めて取得できる", async () => {
    await runInRollbackTx(async (tx) => {
      // (1) ユーザー作成
      const userId = uuid();
      const userName = "検査 官太郎";
      const userService = new UserService(tx);
      await userService.createAsStudent(userId, userName);

      // (2) 学習ログ作成
      const learningLogService = new LearningLogService(tx);
      const createdLog = await learningLogService.create(
        userId,
        mockLearningLog,
      );

      // (3) includeオプションで User を含めて取得
      const logWithUser = await learningLogService.tryGetById(createdLog.id, {
        include: {
          user: true,
        },
      });

      // (4) 取得結果の検証
      expect(logWithUser).toBeDefined();
      expect(logWithUser!.id).toBe(createdLog.id);
      expect(logWithUser!.userId).toBe(userId);
      expect(logWithUser!.user).toBeDefined();
      expect(logWithUser!.user.id).toBe(userId);
      expect(logWithUser!.user.name).toBe(userName);
      expect(logWithUser!.user.role).toBe(Role.STUDENT);
    });
  });
});
