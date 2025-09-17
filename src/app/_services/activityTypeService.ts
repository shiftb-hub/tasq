import prisma from "@/app/_libs/prisma";
import { Role, User } from "@prisma/client";
import { AppErrorCodes } from "@/app/_types/AppErrorCodes";
import { 
  CreateActivityTypeRequest, 
  UpdateActivityTypeRequest
} from "@/app/_types/ActivityTypeRequest";

/**
 * ActivityType一覧取得
 */
export const getActivityTypes = async () => {
  return await prisma.activityType.findMany({
    orderBy: {
      order: "asc"
    }
  });
};

/**
 * ActivityType詳細取得
 */
export const getActivityType = async (activityTypeId: string) => {
  const activityType = await prisma.activityType.findUnique({
    where: { id: activityTypeId }
  });

  if (!activityType) {
    throw new Error(AppErrorCodes.ACTIVITY_TYPE_NOT_FOUND);
  }

  return activityType;
};

/**
 * ActivityType作成（ADMINのみ）
 */
export const createActivityType = async (data: CreateActivityTypeRequest, user: User) => {
  // 権限チェック
  if (user.role !== Role.ADMIN) {
    throw new Error(AppErrorCodes.ADMIN_REQUIRED);
  }

  return await prisma.activityType.create({
    data: {
      name: data.name,
      order: data.order,
      description: data.description
    }
  });
};

/**
 * ActivityType更新（ADMINのみ）
 */
export const updateActivityType = async (activityTypeId: string, data: UpdateActivityTypeRequest, user: User) => {
  // 権限チェック
  if (user.role !== Role.ADMIN) {
    throw new Error(AppErrorCodes.ADMIN_REQUIRED);
  }

  // 存在確認
  await getActivityType(activityTypeId);

  return await prisma.activityType.update({
    where: { id: activityTypeId },
    data: {
      name: data.name,
      order: data.order,
      description: data.description
    }
  });
};

/**
 * ActivityType削除（ADMINのみ）
 */
export const deleteActivityType = async (activityTypeId: string, user: User) => {
  // 権限チェック
  if (user.role !== Role.ADMIN) {
    throw new Error(AppErrorCodes.ADMIN_REQUIRED);
  }

  // 存在確認
  await getActivityType(activityTypeId);

  // 使用中チェック
  const taskActivityTypesCount = await prisma.taskActivityType.count({
    where: { activityTypeId }
  });

  if (taskActivityTypesCount > 0) {
    throw new Error(AppErrorCodes.ACTIVITY_TYPE_IN_USE);
  }

  await prisma.activityType.delete({
    where: { id: activityTypeId }
  });

  return { success: true };
};