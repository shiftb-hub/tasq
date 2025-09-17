import { Prisma } from "@prisma/client";
import { TestUser, TestTask, TestTag, TestStatus } from "./test-data-generator";

/**
 * StudentServiceテスト用の共通セットアップ
 */

export type TestData = {
  students: TestUser[];
  teachers: TestUser[];
  statuses: TestStatus[];
  negativeTags: TestTag[];
  positiveTags: TestTag[];
  tasks: TestTask[];
};

/**
 * 基本的なテストデータセットを作成
 */
export async function createBasicTestData(tx: Prisma.TransactionClient): Promise<TestData> {
  // 0. 既存データをクリア
  await clearAllTestData(tx);

  // 1. 受講生作成
  const students = await createTestStudents(tx);

  // 2. 教師作成
  const teachers = await createTestTeachers(tx);

  // 3. ステータス作成
  const statuses = await createTestStatuses(tx);

  // 4. 感情タグ作成
  const { negative: negativeTags, positive: positiveTags } = await createTestTags(tx);

  // 5. タスク作成（感情タグ付き）
  const tasks = await createTestTasksWithTags(tx, students, statuses, negativeTags, positiveTags);

  // 6. 教師-生徒関係作成
  await createTeacherStudentRelations(tx, teachers, students, [
    { teacherId: teachers[0].id, studentIds: [students[0].id, students[1].id] },
    { teacherId: teachers[1].id, studentIds: [students[2].id] },
  ]);

  return {
    students,
    teachers,
    statuses,
    negativeTags,
    positiveTags,
    tasks,
  };
}

/**
 * 詰まりタスクを持つ受講生のテストデータを作成
 */
export async function createStuckStudentsTestData(tx: Prisma.TransactionClient): Promise<TestData> {
  // 基本データ作成（既にクリアが含まれている）
  const basicData = await createBasicTestData(tx);

  // 詰まりタスクを持つ受講生を追加
  const stuckStudentId = "stuck-student-001";
  const stuckTasks = await createStuckStudent(
    tx,
    stuckStudentId,
    "困り助 太郎",
    basicData.negativeTags,
    basicData.statuses,
  );

  // 教師-生徒関係に追加
  await createTeacherStudentRelations(
    tx,
    basicData.teachers,
    [{ id: stuckStudentId } as TestUser],
    [{ teacherId: basicData.teachers[0].id, studentIds: [stuckStudentId] }],
  );

  return {
    ...basicData,
    students: [
      ...basicData.students,
      { id: stuckStudentId, name: "困り助 太郎", role: "STUDENT" as const },
    ],
    tasks: [...basicData.tasks, ...stuckTasks],
  };
}

/**
 * 空のデータベース状態のテストデータを作成（既存の関数を削除）
 */

/**
 * ネガティブタグなしのテストデータを作成
 */
export async function createNoNegativeTagsTestData(
  tx: Prisma.TransactionClient,
): Promise<TestData> {
  // 受講生と教師作成
  const students = await createTestStudents(tx);
  const teachers = await createTestTeachers(tx);
  const statuses = await createTestStatuses(tx);

  // ポジティブタグのみ作成
  const { positive: positiveTags } = await createTestTags(tx, [], mockPositiveTags);

  // タスク作成（ポジティブタグのみ）
  const tasks = await createTestTasksWithTags(tx, students, statuses, [], positiveTags);

  return {
    students,
    teachers,
    statuses,
    negativeTags: [],
    positiveTags,
    tasks,
  };
}

// ヘルパー関数のインポート（循環参照を避けるため）
import {
  createTestStudents,
  createTestTeachers,
  createTestStatuses,
  createTestTags,
  createTestTasksWithTags,
  createTeacherStudentRelations,
  createStuckStudent,
  createEmptyState,
} from "./test-data-generator";
import { mockPositiveTags } from "./common-mock-data";

/**
 * 全てのテストデータをクリア
 */
async function clearAllTestData(tx: Prisma.TransactionClient): Promise<void> {
  // 外部キー制約の順序で削除（参照先から削除）
  await tx.taskTag.deleteMany();
  await tx.taskActivityType.deleteMany();
  await tx.teacherTask.deleteMany();
  await tx.assignmentLog.deleteMany();
  await tx.learningLog.deleteMany();
  await tx.task.deleteMany();
  await tx.teacherStudent.deleteMany();
  await tx.user.deleteMany();
  await tx.status.deleteMany();
  await tx.tag.deleteMany();
  await tx.activityType.deleteMany();
}

/**
 * 空のデータベース状態のテストデータを作成
 */
export async function createEmptyTestData(tx: Prisma.TransactionClient): Promise<TestData> {
  await clearAllTestData(tx);
  return {
    students: [],
    teachers: [],
    statuses: [],
    negativeTags: [],
    positiveTags: [],
    tasks: [],
  };
}

/**
 * 大量の受講生データを作成（パフォーマンステスト用）
 */
export async function createLargeTestData(
  tx: Prisma.TransactionClient,
  studentCount: number,
): Promise<TestData> {
  await clearAllTestData(tx);

  // 大量の受講生を作成
  const students = await createTestStudents(
    tx,
    Array.from({ length: studentCount }, (_, i) => ({
      id: `student-${String(i + 1).padStart(3, "0")}`,
      name: `受講生 ${i + 1}`,
      role: "STUDENT" as const,
      currentChapter: Math.floor(Math.random() * 10) + 1,
      slackId: `@student_${i + 1}`,
      bio: `テスト用受講生 ${i + 1}`,
    })),
  );

  // 教師作成
  const teachers = await createTestTeachers(tx);

  // ステータス作成
  const statuses = await createTestStatuses(tx);

  // 感情タグ作成
  const { negative: negativeTags, positive: positiveTags } = await createTestTags(tx);

  // タスク作成（各受講生に3-5個のタスク）
  const tasks = await createTestTasksWithTags(tx, students, statuses, negativeTags, positiveTags);

  // 教師-生徒関係作成（最初の教師に最初の10人の受講生を関連付け）
  await createTeacherStudentRelations(tx, teachers, students.slice(0, 10), [
    { teacherId: teachers[0].id, studentIds: students.slice(0, 10).map((s) => s.id) },
  ]);

  return {
    students,
    teachers,
    statuses,
    negativeTags,
    positiveTags,
    tasks,
  };
}

/**
 * 大量のタスクを持つテストデータを作成（パフォーマンステスト用）
 */
export async function createTestDataWithManyTasks(
  tx: Prisma.TransactionClient,
  taskCount: number,
): Promise<TestData> {
  await clearAllTestData(tx);

  // 1人の受講生を作成
  const students = await createTestStudents(tx, [
    {
      id: "student-heavy-tasks",
      name: "重いタスク 太郎",
      role: "STUDENT" as const,
      currentChapter: 5,
      slackId: "@heavy_tasks",
      bio: "大量のタスクを持つ受講生",
    },
  ]);

  // 教師作成
  const teachers = await createTestTeachers(tx);

  // ステータス作成
  const statuses = await createTestStatuses(tx);

  // 感情タグ作成
  const { negative: negativeTags, positive: positiveTags } = await createTestTags(tx);

  // 大量のタスクを作成
  const tasks = await createTestTasksWithTags(
    tx,
    students,
    statuses,
    negativeTags,
    positiveTags,
    Array.from({ length: taskCount }, (_, i) => ({
      title: `重いタスク ${i + 1}`,
      description: `大量のタスクテスト用 ${i + 1}`,
      relatedChapter: Math.floor(Math.random() * 10) + 1,
    })),
  );

  // 教師-生徒関係作成
  await createTeacherStudentRelations(tx, teachers, students, [
    { teacherId: teachers[0].id, studentIds: [students[0].id] },
  ]);

  return {
    students,
    teachers,
    statuses,
    negativeTags,
    positiveTags,
    tasks,
  };
}
