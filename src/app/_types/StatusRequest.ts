import { z } from "zod";

// ステータス作成リクエスト
export const CreateStatusRequestSchema = z.object({
  name: z.string().min(1).max(50),
  order: z.number().int().positive(),
  icon: z.string().max(255).optional(),
});

export type CreateStatusRequest = z.infer<typeof CreateStatusRequestSchema>;

// ステータス更新リクエスト
export const UpdateStatusRequestSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  order: z.number().int().positive().optional(),
  icon: z.string().max(255).optional(),
});

export type UpdateStatusRequest = z.infer<typeof UpdateStatusRequestSchema>;