import { Role } from "@prisma/client";
import { DbClient } from "@/app/_types/Services";
import { StudentListItem } from "@/app/_types/Student";

/**
 * 受講生集計サービス
 * - タスク件数やお気に入りフラグを含む受講生一覧を提供
 * - Prisma へのアクセスは注入された DbClient 経由で実行
 */
class StudentService {
  private readonly prisma: DbClient;

  public constructor(prisma: DbClient) {
    this.prisma = prisma;
  }

  /**
   * 受講生＋集計情報の一覧を取得（教師IDは任意）
   * - totalTasks: 生徒に紐づく全タスク件数
   * - stuckTasks: 詰まりタスク件数（暫定: endedAt が未設定のタスクをカウント）
   * - favorite: 教員が当該生徒をブックマーク済みか（TeacherStudentで判定）
   * @param teacherId - 教員ID（指定時はお気に入りフラグを計算）
   */
  public async getStudentsWithStats(teacherId?: string): Promise<StudentListItem[]> {
    // 基本的な受講生プロフィールを取得
    const students = await this.prisma.user.findMany({
      where: { role: Role.STUDENT },
      select: {
        id: true,
        name: true,
        profileImageKey: true,
        role: true,
        currentChapter: true,
        slackId: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [{ createdAt: "asc" }],
    });

    if (students.length === 0) return [];

    const studentIds = students.map((s) => s.id);

    // 受講生ごとの全タスク件数を集計
    const totalTaskCounts = await this.prisma.task.groupBy({
      by: ["userId"],
      where: { userId: { in: studentIds } },
      _count: { _all: true },
    });
    const totalTaskCountMap = new Map(totalTaskCounts.map((g) => [g.userId, g._count._all]));

    // 詰まりタスクの暫定判定: endedAt が null のタスクをカウント
    const stuckTaskCounts = await this.prisma.task.groupBy({
      by: ["userId"],
      where: { userId: { in: studentIds }, endedAt: null },
      _count: { _all: true },
    });
    const stuckTaskCountMap = new Map(stuckTaskCounts.map((g) => [g.userId, g._count._all]));

    // 教員視点のお気に入り（TeacherStudent）を取得
    let favoriteSet: Set<string> = new Set();
    if (teacherId) {
      const favorites = await this.prisma.teacherStudent.findMany({
        where: { teacherId, studentId: { in: studentIds } },
        select: { studentId: true },
      });
      favoriteSet = new Set(favorites.map((f) => f.studentId));
    }

    // 返却用DTOの組み立て
    const dto: StudentListItem[] = students.map((u) => ({
      id: u.id,
      name: u.name,
      profileImageKey: u.profileImageKey,
      role: String(u.role),
      currentChapter: u.currentChapter ?? 0,
      slackId: u.slackId ?? null,
      favorite: favoriteSet.has(u.id),
      totalTasks: totalTaskCountMap.get(u.id) ?? 0,
      stuckTasks: stuckTaskCountMap.get(u.id) ?? 0,
      stuckTasksTrend: 0, // TODO: 正式な算出仕様の定義が必要
      createdAt: u.createdAt.toISOString(),
      updatedAt: u.updatedAt.toISOString(),
    }));

    return dto;
  }
}

export { StudentService };
