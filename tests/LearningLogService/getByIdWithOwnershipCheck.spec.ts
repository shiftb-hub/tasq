import { describe, expect, test } from "vitest";
import { runInRollbackTx } from "../setup/prisma.setup";
import { LearningLogService } from "@/app/_services/learningLogService";
import { UserService } from "@/app/_services/userService";
import {
  mockLearningLog,
  mockLearningLogWithOptionalFields,
} from "./helpers/common-mock-data";
import {
  LearningLogNotFoundError,
  UserPermissionDeniedError,
} from "@/app/_libs/errors";
import { v4 as uuid } from "uuid";

describe("LearningLogService getByIdWithOwnershipCheck", () => {
  test("他のユーザーの学習ログアクセスでUserPermissionDeniedErrorが発生する", async () => {
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

      // ユーザB が ユーザA の学習ログにアクセス → UserPermissionDeniedError がスロー
      await expect(
        learningLogService.getByIdWithOwnershipCheck(userBId, createdLog.id),
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

      // userId=nullで取得（所有権チェックをスキップ）
      const retrievedLog = await learningLogService.getByIdWithOwnershipCheck(
        null,
        createdLog.id,
      );

      // 取得結果の検証
      expect(retrievedLog).toBeDefined();
      expect(retrievedLog.id).toBe(createdLog.id);
      expect(retrievedLog.userId).toBe(userId);
      expect(retrievedLog.title).toBe(mockLearningLog.title);
    });
  });

  test("所有権を確認して学習ログを正常に取得できる", async () => {
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

      // (3) 正しい所有者を指定して取得
      const retrievedLog = await learningLogService.getByIdWithOwnershipCheck(
        userId,
        createdLog.id,
      );

      // (4) 取得結果の検証
      expect(retrievedLog).toBeDefined();
      expect(retrievedLog.id).toBe(createdLog.id);
      expect(retrievedLog.userId).toBe(userId);
      expect(retrievedLog.title).toBe(mockLearningLog.title);
      expect(retrievedLog.description).toBe(mockLearningLog.description);
      expect(retrievedLog.reflections).toBe(mockLearningLog.reflections);
      expect(retrievedLog.spentMinutes).toBe(mockLearningLog.spentMinutes);
    });
  });

  test("存在しない学習ログでLearningLogNotFoundErrorが発生する", async () => {
    await runInRollbackTx(async (tx) => {
      const learningLogService = new LearningLogService(tx);
      const nonExistentId = uuid(); // 存在しない学習ログID

      await expect(
        learningLogService.getByIdWithOwnershipCheck(null, nonExistentId),
      ).rejects.toThrow(LearningLogNotFoundError);
    });
  });

  test("selectオプションで指定フィールドのみ取得", async () => {
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

      // (3) selectオプションでtitleとuserIdのみ取得
      const selectedLog = await learningLogService.getByIdWithOwnershipCheck(
        userId,
        createdLog.id,
        {
          select: {
            id: true,
            title: true,
            userId: true,
          },
        },
      );

      // (4) 指定したフィールドが存在することを確認
      expect(selectedLog.id).toBe(createdLog.id);
      expect(selectedLog.title).toBe(mockLearningLog.title);
      expect(selectedLog.userId).toBe(userId);

      // (5) 選択していないフィールドは undefined であることを確認
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- selectで除外されたフィールドの実行時チェックのため
      expect((selectedLog as any).description).toBeUndefined();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- selectで除外されたフィールドの実行時チェックのため
      expect((selectedLog as any).reflections).toBeUndefined();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- selectで除外されたフィールドの実行時チェックのため
      expect((selectedLog as any).spentMinutes).toBeUndefined();
    });
  });

  test("型変換テスト - null値の扱い", async () => {
    await runInRollbackTx(async (tx) => {
      // (1) ユーザー作成
      const userId = uuid();
      const userName = "検査 官太郎";
      const userService = new UserService(tx);
      await userService.createAsStudent(userId, userName);

      // (2) taskId, startedAt, endedAt が undefined の学習ログを作成
      const learningLogService = new LearningLogService(tx);
      const createdLog = await learningLogService.create(
        userId,
        mockLearningLogWithOptionalFields,
      );

      // (3) getByIdWithOwnershipCheckでも同様の変換がされることを確認
      const retrievedLog = await learningLogService.getByIdWithOwnershipCheck(
        userId,
        createdLog.id,
      );

      expect(retrievedLog.taskId).toBeNull(); // Prisma の生の型なので null
      expect(retrievedLog.startedAt).toBeNull();
      expect(retrievedLog.endedAt).toBeNull();
    });
  });

  test("selectでuserIdを除外した場合でも所有者は正常にアクセスできる", async () => {
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

      // (3) selectオプションでuserIdを除外してtitleとidのみ取得
      const selectedLog = await learningLogService.getByIdWithOwnershipCheck(
        userId,
        createdLog.id,
        {
          select: {
            id: true,
            title: true,
          },
        },
      );

      // (4) 指定したフィールドが正常に取得できることを確認
      expect(selectedLog.id).toBe(createdLog.id);
      expect(selectedLog.title).toBe(mockLearningLog.title);

      // (5) 選択していないフィールドは undefined であることを確認
      //     - selectで除外されたフィールドの実行時チェックのため意図的に any 型にキャスト
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((selectedLog as any).userId).toBeUndefined();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((selectedLog as any).description).toBeUndefined();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((selectedLog as any).reflections).toBeUndefined();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((selectedLog as any).spentMinutes).toBeUndefined();
    });
  });

  test("selectでuserIdを除外した場合でも非所有者にはUserPermissionDeniedErrorが発生する", async () => {
    await runInRollbackTx(async (tx) => {
      // (1) ユーザA作成
      const userAId = uuid();
      const userAName = "品質 管理代";
      const userService = new UserService(tx);
      await userService.createAsStudent(userAId, userAName);

      // (2) ユーザB作成
      const userBId = uuid();
      const userBName = "不具合 退治丸";
      await userService.createAsStudent(userBId, userBName);

      // (3) ユーザAの学習ログ作成
      const learningLogService = new LearningLogService(tx);
      const createdLog = await learningLogService.create(
        userAId,
        mockLearningLog,
      );

      // (4) ユーザBがselectでuserIdを除外してアクセス → UserPermissionDeniedErrorがスロー
      await expect(
        learningLogService.getByIdWithOwnershipCheck(userBId, createdLog.id, {
          select: {
            id: true,
            title: true,
          },
        }),
      ).rejects.toThrow(UserPermissionDeniedError);
    });
  });
});
