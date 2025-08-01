import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { publicPaths } from "@/app/_configs/app-config";
import { ApiResponseBuilder as ResBuilder } from "@/app/_types/ApiResponse";
import { AppErrorCodes } from "@/app/_types/AppErrorCodes";

const isApiRoute = (pathname: string): boolean => pathname.startsWith("/api/");
const isPublicPath = (pathname: string): boolean => publicPaths.has(pathname);

const createApiErrorResponse = (
  errorCode: string,
  description: string,
  status: number,
) => {
  return new NextResponse(
    JSON.stringify(
      ResBuilder.error(errorCode).withDescription(description).build(),
    ),
    {
      status,
      headers: { "Content-Type": "application/json" },
    },
  );
};

// 重要：supabaseResponse オブジェクトは、そのまま返却する必要があります。
// もし新しく NextResponse.next() でレスポンスを作成する場合は、必ず次の点に注意してください：

// 1. リクエスト情報を引き継ぐ（例：const myNewResponse = NextResponse.next({ request })）
// 2. Cookie 情報を引き継ぐ（例：myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())）
// 3. myNewResponse に必要な変更を加えても構いませんが、Cookie は変更しないこと！
// 4. 最後に、myNewResponse を return すること。

// これらを守らないと、ブラウザとサーバー間で状態がずれ、
// ユーザーのセッションが予期せず切断されてしまう可能性があります！

export const updateSession = async (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // createServerClient と supabase.auth.getUser() の間にはコードを挟まないこと。
  // ここに処理を入れると、ユーザーが突然ログアウトされるなど、
  // 原因の特定が難しい問題が発生する恐れがあります。

  // 重要：auth.getUser() の呼び出しは絶対に削除しないでください。
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // パブリックパス or 認証OK → 早期リターン
  if (isPublicPath(pathname) || user !== null) {
    return supabaseResponse;
  }

  // Supabaseに接続不可のときの特別処理
  if (error?.name === "AuthRetryableFetchError") {
    console.error("Supabase接続に失敗。Supabaseの稼働状況を確認してください。");
    if (isApiRoute(pathname)) {
      return createApiErrorResponse(
        AppErrorCodes.SUPABASE_CONNECTION_ERROR,
        "Authentication service is currently unavailable. Please try again later.",
        503,
      );
    }
    // ページルートの場合はエラーページにリダイレクト
    const url = request.nextUrl.clone();
    url.pathname = "/error";
    url.searchParams.set("type", AppErrorCodes.SUPABASE_CONNECTION_ERROR);
    return NextResponse.redirect(url);
  }

  // APIルートで未認証の場合はJSONレスポンスを応答
  if (isApiRoute(pathname)) {
    return createApiErrorResponse(
      AppErrorCodes.UNAUTHORIZED,
      "You must be logged in to access this resource",
      401,
    );
  }

  // ページルートで未認証の場合はログインページにリダイレクト
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  return NextResponse.redirect(url);
};
