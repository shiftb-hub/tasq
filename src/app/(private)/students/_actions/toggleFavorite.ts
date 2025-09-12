"use server";

import prisma from "@/app/_libs/prisma";
import { authenticateAppUser } from "@/app/_libs/authenticateUser";
import { UserService } from "@/app/_services/userService";

export type ToggleFavoriteResult = {
  ok: boolean;
  favorite: boolean;
};

/**
 * 教員と受講生の「お気に入り（ブックマーク）」関係をトグルする Server Action
 * - TeacherStudent レコードの有無でお気に入り状態を判定・更新
 * - 実行ユーザー（教員）は Supabase 認証情報から取得
 *
 * @param studentId - 対象の受講生ID
 * @returns 更新結果（ok）と最新のお気に入り状態（favorite）
 */
export const toggleFavoriteAction = async (
  studentId: string,
): Promise<ToggleFavoriteResult> => {
  const teacher = await authenticateAppUser();
  const userService = new UserService(prisma);

  // 受講生の存在を確認
  const student = await userService.tryGetById(studentId);
  if (!student) {
    return { ok: false, favorite: false };
  }

  // TeacherStudent 関係の有無でトグル
  const existing = await prisma.teacherStudent.findFirst({
    where: { teacherId: teacher.id, studentId },
    select: { id: true },
  });

  if (existing) {
    await prisma.teacherStudent.delete({ where: { id: existing.id } });
    return { ok: true, favorite: false };
  }

  await prisma.teacherStudent.create({
    data: { teacherId: teacher.id, studentId },
  });
  return { ok: true, favorite: true };
};
