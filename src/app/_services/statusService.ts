import prisma from "@/app/_libs/prisma";
import { Role, User } from "@prisma/client";
import { AppErrorCodes } from "@/app/_types/AppErrorCodes";
import { 
  CreateStatusRequest, 
  UpdateStatusRequest
} from "@/app/_types/StatusRequest";

/**
 * ステータス一覧取得
 */
export const getStatuses = async () => {
  return await prisma.status.findMany({
    orderBy: {
      order: "asc"
    }
  });
};

/**
 * ステータス詳細取得
 */
export const getStatus = async (statusId: string) => {
  const status = await prisma.status.findUnique({
    where: { id: statusId }
  });

  if (!status) {
    throw new Error(AppErrorCodes.STATUS_NOT_FOUND);
  }

  return status;
};

/**
 * ステータス作成（ADMINのみ）
 */
export const createStatus = async (data: CreateStatusRequest, user: User) => {
  // 権限チェック
  if (user.role !== Role.ADMIN) {
    throw new Error(AppErrorCodes.ADMIN_REQUIRED);
  }

  return await prisma.status.create({
    data: {
      name: data.name,
      order: data.order,
      icon: data.icon
    }
  });
};

/**
 * ステータス更新（ADMINのみ）
 */
export const updateStatus = async (statusId: string, data: UpdateStatusRequest, user: User) => {
  // 権限チェック
  if (user.role !== Role.ADMIN) {
    throw new Error(AppErrorCodes.ADMIN_REQUIRED);
  }

  // 存在確認
  await getStatus(statusId);

  return await prisma.status.update({
    where: { id: statusId },
    data: {
      name: data.name,
      order: data.order,
      icon: data.icon
    }
  });
};

/**
 * ステータス削除（ADMINのみ）
 */
export const deleteStatus = async (statusId: string, user: User) => {
  // 権限チェック
  if (user.role !== Role.ADMIN) {
    throw new Error(AppErrorCodes.ADMIN_REQUIRED);
  }

  // 存在確認
  await getStatus(statusId);

  // 使用中チェック
  const tasksCount = await prisma.task.count({
    where: { statusId }
  });

  if (tasksCount > 0) {
    throw new Error(AppErrorCodes.STATUS_IN_USE);
  }

  await prisma.status.delete({
    where: { id: statusId }
  });

  return { success: true };
};