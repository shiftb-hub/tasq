import { describe, expect, test } from "vitest";
import { runInRollbackTx } from "../setup/prisma.setup";
import { StudentService } from "@/app/_services/studentService";
import { createBasicTestData, createStuckStudentsTestData } from "./helpers/test-setup";
import { expectedStudentListItemStructure } from "./helpers/common-mock-data";

describe("StudentService getStudentsWithStats - 基本機能", () => {
  test("受講生一覧を正常に取得できる", async () => {
    await runInRollbackTx(async (tx) => {
      // セットアップ: 基本テストデータ作成
      const testData = await createBasicTestData(tx);

      // 実行: StudentServiceの初期化と実行
      const studentService = new StudentService(tx);
      const result = await studentService.getStudentsWithStats();

      // 検証: 戻り値の基本構造
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(testData.students.length);

      // 各受講生のデータ構造を検証
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

        // null許容フィールドの確認
        expect(
          student.profileImageKey === null || typeof student.profileImageKey === "string",
        ).toBe(true);
        expect(student.slackId === null || typeof student.slackId === "string").toBe(true);
      }
    });
  });

  test("教師IDありで正しくお気に入りフラグが設定される", async () => {
    await runInRollbackTx(async (tx) => {
      // セットアップ: 基本テストデータ作成
      const testData = await createBasicTestData(tx);
      const teacherId = testData.teachers[0].id;

      // 実行: 教師IDを指定して実行
      const studentService = new StudentService(tx);
      const result = await studentService.getStudentsWithStats(teacherId);

      // 検証: お気に入りフラグの設定確認
      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);

      // お気に入りに登録されている受講生を確認
      const favoriteStudents = result.filter((student) => student.favorite);
      expect(favoriteStudents.length).toBeGreaterThan(0);

      // 特定の受講生がお気に入りに登録されていることを確認
      const expectedFavoriteStudent = result.find((student) =>
        testData.students.some((s) => s.id === student.id && s.id === testData.students[0].id),
      );
      expect(expectedFavoriteStudent?.favorite).toBe(true);
    });
  });

  test("教師IDなしでも正常動作する", async () => {
    await runInRollbackTx(async (tx) => {
      // セットアップ: 基本テストデータ作成
      const testData = await createBasicTestData(tx);

      // 実行: 教師IDなしで実行
      const studentService = new StudentService(tx);
      const result = await studentService.getStudentsWithStats();

      // 検証: お気に入りフラグが全てfalseであることを確認
      expect(result).toBeDefined();
      expect(result.length).toBe(testData.students.length);

      for (const student of result) {
        expect(student.favorite).toBe(false);
      }
    });
  });

  test("詰まりタスクカウントが正しく計算される", async () => {
    await runInRollbackTx(async (tx) => {
      // セットアップ: 詰まりタスクを持つ受講生を含むテストデータ作成
      const testData = await createStuckStudentsTestData(tx);

      // 実行: StudentService実行
      const studentService = new StudentService(tx);
      const result = await studentService.getStudentsWithStats();

      // 検証: 詰まりタスクの計算確認
      expect(result).toBeDefined();

      // 詰まりタスクを持つ受講生を特定
      const stuckStudent = result.find((student) => student.name === "困り助 太郎");
      expect(stuckStudent).toBeDefined();
      expect(stuckStudent!.stuckTasks).toBeGreaterThan(0);

      // 全受講生の詰まりタスク数が0以上であることを確認
      for (const student of result) {
        expect(student.stuckTasks).toBeGreaterThanOrEqual(0);
        expect(student.totalTasks).toBeGreaterThanOrEqual(student.stuckTasks);
      }
    });
  });

  test("直近7日間のトレンドが正しく計算される", async () => {
    await runInRollbackTx(async (tx) => {
      // セットアップ: 基本テストデータ作成
      const testData = await createBasicTestData(tx);

      // 実行: StudentService実行
      const studentService = new StudentService(tx);
      const result = await studentService.getStudentsWithStats();

      // 検証: トレンド値の計算確認
      expect(result).toBeDefined();

      for (const student of result) {
        expect(typeof student.stuckTasksTrend).toBe("number");
        // トレンド値は整数であることを確認
        expect(Number.isInteger(student.stuckTasksTrend)).toBe(true);
      }
    });
  });

  test("受講生データの型変換が正しく行われる", async () => {
    await runInRollbackTx(async (tx) => {
      // セットアップ: 基本テストデータ作成
      const testData = await createBasicTestData(tx);

      // 実行: StudentService実行
      const studentService = new StudentService(tx);
      const result = await studentService.getStudentsWithStats();

      // 検証: 型変換の確認
      expect(result).toBeDefined();
      expect(result.length).toBe(testData.students.length);

      for (const student of result) {
        // 文字列型の確認
        expect(typeof student.id).toBe("string");
        expect(typeof student.name).toBe("string");
        expect(typeof student.role).toBe("string");
        expect(typeof student.createdAt).toBe("string");
        expect(typeof student.updatedAt).toBe("string");

        // 数値型の確認
        expect(typeof student.currentChapter).toBe("number");
        expect(typeof student.totalTasks).toBe("number");
        expect(typeof student.stuckTasks).toBe("number");
        expect(typeof student.stuckTasksTrend).toBe("number");

        // ブール型の確認
        expect(typeof student.favorite).toBe("boolean");

        // null許容フィールドの確認
        expect(
          student.profileImageKey === null || typeof student.profileImageKey === "string",
        ).toBe(true);
        expect(student.slackId === null || typeof student.slackId === "string").toBe(true);
      }
    });
  });

  test("受講生が作成日時の昇順で並んでいる", async () => {
    await runInRollbackTx(async (tx) => {
      // セットアップ: 基本テストデータ作成
      const testData = await createBasicTestData(tx);

      // 実行: StudentService実行
      const studentService = new StudentService(tx);
      const result = await studentService.getStudentsWithStats();

      // 検証: 並び順の確認
      expect(result).toBeDefined();
      expect(result.length).toBe(testData.students.length);

      // 作成日時の昇順で並んでいることを確認
      for (let i = 1; i < result.length; i++) {
        const prevDate = new Date(result[i - 1].createdAt);
        const currentDate = new Date(result[i].createdAt);
        expect(prevDate.getTime()).toBeLessThanOrEqual(currentDate.getTime());
      }
    });
  });

  test("タスク数と詰まりタスク数の関係が正しい", async () => {
    await runInRollbackTx(async (tx) => {
      // セットアップ: 基本テストデータ作成
      const testData = await createBasicTestData(tx);

      // 実行: StudentService実行
      const studentService = new StudentService(tx);
      const result = await studentService.getStudentsWithStats();

      // 検証: タスク数の関係確認
      expect(result).toBeDefined();

      for (const student of result) {
        // 詰まりタスク数は全タスク数以下であることを確認
        expect(student.stuckTasks).toBeLessThanOrEqual(student.totalTasks);

        // 全タスク数が0以上であることを確認
        expect(student.totalTasks).toBeGreaterThanOrEqual(0);

        // 詰まりタスク数が0以上であることを確認
        expect(student.stuckTasks).toBeGreaterThanOrEqual(0);
      }
    });
  });
});
