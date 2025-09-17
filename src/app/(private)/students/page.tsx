import prisma from "@/app/_libs/prisma";
import { authenticateAppUser } from "@/app/_libs/authenticateUser";
import { StudentService } from "@/app/_services/studentService";
import { StudentsPageClient } from "./_components/StudentsPageClient";
import { toggleFavoriteAction } from "./_actions/toggleFavorite";

export const dynamic = "force-dynamic";

/**
 * 受講生一覧ページ（SSR + Server Actions）
 * - Server Component で受講生データを取得
 * - お気に入り切り替えは Server Action を子へ渡す
 */
const StudentsPage = async () => {
  // 教員としてログインしている前提で現在ユーザーを取得
  const teacher = await authenticateAppUser();

  // Prisma 経由でサービス層から集計済みデータを取得
  const service = new StudentService(prisma);
  const students = await service.getStudentsWithStats(teacher.id);

  return (
    <StudentsPageClient students={students} onToggleFavorite={toggleFavoriteAction} />
  );
};

export default StudentsPage;
