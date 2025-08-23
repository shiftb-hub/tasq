import {
  Prisma as PRS,
  LearningLog as PrismaLearningLog,
} from "@prisma/client";
import {
  LearningLogNotFoundError,
  UserPermissionDeniedError,
} from "@/app/_libs/errors";
import {
  SortOrder,
  LearningLog,
  LearningLogsBatch,
  LearningLogUpdateRequest,
  LearningLogInsertRequest,
  learningLogsBatchSchema,
} from "@/app/_types/LearningLog";
import { DbClient } from "@/app/_types/Services";

/**
 * LearningLog のクエリの結果型を取得するためのHelper型
 * @note include と select を同時に指定することはできないので注意！
 * @template T extends PRS.LearningLogInclude - includeオプションの型
 * @template U extends PRS.LearningLogSelect - selectオプションの型
 */
export type LearningLogReturnType<
  T extends PRS.LearningLogInclude,
  U extends PRS.LearningLogSelect,
> = {
  include?: T;
  select?: U;
};

/**
 * PrismaのLearningLogモデルからLearningLog型への変換
 * （createdAt を除去して、特定属性を null から undefined に変換）
 */
const toAppLearningLog = (
  prismaLearningLog: PrismaLearningLog,
): LearningLog => {
  const { createdAt, taskId, startedAt, endedAt, ...rest } = prismaLearningLog;
  return {
    ...rest,
    taskId: taskId ?? undefined,
    startedAt: startedAt ?? undefined,
    endedAt: endedAt ?? undefined,
  };
};

/**
 * LearningLogのCRUD操作を担当するサービスクラス
 *
 * 基本的に、このサービスクラスの各メソッドでは認証や認可の検証処理はしないので、
 * サービスクラスの利用側で、認証・認可を確認して利用してください。
 * 各種処理の失敗は、エラーによって通知する設計としています。
 */
class LearningLogService {
  private readonly prisma: DbClient;

  public constructor(prisma: DbClient) {
    this.prisma = prisma;
  }

  public async count(): Promise<number> {
    return await this.prisma.learningLog.count();
  }

  /**
   * LogIdをキーとした学習ログ情報の取得（存在しなければ null を返す）
   * @template T extends PRS.LearningLogInclude - includeオプションの型
   * @template U extends PRS.LearningLogSelect - selectオプションの型
   * @param logId - 取得する学習ログのID
   * @param options - Prismaクエリオプション（include、selectなど）
   */
  public async tryGetById<
    T extends PRS.LearningLogInclude,
    U extends PRS.LearningLogSelect,
  >(
    logId: string,
    options?: LearningLogReturnType<T, U>,
  ): Promise<PRS.LearningLogGetPayload<{ include: T; select: U }> | null> {
    return (await this.prisma.learningLog.findUnique({
      where: { id: logId },
      ...options,
    })) as PRS.LearningLogGetPayload<{ include: T; select: U }> | null;
  }

  /**
   * 所有権チェック付きでLogIdによる学習ログ情報の取得（該当なしや権限なしの場合は例外をスロー）
   * @param userId - 所有権を確認するユーザーID（nullの場合は所有権チェックなし）
   * @param logId - 取得する学習ログのID
   * @param options - Prismaクエリオプション（include、selectなど）
   * @throws {LearningLogNotFoundError} 指定されたIDの学習ログが存在しない場合
   * @throws {UserPermissionDeniedError} 指定されたユーザーが学習ログの所有者ではない場合
   */
  public async getByIdWithOwnershipCheck<
    T extends PRS.LearningLogInclude,
    U extends PRS.LearningLogSelect,
  >(
    userId: string | null,
    logId: string,
    options?: LearningLogReturnType<T, U>,
  ): Promise<PRS.LearningLogGetPayload<{ include: T; select: U }>> {
    // userId が指定されている場合は所有権チェックのために先に userId のみを取得
    // - selection で userId が指定されていない場合にも備える
    if (userId) {
      const ownershipCheck = await this.prisma.learningLog.findUnique({
        where: { id: logId },
        select: { userId: true },
      });
      if (!ownershipCheck) throw new LearningLogNotFoundError(logId);
      if (ownershipCheck.userId !== userId) {
        throw new UserPermissionDeniedError({
          userId,
          actualRole: "Unknown",
          message: `User ${userId} does not own LearningLog ${logId}`,
        });
      }
    }

    // 所有権確認後、実際のデータを取得
    const learningLog = await this.tryGetById(logId, options);
    // 学習ログの存在チェック
    if (!learningLog) throw new LearningLogNotFoundError(logId);
    return learningLog;
  }

  // 新規作成 [Create]
  public async create(
    userId: string,
    data: LearningLogInsertRequest,
  ): Promise<LearningLog> {
    const createdLearningLog = await this.prisma.learningLog.create({
      data: {
        ...data,
        taskId: data.taskId ?? null,
        startedAt: data.startedAt ?? null,
        endedAt: data.endedAt ?? null,
        userId,
      },
    });
    return toAppLearningLog(createdLearningLog);
  }

  // 更新 [Update]
  public async update(
    userId: string | null,
    logId: string,
    data: LearningLogUpdateRequest,
  ): Promise<LearningLog> {
    await this.getByIdWithOwnershipCheck(userId, logId);
    const updatedLearningLog = await this.prisma.learningLog.update({
      where: { id: logId },
      data: {
        ...data,
        taskId: data.taskId ?? null,
        startedAt: data.startedAt ?? null,
        endedAt: data.endedAt ?? null,
      },
    });
    return toAppLearningLog(updatedLearningLog);
  }

  // 削除 [Delete]
  public async delete(userId: string | null, logId: string): Promise<void> {
    await this.getByIdWithOwnershipCheck(userId, logId);
    await this.prisma.learningLog.delete({ where: { id: logId } });
  }

  /**
   * ユーザーの学習ログをページネーション付きで取得
   * @param userId - 対象とするユーザーのID。呼び出し元で存在を要保証
   * @param page - 何ページ目か（Default:1）。呼び出し元で1以上を要保証
   * @param perPage - 1ページに何件か（Default:5）。呼び出し元で1以上を要保証
   * @param order - ソート順序（Default: "desc" 新しい順）
   * @returns 学習ログのバッチのPromise
   */
  public async getPaginatedBatch(
    userId: string,
    page: number = 1,
    perPage: number = 5,
    order: SortOrder = "desc",
  ): Promise<LearningLogsBatch> {
    // ソート設定
    // プライマリソート: startedAt（未設定= null は常に先頭に配置（暗黙に入力を促す）
    // セカンダリソート: createdAt、タイブレーカ: id
    const orderBy: PRS.LearningLogOrderByWithRelationInput[] = [
      { startedAt: { sort: order, nulls: "first" } },
      { createdAt: order },
      { id: order },
    ];

    // データ取得とカウントを並行実行
    const [rawLearningLogs, total] = await Promise.all([
      this.prisma.learningLog.findMany({
        where: { userId },
        orderBy,
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      this.prisma.learningLog.count({
        where: { userId },
      }),
    ]);

    // createdAt プロパティを除去、型のマッピング（null → undefined）
    const learningLogs = rawLearningLogs.map(toAppLearningLog);
    const batch: LearningLogsBatch = learningLogsBatchSchema.parse({
      learningLogs,
      pageInfo: { page, perPage, total },
      sortOrder: order,
    });
    return batch;
  }
}

export { LearningLogService };
