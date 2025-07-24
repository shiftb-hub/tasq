import prisma from "@/app/_libs/prisma";
import { UserService } from "@/app/_services/userService";

// UIコンポーネント・アイコン
import ProfileEditorView from "./_components/ProfileEditorView";

// 型定義・バリデーションスキーマ
import { User } from "@prisma/client";

// ServerActions / API系
import { isDevelopmentEnv } from "@/app/_configs/app-config";

// ユーティリティ
import { dumpError } from "@/app/_libs/dumpException";
import { authenticateAppUser } from "@/app/_libs/authenticateUser";

export const dynamic = "force-dynamic";

// SSR対応のページコンポーネント
const Page: React.FC = async () => {
  let user: User | null = null;
  const errMsg: string | null = null;
  try {
    user = await authenticateAppUser();
    
  } catch (e) {
    const meta = { userId: user?.id };
    dumpError(e, "プロフィール設定", meta);
  }

  return (
    <div className="flex justify-center pt-12">
      <div className="w-full max-w-[460px]">
        <h1 className="mb-8 text-center text-3xl font-bold">
          プロフィール設定
        </h1>
        {user ? (
          <ProfileEditorView email="hoge" />
        ) : (
          <p>ユーザー情報の取得に失敗しました。</p>
        )}
      </div>
    </div>
  );
};

export default Page;
