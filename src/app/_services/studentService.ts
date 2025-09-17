import { Role } from "@prisma/client";
import { DbClient } from "@/app/_types/Services";
import { StudentListItem } from "@/app/_types/Student";

/**
 * 受講生集計サービス
 * - タスク件数やお気に入りフラグを含む受講生一覧を提供
 * - 詰まりタスクはネガティブな感情タグ（不安、迷っている、難しい、自信がない）で判定
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
   * - stuckTasks: 詰まりタスク件数（ネガティブな感情タグが設定されているタスクをカウント）
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

    // ネガティブな感情タグを持つタスクを詰まりタスクとして判定
    // ネガティブタグ: 不安、迷っている、難しい、自信がない
    const negativeTagNames = ["不安", "迷っている", "難しい", "自信がない"];

    // ネガティブタグのIDを取得
    const negativeTags = await this.prisma.tag.findMany({
      where: { name: { in: negativeTagNames } },
      select: { id: true, name: true },
    });
    const negativeTagIds = negativeTags.map((tag) => tag.id);

    // ネガティブタグが設定されているタスクをユーザーごとに集計
    const stuckTaskCounts = await this.prisma.task.groupBy({
      by: ["userId"],
      where: {
        userId: { in: studentIds },
        tags: {
          some: {
            tagId: { in: negativeTagIds },
          },
        },
      },
      _count: { _all: true },
    });
    const stuckTaskCountMap = new Map(stuckTaskCounts.map((g) => [g.userId, g._count._all]));

    // 直近7日間の変化量（trend）を算出
    // 定義: 「直近7日で新規にネガティブタグが付与されたタスク数」
    //      から「直近7日でネガティブタグが解除されたタスク数」を差し引いた値
    const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // 直近7日で新規にネガティブタグが付与されたタスク
    const newlyStuckCounts = await this.prisma.task.groupBy({
      by: ["userId"],
      where: {
        userId: { in: studentIds },
        createdAt: { gte: cutoff },
        tags: {
          some: {
            tagId: { in: negativeTagIds },
          },
        },
      },
      _count: { _all: true },
    });
    const newlyStuckMap = new Map(newlyStuckCounts.map((g) => [g.userId, g._count._all]));

    // 直近7日で完了したタスク（ネガティブタグの解消として扱う）
    const resolvedCounts = await this.prisma.task.groupBy({
      by: ["userId"],
      where: {
        userId: { in: studentIds },
        endedAt: { gte: cutoff },
        tags: {
          some: {
            tagId: { in: negativeTagIds },
          },
        },
      },
      _count: { _all: true },
    });
    const resolvedMap = new Map(resolvedCounts.map((g) => [g.userId, g._count._all]));

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
      role: u.role,
      currentChapter: u.currentChapter ?? 0,
      slackId: u.slackId ?? null,
      favorite: favoriteSet.has(u.id),
      totalTasks: totalTaskCountMap.get(u.id) ?? 0,
      stuckTasks: stuckTaskCountMap.get(u.id) ?? 0,
      stuckTasksTrend: (newlyStuckMap.get(u.id) ?? 0) - (resolvedMap.get(u.id) ?? 0),
      createdAt: u.createdAt.toISOString(),
      updatedAt: u.updatedAt.toISOString(),
    }));

    return dto;
  }
}

export { StudentService };
