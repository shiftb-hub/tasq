// 認証
import { maybeAuthenticateSupabaseUser } from "@/app/_libs/authenticateUser";

// UIコンポーネント
import { ErrorPage } from "@/app/_components/ErrorPage";
import { LoginPage } from "./_components/LoginPage";
import { AlreadyLoggedInPage } from "@/app/_components/AlreadyLoggedInPage";

// ユーティリティ
import { dumpError } from "@/app/_libs/dumpException";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

/**
 * ログインページ（SSR）
 *
 * @returns JSX.Element
 */
const Page: React.FC<Props> = async ({ searchParams }) => {
  try {
    const resolvedSearchParams = await searchParams;
    const emailFromQuery = Array.isArray(resolvedSearchParams.email)
      ? resolvedSearchParams.email[0]
      : resolvedSearchParams.email;

    const supabaseUser = await maybeAuthenticateSupabaseUser();
    if (!supabaseUser) {
      return <LoginPage email={emailFromQuery} />;
    }
    // 既にログインしているときはログアウトを促すページを表示
    const email = supabaseUser.email;
    if (!email) {
      throw new Error("Supabase user email is not available.");
    }
    return <AlreadyLoggedInPage email={email} action="ログイン" />;
  } catch (e) {
    dumpError(e, "ログインページ（SSR）");
    return <ErrorPage message="問題が発生しました。" />;
  }
};

export default Page;
