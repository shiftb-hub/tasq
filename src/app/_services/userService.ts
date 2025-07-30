import { Role, PrismaClient } from "@prisma/client";
import { Prisma as PRS } from "@prisma/client";
import { AppUserNotFoundError } from "@/app/_libs/errors";

/**
 * Prisma UserのincludeとselectオプションをサポートするためのTypeヘルパー
 * @template T extends PRS.UserInclude - includeオプションの型
 * @template U extends PRS.UserSelect - selectオプションの型
 */
export type UserReturnType<
  T extends PRS.UserInclude,
  U extends PRS.UserSelect,
> = {
  include?: T;
  select?: U;
};

/**
 * UserのCRUD操作を行なうサービスクラス
 *
 * 基本的に、このサービスクラスでは認証や認可の検証処理はしない
 * 呼び出す側で、認証・認可を確認して利用すること
 *
 * @example
 * ```typescript
 * const userService = new UserService(prisma);
 * const user = await userService.getById("user123");
 * ```
 */
class UserService {
  private prisma: PrismaClient;

  /**
   * UserServiceのコンストラクタ
   * @param prisma - PrismaClientのインスタンス
   */
  public constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * データベース内の全ユーザー数を取得
   * @returns ユーザー数のPromise
   * @example
   * ```typescript
   * const totalUsers = await userService.count();
   * console.log(`総ユーザー数: ${totalUsers}`);
   * ```
   */
  public async count(): Promise<number> {
    return await this.prisma.user.count();
  }

  /**
   * 全てのユーザーを取得
   * @template T extends PRS.UserInclude - includeオプションの型
   * @template U extends PRS.UserSelect - selectオプションの型
   * @param options - Prismaクエリオプション（include、selectなど）
   * @returns 全ユーザーの配列のPromise
   * @example
   * ```typescript
   * // 全フィールドを取得
   * const allUsers = await userService.getAll();
   *
   * // 特定フィールドのみ選択
   * const usersWithNameOnly = await userService.getAll({
   *   select: { id: true, name: true }
   * });
   * ```
   */
  public async getAll<T extends PRS.UserInclude, U extends PRS.UserSelect>(
    options?: UserReturnType<T, U>,
  ): Promise<PRS.UserGetPayload<{ include: T; select: U }>[]> {
    return (await this.prisma.user.findMany({
      ...options,
    })) as PRS.UserGetPayload<{ include: T; select: U }>[];
  }

  /**
   * IDによるユーザー情報の取得（該当なしの場合は例外をスロー）
   * @template T extends PRS.UserInclude - includeオプションの型
   * @template U extends PRS.UserSelect - selectオプションの型
   * @param id - 取得するユーザーのID
   * @param options - Prismaクエリオプション（include、selectなど）
   * @returns ユーザー情報のPromise
   * @throws {AppUserNotFoundError} 指定されたIDのユーザーが存在しない場合
   * @example
   * ```typescript
   * try {
   *   const user = await userService.getById("user123");
   *   console.log(user.name);
   * } catch (error) {
   *   if (error instanceof AppUserNotFoundError) {
   *     console.log("ユーザーが見つかりません");
   *   }
   * }
   * ```
   */
  public async getById<T extends PRS.UserInclude, U extends PRS.UserSelect>(
    id: string,
    options?: UserReturnType<T, U>,
  ): Promise<PRS.UserGetPayload<{ include: T; select: U }>> {
    const user = await this.tryGetById(id, options);
    if (!user) {
      throw new AppUserNotFoundError(id);
    }
    return user;
  }

  /**
   * IDによるユーザー情報の取得（該当なしの場合は null を返す）
   * @template T extends PRS.UserInclude - includeオプションの型
   * @template U extends PRS.UserSelect - selectオプションの型
   * @param id - 取得するユーザーのID
   * @param options - Prismaクエリオプション（include、selectなど）
   * @returns ユーザー情報またはnullのPromise
   * @example
   * ```typescript
   * const user = await userService.tryGetById("user123");
   * if (user) {
   *   console.log(`ユーザー名: ${user.name}`);
   * } else {
   *   console.log("ユーザーが見つかりませんでした");
   * }
   * ```
   */
  public async tryGetById<T extends PRS.UserInclude, U extends PRS.UserSelect>(
    id: string,
    options?: UserReturnType<T, U>,
  ): Promise<PRS.UserGetPayload<{ include: T; select: U }> | null> {
    return (await this.prisma.user.findUnique({
      where: { id },
      ...options,
    })) as PRS.UserGetPayload<{ include: T; select: U }> | null;
  }

  /**
   * ユーザー情報の更新
   * @param id - 更新するユーザーのID
   * @param data - 更新するデータ（PrismaのUserUpdateInput形式）
   * @returns 更新成功の場合true
   * @throws {Error} 指定されたIDのユーザーが存在しない場合やその他のデータベースエラー
   * @example
   * ```typescript
   * await userService.update("<uuid>", {
   *   name: "仕様 曖昧子",
   *   slackId: "@曖昧子"
   * });
   * ```
   */
  public async update(id: string, data: PRS.UserUpdateInput): Promise<boolean> {
    await this.prisma.user.update({
      where: { id },
      // 特定のフィールドのみ更新 (idなどは更新させない)
      data: {
        name: data.name,
        job: data.job,
        currentChapter: data.currentChapter,
        slackId: data.slackId,
        instagramId: data.instagramId,
        threadsId: data.threadsId,
        xId: data.xId,
        githubId: data.githubId,
        bio: data.bio,
        profileImageKey: data.profileImageKey,
      },
    });
    return true;
  }

  /**
   * ユーザーの新規作成（STUDENTロール）
   * @param id - 新規作成するユーザーのID
   * @param name - ユーザー名
   * @returns 作成成功の場合true
   * @throws {Error} 同じIDのユーザーが既に存在する場合やその他のデータベースエラー
   * @example
   * ```typescript
   * await userService.createAsStudent("user123", "田中太郎");
   * ```
   */
  public async createAsStudent(id: string, name: string): Promise<boolean> {
    await this.prisma.user.create({
      data: {
        id,
        name,
        role: Role.STUDENT,
      },
    });
    return true;
  }

  /**
   * ユーザーの存在確認と新規作成（STUDENTロール）
   * 指定されたIDのユーザーが存在しない場合のみ新規作成を行う
   * @param id - 確認・作成するユーザーのID
   * @param name - ユーザー名（新規作成時に使用）
   * @returns 新規作成した場合true、既に存在していた場合false
   * @example
   * ```typescript
   * const wasCreated = await userService.createIfNotExists("user123", "田中太郎");
   * if (wasCreated) {
   *   console.log("新しいユーザーを作成しました");
   * } else {
   *   console.log("ユーザーは既に存在しています");
   * }
   * ```
   */
  public async createIfNotExists(id: string, name: string): Promise<boolean> {
    const exists = await this.tryGetById(id);
    if (exists) return false;
    await this.createAsStudent(id, name);
    return true;
  }
}

export { UserService };
