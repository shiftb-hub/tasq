import { Prisma, Role } from "@prisma/client";
import {
  mockStudentUsers,
  mockTeacherUsers,
  mockTasks,
  mockNegativeTags,
  mockPositiveTags,
  mockStatuses,
  mockDates,
} from "./common-mock-data";

/**
 * StudentServiceテスト用のデータ生成ユーティリティ
 */

export type TestUser = {
  id: string;
  name: string;
  role: Role;
  currentChapter?: number | null;
  slackId?: string | null;
  bio?: string;
};

export type TestTask = {
  id: string;
  title: string;
  description?: string | null;
  userId: string;
  statusId?: string | null;
  relatedChapter?: number | null;
  startedAt?: Date | null;
  endedAt?: Date | null;
  createdAt: Date;
};

export type TestTag = {
  id: string;
  name: string;
  icon?: string | null;
  order: number;
};

export type TestStatus = {
  id: string;
  name: string;
  order: number;
  icon?: string | null;
};

/**
 * 受講生ユーザーを作成
 */
export async function createTestStudents(
  tx: Prisma.TransactionClient,
  students: typeof mockStudentUsers = mockStudentUsers,
): Promise<TestUser[]> {
  const createdStudents: TestUser[] = [];

  for (const student of students) {
    // 既存のデータを削除してから作成
    await tx.user.deleteMany({
      where: { id: student.id },
    });

    const created = await tx.user.create({
      data: {
        id: student.id,
        name: student.name,
        role: student.role,
        currentChapter: student.currentChapter,
        slackId: student.slackId,
        bio: student.bio,
      },
    });
    createdStudents.push(created);
  }

  return createdStudents;
}

/**
 * 教師ユーザーを作成
 */
export async function createTestTeachers(
  tx: Prisma.TransactionClient,
  teachers: typeof mockTeacherUsers = mockTeacherUsers,
): Promise<TestUser[]> {
  const createdTeachers: TestUser[] = [];

  for (const teacher of teachers) {
    // 既存のデータを削除してから作成
    await tx.user.deleteMany({
      where: { id: teacher.id },
    });

    const created = await tx.user.create({
      data: {
        id: teacher.id,
        name: teacher.name,
        role: teacher.role,
        slackId: teacher.slackId,
        bio: teacher.bio,
      },
    });
    createdTeachers.push(created);
  }

  return createdTeachers;
}

/**
 * ステータスを作成
 */
export async function createTestStatuses(
  tx: Prisma.TransactionClient,
  statuses: typeof mockStatuses = mockStatuses,
): Promise<TestStatus[]> {
  const createdStatuses: TestStatus[] = [];

  for (const status of statuses) {
    // 既存のステータスをチェックして、存在しない場合のみ作成
    const existing = await tx.status.findFirst({
      where: { order: status.order },
    });

    if (!existing) {
      const created = await tx.status.create({
        data: {
          name: status.name,
          order: status.order,
          icon: status.icon,
        },
      });
      createdStatuses.push(created);
    } else {
      createdStatuses.push(existing);
    }
  }

  return createdStatuses;
}

/**
 * 感情タグを作成
 */
export async function createTestTags(
  tx: Prisma.TransactionClient,
  negativeTags: typeof mockNegativeTags = mockNegativeTags,
  positiveTags: typeof mockPositiveTags = mockPositiveTags,
): Promise<{ negative: TestTag[]; positive: TestTag[] }> {
  const createdNegativeTags: TestTag[] = [];
  const createdPositiveTags: TestTag[] = [];

  // ネガティブタグ作成
  for (const tag of negativeTags) {
    const existing = await tx.tag.findFirst({
      where: { order: tag.order },
    });

    if (!existing) {
      const created = await tx.tag.create({
        data: {
          name: tag.name,
          icon: tag.icon,
          order: tag.order,
        },
      });
      createdNegativeTags.push(created);
    } else {
      createdNegativeTags.push(existing);
    }
  }

  // ポジティブタグ作成
  for (const tag of positiveTags) {
    const existing = await tx.tag.findFirst({
      where: { order: tag.order },
    });

    if (!existing) {
      const created = await tx.tag.create({
        data: {
          name: tag.name,
          icon: tag.icon,
          order: tag.order,
        },
      });
      createdPositiveTags.push(created);
    } else {
      createdPositiveTags.push(existing);
    }
  }

  return { negative: createdNegativeTags, positive: createdPositiveTags };
}

/**
 * タスクを作成（感情タグ付き）
 */
export async function createTestTasksWithTags(
  tx: Prisma.TransactionClient,
  students: TestUser[],
  statuses: TestStatus[],
  negativeTags: TestTag[],
  positiveTags: TestTag[],
  taskTemplates: typeof mockTasks = mockTasks,
): Promise<TestTask[]> {
  const createdTasks: TestTask[] = [];

  // 既存のタスクとタスクタグをクリア
  const studentIds = students.map((s) => s.id);
  await tx.taskTag.deleteMany({
    where: {
      task: {
        userId: { in: studentIds },
      },
    },
  });
  await tx.task.deleteMany({
    where: { userId: { in: studentIds } },
  });

  for (const student of students) {
    // 各学生に3-5個のタスクを作成
    const taskCount = Math.floor(Math.random() * 3) + 3;

    for (let i = 0; i < taskCount; i++) {
      const template = taskTemplates[i % taskTemplates.length];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      // 日時設定（トレンドテスト用）
      const createdAt = new Date(
        mockDates.now.getTime() - Math.random() * 10 * 24 * 60 * 60 * 1000,
      );
      let startedAt: Date | undefined;
      let endedAt: Date | undefined;

      if (status.name !== "作業中" && Math.random() > 0.3) {
        startedAt = new Date(createdAt.getTime() + Math.random() * 24 * 60 * 60 * 1000);
        if (status.name === "完了" && Math.random() > 0.2) {
          endedAt = new Date(startedAt.getTime() + Math.random() * 72 * 60 * 60 * 1000);
        }
      }

      const task = await tx.task.create({
        data: {
          title: `${template.title} - ${student.name}`,
          description: template.description,
          userId: student.id,
          statusId: status.id,
          relatedChapter: template.relatedChapter,
          startedAt,
          endedAt,
          createdAt,
        },
      });

      // 感情タグをランダムに付与
      const allTags = [...negativeTags, ...positiveTags];
      const tagCount = Math.floor(Math.random() * 3) + 1; // 1-3個のタグ
      const selectedTags = allTags.sort(() => Math.random() - 0.5).slice(0, tagCount);

      for (const tag of selectedTags) {
        await tx.taskTag.create({
          data: {
            taskId: task.id,
            tagId: tag.id,
          },
        });
      }

      createdTasks.push({
        id: task.id,
        title: task.title,
        description: task.description,
        userId: task.userId,
        statusId: task.statusId,
        relatedChapter: task.relatedChapter,
        startedAt: task.startedAt,
        endedAt: task.endedAt,
        createdAt: task.createdAt,
      });
    }
  }

  return createdTasks;
}

/**
 * 教師-生徒のお気に入り関係を作成
 */
export async function createTeacherStudentRelations(
  tx: Prisma.TransactionClient,
  teachers: TestUser[],
  students: TestUser[],
  relations: Array<{ teacherId: string; studentIds: string[] }>,
): Promise<void> {
  // 既存の関係をクリア
  const teacherIds = teachers.map((t) => t.id);
  const studentIds = students.map((s) => s.id);
  await tx.teacherStudent.deleteMany({
    where: {
      OR: [{ teacherId: { in: teacherIds } }, { studentId: { in: studentIds } }],
    },
  });

  for (const relation of relations) {
    for (const studentId of relation.studentIds) {
      await tx.teacherStudent.create({
        data: {
          teacherId: relation.teacherId,
          studentId: studentId,
        },
      });
    }
  }
}

/**
 * 詰まりタスクを持つ受講生を作成（テスト用）
 */
export async function createStuckStudent(
  tx: Prisma.TransactionClient,
  studentId: string,
  studentName: string,
  negativeTags: TestTag[],
  statuses: TestStatus[],
): Promise<TestTask[]> {
  // 既存のデータをクリア
  await tx.taskTag.deleteMany({
    where: {
      task: { userId: studentId },
    },
  });
  await tx.task.deleteMany({
    where: { userId: studentId },
  });
  await tx.user.deleteMany({
    where: { id: studentId },
  });

  // 受講生作成
  await tx.user.create({
    data: {
      id: studentId,
      name: studentName,
      role: Role.STUDENT,
      currentChapter: 2,
      slackId: `@${studentId}`,
      bio: "困っている受講生",
    },
  });

  const createdTasks: TestTask[] = [];

  // 詰まりタスクを複数作成
  for (let i = 0; i < 3; i++) {
    const status = statuses.find((s) => s.name === "作業中") || statuses[0];
    const task = await tx.task.create({
      data: {
        title: `困っているタスク ${i + 1} - ${studentName}`,
        description: "このタスクで困っています",
        userId: studentId,
        statusId: status.id,
        relatedChapter: 2,
        createdAt: mockDates.now,
      },
    });

    // ネガティブタグを付与
    for (const tag of negativeTags) {
      await tx.taskTag.create({
        data: {
          taskId: task.id,
          tagId: tag.id,
        },
      });
    }

    createdTasks.push({
      id: task.id,
      title: task.title,
      description: task.description,
      userId: task.userId,
      statusId: task.statusId,
      relatedChapter: task.relatedChapter,
      startedAt: task.startedAt,
      endedAt: task.endedAt,
      createdAt: task.createdAt,
    });
  }

  return createdTasks;
}

/**
 * 空のデータベース状態を作成（エッジケーステスト用）
 */
export async function createEmptyState(tx: Prisma.TransactionClient): Promise<void> {
  // 何も作成しない（空の状態）
  // 必要に応じて特定のテーブルのみクリア
}

/**
 * ネガティブタグなしの状態を作成（エッジケーステスト用）
 */
export async function createStateWithoutNegativeTags(
  tx: Prisma.TransactionClient,
  students: TestUser[],
  statuses: TestStatus[],
  positiveTags: TestTag[],
): Promise<TestTask[]> {
  // ポジティブタグのみ作成
  await createTestTags(tx, [], mockPositiveTags);

  // タスク作成（ポジティブタグのみ付与）
  return await createTestTasksWithTags(tx, students, statuses, [], positiveTags);
}
