import { describe, expect, test } from "vitest";
import { runInRollbackTx } from "../setup/prisma.setup";
import { LearningLogService } from "@/app/_services/learningLogService";
import { UserService } from "@/app/_services/userService";
import {
  mockLearningLogs,
  mockLearningLogWithOptionalFields,
} from "./helpers/common-mock-data";
import { learningLogInsertRequestSchema } from "@/app/_types/LearningLog";
import { v4 as uuid } from "uuid";

describe("LearningLogService create", () => {
  test("LearningLogInsertRequestデータのzod検証", () => {
    for (const [index, request] of mockLearningLogs.entries()) {
      expect(() => learningLogInsertRequestSchema.parse(request)).not.toThrow(
        `Index ${index} should be valid LearningLogInsertRequest`,
      );
    }
  });

  test("count - 学習ログ数を正しく取得できる", async () => {
    await runInRollbackTx(async (tx) => {
      const learningLogService = new LearningLogService(tx);
      const initialCount = await learningLogService.count();

      // ユーザー作成
      const userId = uuid();
      const userName = "検査 官太郎";
      const userService = new UserService(tx);
      await userService.createAsStudent(userId, userName);

      // 学習ログ作成前後でカウントが増加（+1）することを確認
      const logData = mockLearningLogs[0];
      await learningLogService.create(userId, logData);

      const afterCount = await learningLogService.count();
      expect(afterCount).toBe(initialCount + 1);
    });
  });

  test("学習ログを正常に「新規作成」できる", async () => {
    await runInRollbackTx(async (tx) => {
      // (1) ユーザ作成
      const userId = uuid();
      const userName = "検査 官太郎";
      const userService = new UserService(tx);
      await userService.createAsStudent(userId, userName);

      // (2) ユーザ作成の確認
      const createdUser = await userService.getById(userId);
      expect(createdUser.name).toBe(userName);

      // (3) 学習ログサービスの初期化
      const learningLogService = new LearningLogService(tx);
      const initialCount = await learningLogService.count();

      // (4) 学習ログの新規作成
      const logData = mockLearningLogs[0];
      const createdLog = await learningLogService.create(userId, logData);

      // (5) 作成結果の検証
      expect(createdLog).toBeDefined();
      expect(createdLog.id).toBeDefined();
      expect(createdLog.userId).toBe(userId);
      expect(createdLog.title).toBe(logData.title);
      expect(createdLog.description).toBe(logData.description);
      expect(createdLog.reflections).toBe(logData.reflections);
      expect(createdLog.spentMinutes).toBe(logData.spentMinutes);
      expect(createdLog.startedAt).toEqual(logData.startedAt);
      expect(createdLog.endedAt).toEqual(logData.endedAt);

      // (6) カウント増加の確認
      expect(await learningLogService.count()).toBe(initialCount + 1);
    });
  });

  test("型変換テスト - null値がundefinedに変換される", async () => {
    await runInRollbackTx(async (tx) => {
      // ユーザー作成
      const userId = uuid();
      const userName = "検査 官太郎";
      const userService = new UserService(tx);
      await userService.createAsStudent(userId, userName);

      // taskId, startedAt, endedAt が undefined の学習ログを作成
      const learningLogService = new LearningLogService(tx);
      const createdLog = await learningLogService.create(
        userId,
        mockLearningLogWithOptionalFields,
      );

      // 作成されたログの型を確認
      expect(createdLog.taskId).toBeUndefined(); // nullからundefinedに変換されている
      expect(createdLog.startedAt).toBeUndefined(); // nullからundefinedに変換されている
      expect(createdLog.endedAt).toBeUndefined(); // nullからundefinedに変換されている

      // 他のフィールドは正常に設定されている
      expect(createdLog.title).toBe(mockLearningLogWithOptionalFields.title);
      expect(createdLog.spentMinutes).toBe(
        mockLearningLogWithOptionalFields.spentMinutes,
      );
    });
  });

  test("型変換テスト - createdAtフィールドが除去される", async () => {
    await runInRollbackTx(async (tx) => {
      // ユーザー作成
      const userId = uuid();
      const userName = "検査 官太郎";
      const userService = new UserService(tx);
      await userService.createAsStudent(userId, userName);

      // 学習ログ作成
      const learningLogService = new LearningLogService(tx);
      const logData = mockLearningLogs[0];
      const createdLog = await learningLogService.create(userId, logData);

      // createdAtプロパティが除去されていることを確認
      expect("createdAt" in createdLog).toBe(false);

      // 他の必要なプロパティは存在していることを確認
      expect(createdLog.id).toBeDefined();
      expect(createdLog.userId).toBeDefined();
      expect(createdLog.title).toBeDefined();
    });
  });

  test("複数の学習ログを作成する総合テスト", async () => {
    await runInRollbackTx(async (tx) => {
      // ユーザ作成
      const userId = uuid();
      const userName = "検査 官太郎";
      const userService = new UserService(tx);
      await userService.createAsStudent(userId, userName);

      const learningLogService = new LearningLogService(tx);
      const initialCount = await learningLogService.count();

      // 複数の学習ログを作成
      const createdLogs = [];
      for (const logData of mockLearningLogs) {
        const createdLog = await learningLogService.create(userId, logData);
        createdLogs.push(createdLog);
      }

      // 全て作成されたことを確認
      expect(await learningLogService.count()).toBe(
        initialCount + mockLearningLogs.length,
      );

      // 各ログが正しく取得できることを確認
      for (const [index, createdLog] of createdLogs.entries()) {
        const retrievedLog = await learningLogService.getByIdWithOwnershipCheck(
          userId,
          createdLog.id,
        );
        expect(retrievedLog.title).toBe(mockLearningLogs[index].title);
      }
    });
  });
});