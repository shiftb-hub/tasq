import { describe, expect, test } from "vitest";
import { runInRollbackTx } from "../setup/prisma.setup";
import { StudentService } from "@/app/_services/studentService";
import { createBasicTestData } from "./helpers/test-setup";

describe("StudentService getStudentsWithStats - エラーハンドリング", () => {
  test("無効な教師IDでもエラーが発生しない", async () => {
    await runInRollbackTx(async (tx) => {
      const testData = await createBasicTestData(tx);
      const studentService = new StudentService(tx);

      // 存在しない教師IDを指定
      const result = await studentService.getStudentsWithStats("non-existent-teacher-id");

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(testData.students.length);

      // お気に入りフラグが全てfalseであることを確認
      for (const student of result) {
        expect(student.favorite).toBe(false);
      }
    });
  });

  test("空文字列の教師IDでも正常動作する", async () => {
    await runInRollbackTx(async (tx) => {
      const testData = await createBasicTestData(tx);
      const studentService = new StudentService(tx);

      // 空文字列の教師IDを指定
      const result = await studentService.getStudentsWithStats("");

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(testData.students.length);

      // お気に入りフラグが全てfalseであることを確認
      for (const student of result) {
        expect(student.favorite).toBe(false);
      }
    });
  });

  test("nullの教師IDでも正常動作する", async () => {
    await runInRollbackTx(async (tx) => {
      const testData = await createBasicTestData(tx);
      const studentService = new StudentService(tx);

      // nullの教師IDを指定
      const result = await studentService.getStudentsWithStats(null as any);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(testData.students.length);

      // お気に入りフラグが全てfalseであることを確認
      for (const student of result) {
        expect(student.favorite).toBe(false);
      }
    });
  });

  test("undefinedの教師IDでも正常動作する", async () => {
    await runInRollbackTx(async (tx) => {
      const testData = await createBasicTestData(tx);
      const studentService = new StudentService(tx);

      // undefinedの教師IDを指定
      const result = await studentService.getStudentsWithStats(undefined);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(testData.students.length);

      // お気に入りフラグが全てfalseであることを確認
      for (const student of result) {
        expect(student.favorite).toBe(false);
      }
    });
  });

  test("不正な形式の教師IDでもエラーが発生しない", async () => {
    await runInRollbackTx(async (tx) => {
      const testData = await createBasicTestData(tx);
      const studentService = new StudentService(tx);

      // 不正な形式の教師IDを指定
      const invalidTeacherIds = [
        "invalid-uuid-format",
        "123",
        "teacher@invalid",
        "teacher with spaces",
        "教師ID",
        "🚫",
      ];

      for (const invalidId of invalidTeacherIds) {
        const result = await studentService.getStudentsWithStats(invalidId);

        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(testData.students.length);

        // お気に入りフラグが全てfalseであることを確認
        for (const student of result) {
          expect(student.favorite).toBe(false);
        }
      }
    });
  });

  test("非常に長い教師IDでもエラーが発生しない", async () => {
    await runInRollbackTx(async (tx) => {
      const testData = await createBasicTestData(tx);
      const studentService = new StudentService(tx);

      // 非常に長い教師IDを指定
      const veryLongTeacherId = "a".repeat(1000);
      const result = await studentService.getStudentsWithStats(veryLongTeacherId);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(testData.students.length);

      // お気に入りフラグが全てfalseであることを確認
      for (const student of result) {
        expect(student.favorite).toBe(false);
      }
    });
  });

  test("特殊文字を含む教師IDでもエラーが発生しない", async () => {
    await runInRollbackTx(async (tx) => {
      const testData = await createBasicTestData(tx);
      const studentService = new StudentService(tx);

      // 特殊文字を含む教師IDを指定
      const specialCharTeacherIds = [
        "teacher-id-with-dashes",
        "teacher_id_with_underscores",
        "teacher.id.with.dots",
        "teacher+id+with+pluses",
        "teacher=id=with=equals",
        "teacher?id=with?query",
        "teacher#id#with#hash",
        "teacher%id%with%percent",
        "teacher&id&with&ampersand",
        "teacher*id*with*asterisk",
      ];

      for (const specialId of specialCharTeacherIds) {
        const result = await studentService.getStudentsWithStats(specialId);

        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(testData.students.length);

        // お気に入りフラグが全てfalseであることを確認
        for (const student of result) {
          expect(student.favorite).toBe(false);
        }
      }
    });
  });

  test("数値型の教師IDでもエラーが発生しない", async () => {
    await runInRollbackTx(async (tx) => {
      const testData = await createBasicTestData(tx);
      const studentService = new StudentService(tx);

      // 数値型の教師IDを指定（文字列に変換してから渡す）
      const result = await studentService.getStudentsWithStats(String(123));

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(testData.students.length);

      // お気に入りフラグが全てfalseであることを確認
      for (const student of result) {
        expect(student.favorite).toBe(false);
      }
    });
  });
});
