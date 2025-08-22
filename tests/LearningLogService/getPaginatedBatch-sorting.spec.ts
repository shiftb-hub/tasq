import { describe, expect, test } from "vitest";
import { runInRollbackTx } from "../setup/prisma.setup";
import { LearningLogService } from "@/app/_services/learningLogService";
import {
  createDummyLearningLogData,
  createNullStartedAtLogData,
} from "./helpers/test-data-generator";
import { createTestUser, createBulkLearningLogs } from "./helpers/test-setup";

describe("LearningLogService.getPaginatedBatch - ソート機能", () => {
  const dummyLogs = createDummyLearningLogData();

  test("昇順ソート", async () => {
    await runInRollbackTx(async (tx) => {
      const { id: userId } = await createTestUser(tx);
      await createBulkLearningLogs(tx, userId, dummyLogs);

      const learningLogService = new LearningLogService(tx);
      // 昇順ソートで取得
      const batch = await learningLogService.getPaginatedBatch(
        userId,
        1,
        5,
        "asc",
      );

      expect(batch.learningLogs).toHaveLength(5);
      expect(batch.sortOrder).toBe("asc");

      // 昇順の場合、最古（#01）から順番に表示されることを確認
      expect(batch.learningLogs[0].title).toBe("#01");
      expect(batch.learningLogs[1].title).toBe("#02");
      expect(batch.learningLogs[2].title).toBe("#03");
      expect(batch.learningLogs[3].title).toBe("#04");
      expect(batch.learningLogs[4].title).toBe("#05");
    });
  });

  test("startedAtがnullのデータが先頭に表示される（降順）", async () => {
    await runInRollbackTx(async (tx) => {
      const { id: userId } = await createTestUser(tx);

      const learningLogService = new LearningLogService(tx);

      // 通常のデータを3件作成
      await createBulkLearningLogs(tx, userId, dummyLogs.slice(0, 3));

      // startedAtがnullのデータを作成
      const nullStartedAtLog = createNullStartedAtLogData();
      await learningLogService.create(userId, nullStartedAtLog);

      // 降順で取得
      const batchDesc = await learningLogService.getPaginatedBatch(
        userId,
        1,
        10,
        "desc",
      );

      // startedAtがnullのデータが先頭に表示されることを確認
      expect(batchDesc.learningLogs[0].title).toBe("#NULL");
      expect(batchDesc.learningLogs[0].startedAt).toBeUndefined();
    });
  });

  test("startedAtがnullのデータが先頭に表示される（昇順）", async () => {
    await runInRollbackTx(async (tx) => {
      const { id: userId } = await createTestUser(tx);

      const learningLogService = new LearningLogService(tx);

      // 通常のデータを3件作成
      await createBulkLearningLogs(tx, userId, dummyLogs.slice(0, 3));

      // startedAtがnullのデータを作成
      const nullStartedAtLog = createNullStartedAtLogData();
      await learningLogService.create(userId, nullStartedAtLog);

      // 昇順で取得
      const batchAsc = await learningLogService.getPaginatedBatch(
        userId,
        1,
        10,
        "asc",
      );

      // 昇順でもstartedAtがnullのデータが先頭に表示されることを確認
      expect(batchAsc.learningLogs[0].title).toBe("#NULL");
      expect(batchAsc.learningLogs[0].startedAt).toBeUndefined();
    });
  });

  test("複数のstartedAtがnullのデータの順序（createdAt、idでのソート）", async () => {
    await runInRollbackTx(async (tx) => {
      const { id: userId } = await createTestUser(tx);

      const learningLogService = new LearningLogService(tx);

      // 複数のstartedAtがnullのデータを作成
      const nullLog1 = { ...createNullStartedAtLogData(), title: "#NULL1" };
      const nullLog2 = { ...createNullStartedAtLogData(), title: "#NULL2" };
      const nullLog3 = { ...createNullStartedAtLogData(), title: "#NULL3" };

      // 順番に作成（createdAtが異なるようになる）
      await learningLogService.create(userId, nullLog1);
      await learningLogService.create(userId, nullLog2);
      await learningLogService.create(userId, nullLog3);

      // 降順で取得
      const batchDesc = await learningLogService.getPaginatedBatch(
        userId,
        1,
        10,
        "desc",
      );

      // startedAtがnullのデータが作成順の逆順（createdAtの降順）で表示されることを確認
      expect(batchDesc.learningLogs[0].title).toBe("#NULL3");
      expect(batchDesc.learningLogs[1].title).toBe("#NULL2");
      expect(batchDesc.learningLogs[2].title).toBe("#NULL1");

      // 昇順で取得
      const batchAsc = await learningLogService.getPaginatedBatch(
        userId,
        1,
        10,
        "asc",
      );

      // 昇順の場合は作成順（createdAtの昇順）で表示されることを確認
      expect(batchAsc.learningLogs[0].title).toBe("#NULL1");
      expect(batchAsc.learningLogs[1].title).toBe("#NULL2");
      expect(batchAsc.learningLogs[2].title).toBe("#NULL3");
    });
  });
});
