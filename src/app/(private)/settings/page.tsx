import prisma from "@/app/_libs/prisma";
import { DevAuthButton } from "@/app/_components/DevAuthButton";
import { authenticateAppUser } from "@/app/_libs/authenticateUser";
import {
  AppUserNotFoundError,
  SupabaseUserNotFoundError,
} from "@/app/_libs/errors";
import { User } from "@prisma/client";
import { UserService } from "@/app/_services/userService";

// SSR対応のため、ページコンポーネントは非同期関数として定義
export const dynamic = "force-dynamic";
const Page: React.FC = async () => {
  let user: User | null = null;
  let errMsg: string | null = null;
  try {
    // 認証されたユーザ情報を取得
    user = await authenticateAppUser();

    const userService = new UserService(prisma);
    user = await userService.getById(user.id, {
      select: {
        id: true,
        name: true,
        slackId: true,
        role: true,
        job: true,
      },
    });
  } catch (e) {
    console.error(e);
    user = null;
    if (
      e instanceof SupabaseUserNotFoundError ||
      e instanceof AppUserNotFoundError
    ) {
      errMsg = e.message;
    } else {
      errMsg = "予期しないエラーが発生しました。";
    }
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="text-2xl font-bold">セッティング</div>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      {errMsg && <div className="text-red-500">{errMsg}</div>}
      <DevAuthButton />
    </div>
  );
};

export default Page;
