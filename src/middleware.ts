import type { NextRequest } from "next/server";
import { updateSession } from "@/app/_libs/supabase/middleware";

/**
 * 認証ミドルウェア
 * Supabaseセッション管理とルートガードを実行
 * パブリックパスの判定とリダイレクト処理はupdateSession内で処理
 */
export const middleware = async (request: NextRequest) => {
  return await updateSession(request);
};

export const config = {
  /**
   * Next.js固有のファイル以外のすべてのリクエストでミドルウェアを実行
   * 除外対象:
   * - _next/static (静的ファイル)
   * - _next/image (画像最適化ファイル)
   * - favicon.ico (ファビコン)
   *
   * Note: アプリケーションレベルのパブリックパス(/login, /signup等)は
   *       updateSession内で制御されるため、ここでは除外しない
   */
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|^/$|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
