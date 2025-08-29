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
 * @note include と select は排他的な関係（同時に指定できない）
 * @template T extends PRS.LearningLogInclude - includeオプションの型
 * @template U extends PRS.LearningLogSelect - selectオプションの型
 */
export type LearningLogReturnType<
  T extends PRS.LearningLogInclude,
  U extends PRS.LearningLogSelect,
> = { include: T; select?: never } | { select: U; include?: never };

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
   * LogId をキーとした学習ログ情報の取得（存在しなければ null を返す）
   * - 指定された LogId の学習ログが存在しなければ `null` を返します。
   *
   * ### 使用方法
   * このメソッドはオーバーロードを利用しているため、引数 `options` の
   * 指定方法によって戻値の型が変わります。次の 3 パターンの利用を想定しています。
   * 注意：`select` と `include` は同時に指定できません。
   *
   * 1. **基本形**（オプションなし）
   *    ```ts
   *    const log = await tryGetById(logId);
   *    // => PrismaLearningLog | null
   *    ```
   *    学習ログそのものを取得します。
   *
   * 2. **任意のフィールドだけ取得する場合**（`select` を使用）
   *    ```ts
   *    const log = await tryGetById(logId, { select: { id: true, title: true } });
   *    // => { id: string, title: string } | null
   *    ```
   *
   * 3. **関連情報（UserやTask）を同時に取得する場合**（`include` を使用）
   *    ```ts
   *    const log = await tryGetById(logId, { include: { user: true } });
   *    // => { ...log, user: User } | null
   *    ```
   *    例えば「この学習ログを書いたユーザー情報」などのリレーションを同時に取得できます。
   *
   */
  public async tryGetById(logId: string): Promise<PrismaLearningLog | null>;
  public async tryGetById<T extends PRS.LearningLogInclude>(
    logId: string,
    options: { include: T },
  ): Promise<PRS.LearningLogGetPayload<{ include: T }> | null>;
  public async tryGetById<U extends PRS.LearningLogSelect>(
    logId: string,
    options: { select: U },
  ): Promise<PRS.LearningLogGetPayload<{ select: U }> | null>;
  public async tryGetById<
    T extends PRS.LearningLogInclude,
    U extends PRS.LearningLogSelect,
  >(
    logId: string,
    options?: LearningLogReturnType<T, U>,
  ): Promise<
    | PrismaLearningLog
    | PRS.LearningLogGetPayload<{ include: T }>
    | PRS.LearningLogGetPayload<{ select: U }>
    | null
  > {
    return await this.prisma.learningLog.findUnique({
      where: { id: logId },
      ...options,
    });
  }

  /**
   * 所有権チェック付きでLogIdによる学習ログ情報の取得（該当なしや権限なしの場合は例外をスロー）
   * @throws {LearningLogNotFoundError} 指定されたIDの学習ログが存在しない場合
   * @throws {UserPermissionDeniedError} 指定されたユーザーが学習ログの所有者ではない場合
   */
  public async getByIdWithOwnershipCheck(
    userId: string | null,
    logId: string,
  ): Promise<PrismaLearningLog>;
  public async getByIdWithOwnershipCheck<T extends PRS.LearningLogInclude>(
    userId: string | null,
    logId: string,
    options: { include: T },
  ): Promise<PRS.LearningLogGetPayload<{ include: T }>>;
  public async getByIdWithOwnershipCheck<U extends PRS.LearningLogSelect>(
    userId: string | null,
    logId: string,
    options: { select: U },
  ): Promise<PRS.LearningLogGetPayload<{ select: U }>>;
  public async getByIdWithOwnershipCheck<
    T extends PRS.LearningLogInclude,
    U extends PRS.LearningLogSelect,
  >(
    userId: string | null,
    logId: string,
    options?: LearningLogReturnType<T, U>,
  ): Promise<
    | PrismaLearningLog
    | PRS.LearningLogGetPayload<{ include: T }>
    | PRS.LearningLogGetPayload<{ select: U }>
  > {
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
    const learningLog = await this.prisma.learningLog.findUnique({
      where: { id: logId },
      ...options,
    });
    // 学習ログの存在チェック
    if (!learningLog) throw new LearningLogNotFoundError(logId);
    return learningLog as
      | PrismaLearningLog
      | PRS.LearningLogGetPayload<{ include: T }>
      | PRS.LearningLogGetPayload<{ select: U }>;
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
