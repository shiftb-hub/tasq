// @/app/_libs/env.ts
/**
 * 環境変数の一元管理
 * Next.jsの静的解析に対応するため、すべての環境変数を直接参照
 */

// 環境変数の型定義
export type EnvKey =
  | "NEXT_PUBLIC_APP_BASE_URL"
  | "NEXT_PUBLIC_SUPABASE_URL"
  | "NEXT_PUBLIC_SUPABASE_ANON_KEY";
// 必要な環境変数をここに追加

// 環境変数マップ（静的解析で検出されるように直接参照）
const envMap: Record<EnvKey, string | undefined> = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_APP_BASE_URL: process.env.NEXT_PUBLIC_APP_BASE_URL,
};

/**
 * 環境変数の取得（必須）
 * @param key 環境変数のキー
 * @returns 環境変数の値
 * @throws 環境変数が設定されていない場合にエラー
 */
export const requireEnv = (key: EnvKey): string => {
  const value = envMap[key];
  if (!value) {
    throw new Error(`${key} is not set. Please add it to your .env file`);
  }
  return value;
};

/**
 * 環境変数の取得（オプショナル）
 * @param key 環境変数のキー
 * @param defaultValue デフォルト値
 * @returns 環境変数の値またはデフォルト値
 */
export const getEnv = (
  key: EnvKey,
  defaultValue?: string,
): string | undefined => {
  return envMap[key] || defaultValue;
};

/**
 * 複数の環境変数を一度に検証
 * @param keys 検証する環境変数のキー配列
 * @throws いずれかの環境変数が設定されていない場合にエラー
 */
export const validateEnv = (keys: EnvKey[]): void => {
  const missingKeys = keys.filter((key) => !envMap[key]);
  if (missingKeys.length > 0) {
    throw new Error(`Missing environment variables: ${missingKeys.join(", ")}`);
  }
};

// よく使用する環境変数のグループ化
export const supabaseConfig = {
  url: requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
  anonKey: requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
};
