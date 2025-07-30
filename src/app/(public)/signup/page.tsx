// 認証
import { maybeAuthenticateSupabaseUser } from "@/app/_libs/authenticateUser";

// UIコンポーネント
import { ErrorPage } from "@/app/_components/ErrorPage";
import { SignupPage } from "./_components/SignupPage";
import { AlreadyLoggedInPage } from "@/app/_components/AlreadyLoggedInPage";

// ユーティリティ
import { dumpError } from "@/app/_libs/dumpException";

export const dynamic = "force-dynamic";

/**
 * サインアップページ（SSR）
 *
 * @returns JSX.Element
 */
const Page: React.FC = async () => {
  try {
    const supabaseUser = await maybeAuthenticateSupabaseUser();
    if (!supabaseUser) {
      return <SignupPage />;
    }
    // 既にログインしているときはログアウトを促すページを表示
    const email = supabaseUser.email;
    if (!email) {
      throw new Error("Supabase user email is not available.");
    }
    return <AlreadyLoggedInPage email={email} action="サインアップ" />;
  } catch (e) {
    dumpError(e, "サインアップページのSSR処理でエラーが発生");
    return <ErrorPage message="問題が発生しました。" />;
  }
};

export default Page;
