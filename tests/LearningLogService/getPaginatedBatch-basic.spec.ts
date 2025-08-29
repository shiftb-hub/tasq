import { describe, expect, test } from "vitest";
import { runInRollbackTx } from "../setup/prisma.setup";
import { LearningLogService } from "@/app/_services/learningLogService";
import { createDummyLearningLogData } from "./helpers/test-data-generator";
import { createTestUser, createBulkLearningLogs } from "./helpers/test-setup";

describe("LearningLogService.getPaginatedBatch - 基本的なページネーション", () => {
  const dummyLogs = createDummyLearningLogData();

  test("デフォルトパラメータ（1ページ目、5件、降順）", async () => {
    await runInRollbackTx(async (tx) => {
      const { id: userId } = await createTestUser(tx);
      await createBulkLearningLogs(tx, userId, dummyLogs);

      const learningLogService = new LearningLogService(tx);
      const batch = await learningLogService.getPaginatedBatch(userId);

      // 基本検証
      expect(batch.learningLogs).toHaveLength(5);
      expect(batch.pageInfo.page).toBe(1);
      expect(batch.pageInfo.perPage).toBe(5);
      expect(batch.pageInfo.total).toBe(99);
      expect(batch.sortOrder).toBe("desc");

      // 降順の場合、最新（#99）から順番に表示されることを確認
      expect(batch.learningLogs[0].title).toBe("#99");
      expect(batch.learningLogs[1].title).toBe("#98");
      expect(batch.learningLogs[2].title).toBe("#97");
      expect(batch.learningLogs[3].title).toBe("#96");
      expect(batch.learningLogs[4].title).toBe("#95");
    });
  });

  test("2ページ目を取得", async () => {
    await runInRollbackTx(async (tx) => {
      const { id: userId } = await createTestUser(tx);
      await createBulkLearningLogs(tx, userId, dummyLogs);

      const learningLogService = new LearningLogService(tx);
      const batch = await learningLogService.getPaginatedBatch(
        userId,
        2,
        5,
        "desc",
      );

      // 基本検証
      expect(batch.learningLogs).toHaveLength(5);
      expect(batch.pageInfo.page).toBe(2);
      expect(batch.pageInfo.perPage).toBe(5);
      expect(batch.pageInfo.total).toBe(99);

      // 2ページ目の内容を確認（降順）
      expect(batch.learningLogs[0].title).toBe("#94");
      expect(batch.learningLogs[1].title).toBe("#93");
      expect(batch.learningLogs[2].title).toBe("#92");
      expect(batch.learningLogs[3].title).toBe("#91");
      expect(batch.learningLogs[4].title).toBe("#90");
    });
  });

  test("1ページあたりの件数を変更", async () => {
    await runInRollbackTx(async (tx) => {
      const { id: userId } = await createTestUser(tx);
      // 15件のダミーデータを作成
      await createBulkLearningLogs(tx, userId, dummyLogs.slice(0, 15));

      const learningLogService = new LearningLogService(tx);
      // 1ページ10件で取得
      const batch = await learningLogService.getPaginatedBatch(
        userId,
        1,
        10,
        "desc",
      );

      expect(batch.learningLogs).toHaveLength(10);
      expect(batch.pageInfo.perPage).toBe(10);
      expect(batch.pageInfo.total).toBe(15);
    });
  });

  test("最後のページ（端数）", async () => {
    await runInRollbackTx(async (tx) => {
      const { id: userId } = await createTestUser(tx);
      await createBulkLearningLogs(tx, userId, dummyLogs);

      const learningLogService = new LearningLogService(tx);
      // 最後のページ（20ページ目、1ページ5件の場合）
      const lastPage = Math.ceil(99 / 5); // 20ページ
      const batch = await learningLogService.getPaginatedBatch(
        userId,
        lastPage,
        5,
        "desc",
      );

      // 最後のページは4件のみ
      expect(batch.learningLogs).toHaveLength(4);
      expect(batch.pageInfo.page).toBe(20);
      expect(batch.pageInfo.total).toBe(99);

      // 最後のページの内容を確認（降順なので #04, #03, #02, #01）
      expect(batch.learningLogs[0].title).toBe("#04");
      expect(batch.learningLogs[1].title).toBe("#03");
      expect(batch.learningLogs[2].title).toBe("#02");
      expect(batch.learningLogs[3].title).toBe("#01");
    });
  });
});
