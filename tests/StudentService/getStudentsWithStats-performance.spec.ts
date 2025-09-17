import { describe, expect, test } from "vitest";
import { runInRollbackTx } from "../setup/prisma.setup";
import { StudentService } from "@/app/_services/studentService";
import {
  createBasicTestData,
  createLargeTestData,
  createTestDataWithManyTasks,
} from "./helpers/test-setup";

describe("StudentService getStudentsWithStats - パフォーマンス", () => {
  test("大量の受講生（100人）でのレスポンス時間", async () => {
    await runInRollbackTx(async (tx) => {
      // 100人の受講生を作成
      const testData = await createLargeTestData(tx, 100);

      const studentService = new StudentService(tx);

      const startTime = Date.now();
      const result = await studentService.getStudentsWithStats();
      const endTime = Date.now();

      const executionTime = endTime - startTime;

      // パフォーマンス要件（2秒以内）
      expect(executionTime).toBeLessThan(2000);

      // 結果の正確性を確認
      expect(result).toBeDefined();
      expect(result.length).toBe(100);

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

      console.log(`100人の受講生での処理時間: ${executionTime}ms`);
    });
  });

  test("大量のタスク（1000個）での処理時間", async () => {
    await runInRollbackTx(async (tx) => {
      // 大量のタスクを持つテストデータを作成
      const testData = await createTestDataWithManyTasks(tx, 1000);

      const studentService = new StudentService(tx);

      const startTime = Date.now();
      const result = await studentService.getStudentsWithStats();
      const endTime = Date.now();

      const executionTime = endTime - startTime;

      // パフォーマンス要件（3秒以内）
      expect(executionTime).toBeLessThan(3000);

      // 結果の正確性を確認
      expect(result).toBeDefined();
      expect(result.length).toBe(testData.students.length);

      // タスク数が正しく集計されることを確認
      for (const student of result) {
        expect(student.totalTasks).toBeGreaterThanOrEqual(0);
        expect(student.stuckTasks).toBeGreaterThanOrEqual(0);
        expect(student.stuckTasks).toBeLessThanOrEqual(student.totalTasks);
      }

      console.log(`1000個のタスクでの処理時間: ${executionTime}ms`);
    });
  });

  test("並列実行でのパフォーマンス", async () => {
    await runInRollbackTx(async (tx) => {
      const testData = await createBasicTestData(tx);
      const studentService = new StudentService(tx);

      const startTime = Date.now();

      // 5回並列実行
      const promises = Array(5)
        .fill(null)
        .map(() => studentService.getStudentsWithStats());
      const results = await Promise.all(promises);

      const endTime = Date.now();
      const executionTime = endTime - startTime;

      // 並列実行でも正常に動作することを確認
      expect(results).toHaveLength(5);
      results.forEach((result) => {
        expect(result.length).toBe(testData.students.length);
      });

      // 並列実行の処理時間（1秒以内）
      expect(executionTime).toBeLessThan(1000);

      console.log(`5回並列実行の処理時間: ${executionTime}ms`);
    });
  });

  test("教師IDありでの並列実行パフォーマンス", async () => {
    await runInRollbackTx(async (tx) => {
      const testData = await createBasicTestData(tx);
      const studentService = new StudentService(tx);
      const teacherId = testData.teachers[0].id;

      const startTime = Date.now();

      // 教師IDありで5回並列実行
      const promises = Array(5)
        .fill(null)
        .map(() => studentService.getStudentsWithStats(teacherId));
      const results = await Promise.all(promises);

      const endTime = Date.now();
      const executionTime = endTime - startTime;

      // 並列実行でも正常に動作することを確認
      expect(results).toHaveLength(5);
      results.forEach((result) => {
        expect(result.length).toBe(testData.students.length);

        // お気に入りフラグが正しく設定されていることを確認
        const favoriteStudents = result.filter((student) => student.favorite);
        expect(favoriteStudents.length).toBeGreaterThan(0);
      });

      // 並列実行の処理時間（1秒以内）
      expect(executionTime).toBeLessThan(1000);

      console.log(`教師IDありでの5回並列実行の処理時間: ${executionTime}ms`);
    });
  });

  test("メモリ使用量の確認", async () => {
    await runInRollbackTx(async (tx) => {
      // メモリ使用量の測定（Node.js環境での簡易的な測定）
      const initialMemory = process.memoryUsage();

      // 大量のデータを作成
      const testData = await createLargeTestData(tx, 200);
      const studentService = new StudentService(tx);

      // メモリ使用量を測定
      const beforeMemory = process.memoryUsage();
      const result = await studentService.getStudentsWithStats();
      const afterMemory = process.memoryUsage();

      // 結果の正確性を確認
      expect(result).toBeDefined();
      expect(result.length).toBe(200);

      // メモリ使用量の増加を確認（簡易的な測定）
      const memoryIncrease = afterMemory.heapUsed - beforeMemory.heapUsed;
      const memoryIncreaseMB = memoryIncrease / 1024 / 1024;

      // メモリ使用量の増加が50MB以内であることを確認
      expect(memoryIncreaseMB).toBeLessThan(50);

      console.log(`メモリ使用量増加: ${memoryIncreaseMB.toFixed(2)}MB`);
      console.log(`初期メモリ: ${(initialMemory.heapUsed / 1024 / 1024).toFixed(2)}MB`);
      console.log(`実行前メモリ: ${(beforeMemory.heapUsed / 1024 / 1024).toFixed(2)}MB`);
      console.log(`実行後メモリ: ${(afterMemory.heapUsed / 1024 / 1024).toFixed(2)}MB`);
    });
  });

  test("複数回実行での一貫性確認", async () => {
    await runInRollbackTx(async (tx) => {
      const testData = await createBasicTestData(tx);
      const studentService = new StudentService(tx);

      // 10回連続実行
      const results = [];
      for (let i = 0; i < 10; i++) {
        const result = await studentService.getStudentsWithStats();
        results.push(result);
      }

      // 全ての結果が一致することを確認
      for (let i = 1; i < results.length; i++) {
        expect(results[i]).toEqual(results[0]);
      }

      // 各結果の正確性を確認
      results.forEach((result) => {
        expect(result.length).toBe(testData.students.length);
      });

      console.log(`10回連続実行での一貫性確認完了`);
    });
  });

  test("大量データでのソート性能", async () => {
    await runInRollbackTx(async (tx) => {
      // 大量の受講生を作成（作成日時を意図的にばらつかせる）
      // 500人だとトランザクションがタイムアウトする可能性があるため、200人に削減
      const testData = await createLargeTestData(tx, 200);

      const studentService = new StudentService(tx);

      const startTime = Date.now();
      const result = await studentService.getStudentsWithStats();
      const endTime = Date.now();

      const executionTime = endTime - startTime;

      // パフォーマンス要件（3秒以内）
      expect(executionTime).toBeLessThan(3000);

      // ソートが正しく行われていることを確認
      expect(result.length).toBe(200);

      // 作成日時の昇順で並んでいることを確認
      for (let i = 1; i < result.length; i++) {
        const prevDate = new Date(result[i - 1].createdAt);
        const currentDate = new Date(result[i].createdAt);
        expect(prevDate.getTime()).toBeLessThanOrEqual(currentDate.getTime());
      }

      console.log(`200人の受講生でのソート処理時間: ${executionTime}ms`);
    });
  });
});
