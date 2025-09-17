import { describe, expect, test } from "vitest";
import { runInRollbackTx } from "../setup/prisma.setup";
import { StudentService } from "@/app/_services/studentService";
import {
  createBasicTestData,
  createStuckStudentsTestData,
  createEmptyTestData,
  createLargeTestData,
  createTestDataWithManyTasks,
} from "./helpers/test-setup";

describe("StudentService getStudentsWithStats - エッジケース", () => {
  test("受講生が0人の場合は空配列を返す", async () => {
    await runInRollbackTx(async (tx) => {
      // 空のデータベース状態を作成
      const testData = await createEmptyTestData(tx);

      const studentService = new StudentService(tx);
      const result = await studentService.getStudentsWithStats();

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });
  });

  test("大量の受講生（50人）でも正常動作する", async () => {
    await runInRollbackTx(async (tx) => {
      // 50人の受講生を作成
      const testData = await createLargeTestData(tx, 50);

      const studentService = new StudentService(tx);
      const result = await studentService.getStudentsWithStats();

      expect(result).toBeDefined();
      expect(result.length).toBe(50);

      // 各受講生のデータ構造を確認
      for (const student of result) {
        expect(student).toMatchObject({
          id: expect.any(String),
          name: expect.any(String),
          role: expect.any(String),
          currentChapter: expect.any(Number),
          favorite: expect.any(Boolean),
          totalTasks: expect.any(Number),
          stuckTasks: expect.any(Number),
          stuckTasksTrend: expect.any(Number),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });
      }
    });
  });

  test("詰まりタスクが0個の受講生でも正常動作する", async () => {
    await runInRollbackTx(async (tx) => {
      // 基本テストデータ（詰まりタスクなし）を作成
      const testData = await createBasicTestData(tx);

      const studentService = new StudentService(tx);
      const result = await studentService.getStudentsWithStats();

      expect(result).toBeDefined();
      expect(result.length).toBe(testData.students.length);

      // 全受講生の詰まりタスク数が0以上であることを確認
      for (const student of result) {
        expect(student.stuckTasks).toBeGreaterThanOrEqual(0);
        expect(student.totalTasks).toBeGreaterThanOrEqual(student.stuckTasks);
      }
    });
  });

  test("全タスクが詰まりタスクの受講生でも正常動作する", async () => {
    await runInRollbackTx(async (tx) => {
      // 詰まりタスクを持つ受講生を含むテストデータを作成
      const testData = await createStuckStudentsTestData(tx);

      const studentService = new StudentService(tx);
      const result = await studentService.getStudentsWithStats();

      expect(result).toBeDefined();

      // 詰まりタスクを持つ受講生を特定
      const stuckStudent = result.find((student) => student.name === "困り助 太郎");
      expect(stuckStudent).toBeDefined();

      if (stuckStudent) {
        // 詰まりタスク数が全タスク数と等しいことを確認
        expect(stuckStudent.stuckTasks).toBe(stuckStudent.totalTasks);
        expect(stuckStudent.stuckTasks).toBeGreaterThan(0);
      }
    });
  });

  test("プロフィール画像なしの受講生でも正常動作する", async () => {
    await runInRollbackTx(async (tx) => {
      // 基本テストデータを作成（profileImageKeyはnull）
      const testData = await createBasicTestData(tx);

      const studentService = new StudentService(tx);
      const result = await studentService.getStudentsWithStats();

      expect(result).toBeDefined();
      expect(result.length).toBe(testData.students.length);

      // プロフィール画像がnullでも正常に処理されることを確認
      for (const student of result) {
        expect(
          student.profileImageKey === null || typeof student.profileImageKey === "string",
        ).toBe(true);
      }
    });
  });

  test("SlackIDなしの受講生でも正常動作する", async () => {
    await runInRollbackTx(async (tx) => {
      // 基本テストデータを作成（slackIdはnull）
      const testData = await createBasicTestData(tx);

      const studentService = new StudentService(tx);
      const result = await studentService.getStudentsWithStats();

      expect(result).toBeDefined();
      expect(result.length).toBe(testData.students.length);

      // SlackIDがnullでも正常に処理されることを確認
      for (const student of result) {
        expect(student.slackId === null || typeof student.slackId === "string").toBe(true);
      }
    });
  });

  test("currentChapterがnullの受講生でも正常動作する", async () => {
    await runInRollbackTx(async (tx) => {
      // 基本テストデータを作成
      const testData = await createBasicTestData(tx);

      const studentService = new StudentService(tx);
      const result = await studentService.getStudentsWithStats();

      expect(result).toBeDefined();
      expect(result.length).toBe(testData.students.length);

      // currentChapterが0以上であることを確認（nullの場合は0に変換される）
      for (const student of result) {
        expect(student.currentChapter).toBeGreaterThanOrEqual(0);
        expect(typeof student.currentChapter).toBe("number");
      }
    });
  });

  test("大量のタスク（1000個）でも正常動作する", async () => {
    await runInRollbackTx(async (tx) => {
      // 大量のタスクを持つテストデータを作成
      const testData = await createTestDataWithManyTasks(tx, 1000);

      const studentService = new StudentService(tx);
      const result = await studentService.getStudentsWithStats();

      expect(result).toBeDefined();
      expect(result.length).toBe(testData.students.length);

      // 大量のタスクでも正常に集計されることを確認
      for (const student of result) {
        expect(student.totalTasks).toBeGreaterThanOrEqual(0);
        expect(student.stuckTasks).toBeGreaterThanOrEqual(0);
        expect(student.stuckTasks).toBeLessThanOrEqual(student.totalTasks);
      }
    });
  });
});
