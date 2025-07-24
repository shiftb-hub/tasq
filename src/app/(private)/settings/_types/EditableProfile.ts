import { z } from "zod";
import { emailSchema, passwordSchema } from "@/app/_types/CommonSchemas";

// ユーザープロフィールの更新リクエスト
export const updateProfileRequestSchema = z.object({
  name: z.string().min(1).max(16),
});
export type UpdateProfileRequest = z.infer<typeof updateProfileRequestSchema>;

// ユーザープロフィールの更新レスポンス
export const updateProfileResponseSchema = z.object({
  // 処理が成功したか？
  success: z.boolean(),
});
export type UpdateProfileResponse = z.infer<typeof updateProfileResponseSchema>;
