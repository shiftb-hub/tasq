import { describe, expect, test } from "vitest";
import { runInRollbackTx } from "../setup/prisma.setup";
import { LearningLogService } from "@/app/_services/learningLogService";
import { createDummyLearningLogData } from "./helpers/test-data-generator";
import {
  createTestUser,
  setupMultipleUsersWithLogs,
  createBulkLearningLogs,
} from "./helpers/test-setup";

describe("LearningLogService.getPaginatedBatch - エッジケース", () => {
  const dummyLogs = createDummyLearningLogData();

  test("データが存在しない場合", async () => {
    await runInRollbackTx(async (tx) => {
      const { id: userId } = await createTestUser(tx);

      const learningLogService = new LearningLogService(tx);
      // データを作成せずに取得
      const batch = await learningLogService.getPaginatedBatch(userId);

      expect(batch.learningLogs).toHaveLength(0);
      expect(batch.pageInfo.page).toBe(1);
      expect(batch.pageInfo.perPage).toBe(5);
      expect(batch.pageInfo.total).toBe(0);
    });
  });

  test("存在しないページ", async () => {
    await runInRollbackTx(async (tx) => {
      const { id: userId } = await createTestUser(tx);
      // 5件のダミーデータを作成
      await createBulkLearningLogs(tx, userId, dummyLogs.slice(0, 5));

      const learningLogService = new LearningLogService(tx);
      // 存在しない3ページ目を取得
      const batch = await learningLogService.getPaginatedBatch(
        userId,
        3,
        5,
        "desc",
      );

      expect(batch.learningLogs).toHaveLength(0);
      expect(batch.pageInfo.page).toBe(3);
      expect(batch.pageInfo.perPage).toBe(5);
      expect(batch.pageInfo.total).toBe(5);
    });
  });

  test("異なるユーザーのデータは取得されない", async () => {
    await runInRollbackTx(async (tx) => {
      // 2人のユーザーを作成し、それぞれに異なる数の学習ログを作成
      const users = await setupMultipleUsersWithLogs(
        tx,
        [
          { userName: "不具合 退治丸", logCount: 10, startIndex: 0 },
          { userName: "品質 管理代", logCount: 5, startIndex: 10 },
        ],
        dummyLogs,
      );

      const learningLogService = new LearningLogService(tx);

      // ユーザー1のデータのみ取得されることを確認
      const batch1 = await learningLogService.getPaginatedBatch(users[0].id);
      expect(batch1.learningLogs).toHaveLength(5); // 1ページ5件
      expect(batch1.pageInfo.total).toBe(10);

      // ユーザー2のデータのみ取得されることを確認
      const batch2 = await learningLogService.getPaginatedBatch(users[1].id);
      expect(batch2.learningLogs).toHaveLength(5);
      expect(batch2.pageInfo.total).toBe(5);
    });
  });

  test("存在しないユーザーIDでの呼び出し", async () => {
    await runInRollbackTx(async (tx) => {
      const learningLogService = new LearningLogService(tx);
      const nonExistentUserId = "non-existent-user-id";

      // 存在しないユーザーIDでも正常に動作する（空の結果を返す）
      const batch =
        await learningLogService.getPaginatedBatch(nonExistentUserId);

      expect(batch.learningLogs).toHaveLength(0);
      expect(batch.pageInfo.page).toBe(1);
      expect(batch.pageInfo.perPage).toBe(5);
      expect(batch.pageInfo.total).toBe(0);
    });
  });

  test("大量データでのページネーション", async () => {
    await runInRollbackTx(async (tx) => {
      const { id: userId } = await createTestUser(tx);
      // 全99件のダミーデータを作成
      await createBulkLearningLogs(tx, userId, dummyLogs);

      const learningLogService = new LearningLogService(tx);

      // 中間のページをテスト（10ページ目）
      const batch = await learningLogService.getPaginatedBatch(
        userId,
        10,
        5,
        "desc",
      );

      expect(batch.learningLogs).toHaveLength(5);
      expect(batch.pageInfo.page).toBe(10);
      expect(batch.pageInfo.total).toBe(99);

      // 10ページ目の内容を確認（降順なので #54, #53, #52, #51, #50）
      // 10ページ目 = skip: (10-1)*5 = 45件, take: 5件
      // 降順なので #99から数えて 46-50番目 = #54, #53, #52, #51, #50
      expect(batch.learningLogs[0].title).toBe("#54");
      expect(batch.learningLogs[1].title).toBe("#53");
      expect(batch.learningLogs[2].title).toBe("#52");
      expect(batch.learningLogs[3].title).toBe("#51");
      expect(batch.learningLogs[4].title).toBe("#50");
    });
  });

  test("1件のみのデータでのページネーション", async () => {
    await runInRollbackTx(async (tx) => {
      const { id: userId } = await createTestUser(tx);
      // 1件のみのダミーデータを作成
      await createBulkLearningLogs(tx, userId, dummyLogs.slice(0, 1));

      const learningLogService = new LearningLogService(tx);
      const batch = await learningLogService.getPaginatedBatch(userId);

      expect(batch.learningLogs).toHaveLength(1);
      expect(batch.pageInfo.page).toBe(1);
      expect(batch.pageInfo.perPage).toBe(5);
      expect(batch.pageInfo.total).toBe(1);
      expect(batch.learningLogs[0].title).toBe("#01");
    });
  });

  test("perPageより少ないデータでのページネーション", async () => {
    await runInRollbackTx(async (tx) => {
      const { id: userId } = await createTestUser(tx);
      // 3件のダミーデータを作成
      await createBulkLearningLogs(tx, userId, dummyLogs.slice(0, 3));

      const learningLogService = new LearningLogService(tx);
      const batch = await learningLogService.getPaginatedBatch(
        userId,
        1,
        5,
        "desc",
      );

      expect(batch.learningLogs).toHaveLength(3);
      expect(batch.pageInfo.page).toBe(1);
      expect(batch.pageInfo.perPage).toBe(5);
      expect(batch.pageInfo.total).toBe(3);

      // 降順で3件表示
      expect(batch.learningLogs[0].title).toBe("#03");
      expect(batch.learningLogs[1].title).toBe("#02");
      expect(batch.learningLogs[2].title).toBe("#01");
    });
  });
});
