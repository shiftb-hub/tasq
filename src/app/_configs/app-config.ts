import { requireEnv } from "@/app/_libs/env";

export const isDevelopmentEnv = process.env.NODE_ENV === "development";
export const isDebugMode = false;

export const appBaseUrl = requireEnv("NEXT_PUBLIC_APP_BASE_URL");
export const appName = "TASQ";
export const avatarBucket = "img_avatar";

// 認証を要求しないパスを定義
// ここに定義されていないパスに未ログインでアクセスすると /login にリダイレクトされます
// APIルートの場合は失敗のJSONレスポンスが返されます
export const publicPaths = new Set([
  "/",
  "/login",
  "/signup",
  "/api/playground/tasks",
]);
