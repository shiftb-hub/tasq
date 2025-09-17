import prisma from "@/app/_libs/prisma";
import { Role, User } from "@prisma/client";
import { AppErrorCodes } from "@/app/_types/AppErrorCodes";
import { 
  CreateTagRequest, 
  UpdateTagRequest
} from "@/app/_types/TagRequest";

/**
 * タグ一覧取得
 */
export const getTags = async () => {
  return await prisma.tag.findMany({
    orderBy: {
      order: "asc"
    }
  });
};

/**
 * タグ詳細取得
 */
export const getTag = async (tagId: string) => {
  const tag = await prisma.tag.findUnique({
    where: { id: tagId }
  });

  if (!tag) {
    throw new Error(AppErrorCodes.TAG_NOT_FOUND);
  }

  return tag;
};

/**
 * タグ作成（ADMINのみ）
 */
export const createTag = async (data: CreateTagRequest, user: User) => {
  // 権限チェック
  if (user.role !== Role.ADMIN) {
    throw new Error(AppErrorCodes.ADMIN_REQUIRED);
  }

  return await prisma.tag.create({
    data: {
      name: data.name,
      order: data.order,
      icon: data.icon
    }
  });
};

/**
 * タグ更新（ADMINのみ）
 */
export const updateTag = async (tagId: string, data: UpdateTagRequest, user: User) => {
  // 権限チェック
  if (user.role !== Role.ADMIN) {
    throw new Error(AppErrorCodes.ADMIN_REQUIRED);
  }

  // 存在確認
  await getTag(tagId);

  return await prisma.tag.update({
    where: { id: tagId },
    data: {
      name: data.name,
      order: data.order,
      icon: data.icon
    }
  });
};

/**
 * タグ削除（ADMINのみ）
 */
export const deleteTag = async (tagId: string, user: User) => {
  // 権限チェック
  if (user.role !== Role.ADMIN) {
    throw new Error(AppErrorCodes.ADMIN_REQUIRED);
  }

  // 存在確認
  await getTag(tagId);

  // 使用中チェック
  const taskTagsCount = await prisma.taskTag.count({
    where: { tagId }
  });

  if (taskTagsCount > 0) {
    throw new Error(AppErrorCodes.TAG_IN_USE);
  }

  await prisma.tag.delete({
    where: { id: tagId }
  });

  return { success: true };
};