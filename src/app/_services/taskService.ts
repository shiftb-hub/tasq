import prisma from "@/app/_libs/prisma";
import { Role, User, Prisma } from "@prisma/client";
import { AppErrorCodes } from "@/app/_types/AppErrorCodes";
import {
  CreateTaskRequest,
  UpdateTaskRequest
} from "@/app/_types/TaskRequest";

/**
 * タスク一覧取得
 */
export const getTasks = async (user: User) => {
  const where: Prisma.TaskWhereInput = {};

  // 権限に応じたフィルタリング
  if (user.role === Role.STUDENT || user.role === Role.TA) {
    where.userId = user.id;
  }

  return await prisma.task.findMany({
    where,
    include: {
      user: true,
      status: true,
      tags: {
        include: {
          tag: true
        }
      },
      activityTypes: {
        include: {
          activityType: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};

/**
 * タスク詳細取得
 */
export const getTask = async (taskId: string, user: User) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      user: true,
      status: true,
      tags: {
        include: {
          tag: true
        }
      },
      activityTypes: {
        include: {
          activityType: true
        }
      }
    }
  });

  if (!task) {
    throw new Error(AppErrorCodes.TASK_NOT_FOUND);
  }

  // 権限チェック
  if (
    (user.role === Role.STUDENT || user.role === Role.TA) &&
    task.userId !== user.id
  ) {
    throw new Error(AppErrorCodes.TASK_ACCESS_DENIED);
  }

  return task;
};

/**
 * タスク作成
 */
export const createTask = async (data: CreateTaskRequest, user: User) => {
  // デフォルトステータスの取得
  let statusId = data.statusId;
  if (!statusId) {
    const todoStatus = await prisma.status.findFirst({
      where: { name: "todo" }
    });
    if (todoStatus) {
      statusId = todoStatus.id;
    }
  }

  // ユーザーID設定（TEACHER/ADMINのみ他ユーザーのタスク作成可能）
  const userId =
    (user.role === Role.TEACHER || user.role === Role.ADMIN) && data.userId
      ? data.userId
      : user.id;

  // トランザクション処理
  return await prisma.$transaction(async (tx) => {
    // タスク作成
    const task = await tx.task.create({
      data: {
        title: data.title,
        description: data.description,
        userId,
        statusId,
        relatedChapter: data.relatedChapter,
        startedAt: data.startedAt ? new Date(data.startedAt) : undefined,
        endedAt: data.endedAt ? new Date(data.endedAt) : undefined,
      }
    });

    // タグ関連付け
    if (data.tagId) {
      await tx.taskTag.create({
        data: {
          taskId: task.id,
          tagId: data.tagId
        }
      });
    }

    // ActivityType関連付け
    if (data.activityTypeId) {
      await tx.taskActivityType.create({
        data: {
          taskId: task.id,
          activityTypeId: data.activityTypeId
        }
      });
    }

    // 作成したタスクを関連データ込みで取得
    return await tx.task.findUnique({
      where: { id: task.id },
      include: {
        user: true,
        status: true,
        tags: {
          include: {
            tag: true
          }
        },
        activityTypes: {
          include: {
            activityType: true
          }
        }
      }
    });
  });
};

/**
 * タスク更新
 */
export const updateTask = async (taskId: string, data: UpdateTaskRequest, user: User) => {
  // 既存タスクの取得と権限チェック
  const existingTask = await getTask(taskId, user);

  // トランザクション処理
  return await prisma.$transaction(async (tx) => {
    // タスク更新
    const task = await tx.task.update({
      where: { id: taskId },
      data: {
        title: data.title,
        description: data.description,
        statusId: data.statusId,
        relatedChapter: data.relatedChapter,
        startedAt: data.startedAt ? new Date(data.startedAt) : undefined,
        endedAt: data.endedAt ? new Date(data.endedAt) : undefined,
      }
    });

    // タグの更新
    if (data.tagId !== undefined) {
      // 既存のタグを削除
      await tx.taskTag.deleteMany({
        where: { taskId }
      });
      // 新しいタグを追加
      if (data.tagId) {
        await tx.taskTag.create({
          data: {
            taskId,
            tagId: data.tagId
          }
        });
      }
    }

    // ActivityTypeの更新
    if (data.activityTypeId !== undefined) {
      // 既存のActivityTypeを削除
      await tx.taskActivityType.deleteMany({
        where: { taskId }
      });
      // 新しいActivityTypeを追加
      if (data.activityTypeId) {
        await tx.taskActivityType.create({
          data: {
            taskId,
            activityTypeId: data.activityTypeId
          }
        });
      }
    }

    // 更新したタスクを関連データ込みで取得
    return await tx.task.findUnique({
      where: { id: task.id },
      include: {
        user: true,
        status: true,
        tags: {
          include: {
            tag: true
          }
        },
        activityTypes: {
          include: {
            activityType: true
          }
        }
      }
    });
  });
};

/**
 * タスク削除
 */
export const deleteTask = async (taskId: string, user: User) => {
  // 既存タスクの取得と権限チェック
  await getTask(taskId, user);

  // カスケード削除が設定されているため、関連データも自動削除される
  await prisma.task.delete({
    where: { id: taskId }
  });

  return { success: true };
};