import { requireEnv } from "@/app/_libs/env";

export const isDevelopmentEnv = process.env.NODE_ENV === "development";
export const isDebugMode = false;

export const appBaseUrl = requireEnv("NEXT_PUBLIC_APP_BASE_URL");
export const appName = "TASQ";
export const avatarBucket = "img_avatar";

export const publicPaths = new Set([
  "/",
  "/login",
  "/signup",
  "/contact",
  "/api/playground/hoge",
]);
