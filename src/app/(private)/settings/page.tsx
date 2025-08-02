import prisma from "@/app/_libs/prisma";
import { UserService } from "@/app/_services/userService";
import { authenticateSupabaseUser } from "@/app/_libs/authenticateUser";

// UIコンポーネント・アイコン
import ProfileEditorView from "./_components/ProfileSettingView";

// 型定義・バリデーションスキーマ
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { User as AppUser } from "@prisma/client";
import type { SelfProfile } from "@/app/_types/Profile";
import { selfProfileSchema } from "@/app/_types/Profile";

// ユーティリティ
import { dumpError } from "@/app/_libs/dumpException";

export const dynamic = "force-dynamic";

/**
 * AppUserオブジェクト と SupabaseUserの email から SelfProfile を生成
 *
 * @param user - AppUserオブジェクト
 * @param email - メールアドレス（SupabaseAuthから取得）
 * @returns SelfProfile
 *
 * @note DB上は null だが、フォームバインドの際の整合性を保つために
 *       undefined に正規化している項目（job や slackId など）があることに注意
 */
const toSelfProfile = (user: AppUser, email: string): SelfProfile => {
  return selfProfileSchema.parse({
    name: user.name,
    role: user.role,
    email: email,
    job: user.job ?? undefined, // null なら undefined に変換
    currentChapter: user.currentChapter,
    slackId: user.slackId ?? undefined,
    instagramId: user.instagramId ?? undefined,
    threadsId: user.threadsId ?? undefined,
    xId: user.xId ?? undefined,
    githubId: user.githubId ?? undefined,
    bio: user.bio,
    profileImageKey: user.profileImageKey ?? undefined,
  });
};

/**
 *  共通ページレイアウトを提供するWrapper関数
 */
const withPageLayout = (content: React.ReactNode) => (
  <div className="mb-4 flex justify-center">
    <div className="w-full max-w-[460px]">
      <h1 className="mb-8 text-center text-3xl font-bold">プロフィール設定</h1>
      {content}
    </div>
  </div>
);

/**
 * プロフィール編集ページ（SSR）
 *
 * @returns JSX.Element
 */
const Page: React.FC = async () => {
  let supabaseUser: SupabaseUser | null = null;
  let appUser: AppUser | null = null;
  try {
    supabaseUser = await authenticateSupabaseUser();

    const userService = new UserService(prisma);
    appUser = await userService.getById(supabaseUser.id);

    // プロフィール編集フォームに渡す初期値
    const profileFormInitialValues = toSelfProfile(
      appUser,
      supabaseUser.email!,
    );
    return withPageLayout(
      <ProfileEditorView initValues={profileFormInitialValues} />,
    );
  } catch (e) {
    dumpError(e, "プロフィール設定", { supabaseUser, appUser });
    return withPageLayout(<p>ユーザー情報の取得に失敗しました。</p>);
  }
};

export default Page;
