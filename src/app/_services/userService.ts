import { Role, PrismaClient } from "@prisma/client";
import { Prisma as PRS } from "@prisma/client";
import { AppUserNotFoundError } from "@/app/_libs/errors";

export type UserReturnType<
  T extends PRS.UserInclude,
  U extends PRS.UserSelect,
> = {
  include?: T;
  select?: U;
};

// UserのCRUD操作を行なうクラス
//   基本的に、このサービスクラスでは認証や認可の検証処理はしない
//   呼び出す側で、認証・認可を確認して利用すること
class UserService {
  private prisma: PrismaClient;

  public constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // ユーザ数の取得
  public async count(): Promise<number> {
    return await this.prisma.user.count();
  }

  // 全てのユーザを取得
  public async getAll<T extends PRS.UserInclude, U extends PRS.UserSelect>(
    options?: UserReturnType<T, U>,
  ): Promise<PRS.UserGetPayload<{ include: T; select: U }>[]> {
    return (await this.prisma.user.findMany({
      ...options,
    })) as PRS.UserGetPayload<{ include: T; select: U }>[];
  }

  // IDによるユーザ情報の取得 (該当なしの場合は例外をスロー)
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

  // IDによるユーザ情報の取得 (該当なしの場合は null を返す)
  public async tryGetById<T extends PRS.UserInclude, U extends PRS.UserSelect>(
    id: string,
    options?: UserReturnType<T, U>,
  ): Promise<PRS.UserGetPayload<{ include: T; select: U }> | null> {
    return (await this.prisma.user.findUnique({
      where: { id },
      ...options,
    })) as PRS.UserGetPayload<{ include: T; select: U }> | null;
  }

  // ユーザ情報の更新
  public async update(id: string, data: PRS.UserUpdateInput): Promise<boolean> {
    await this.prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        slackId: data.slackId,
      },
    });
    return true;
  }

  // ユーザの新規作成
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
}

export { UserService };
