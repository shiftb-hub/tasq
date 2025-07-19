import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { publicPaths } from "@/app/_configs/app-config";
import { ApiResponseBuilder as ResBuilder } from "@/app/_types/ApiResponse";
import { AppErrorCodes } from "@/app/_types/AppErrorCodes";

export const updateSession = async (request: NextRequest) => {
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
  } = await supabase.auth.getUser();

  if (!user && !publicPaths.has(request.nextUrl.pathname)) {
    // APIルートの場合はJSONレスポンスを返す
    if (request.nextUrl.pathname.startsWith("/api/")) {
      return new NextResponse(
        JSON.stringify(
          ResBuilder.error(AppErrorCodes.UNAUTHORIZED)
            .withDescription("You must be logged in to access this resource")
            .build(),
        ),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    // APIルート以外の場合はログインページにリダイレクト
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 重要：supabaseResponse オブジェクトは、そのまま返却する必要があります。
  // もし新しく NextResponse.next() でレスポンスを作成する場合は、必ず次の点に注意してください：

  // 1. リクエスト情報を引き継ぐ（例：const myNewResponse = NextResponse.next({ request })）
  // 2. Cookie 情報を引き継ぐ（例：myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())）
  // 3. myNewResponse に必要な変更を加えても構いませんが、Cookie は変更しないこと！
  // 4. 最後に、myNewResponse を return すること。

  // これらを守らないと、ブラウザとサーバー間で状態がずれ、
  // ユーザーのセッションが予期せず切断されてしまう可能性があります！

  return supabaseResponse;
};
