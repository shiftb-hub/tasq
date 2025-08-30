import { z } from "zod";

// タグ作成リクエスト
export const CreateTagRequestSchema = z.object({
  name: z.string().min(1).max(50),
  order: z.number().int().positive(),
  icon: z.string().max(255).optional(),
});

export type CreateTagRequest = z.infer<typeof CreateTagRequestSchema>;

// タグ更新リクエスト
export const UpdateTagRequestSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  order: z.number().int().positive().optional(),
  icon: z.string().max(255).optional(),
});

export type UpdateTagRequest = z.infer<typeof UpdateTagRequestSchema>;