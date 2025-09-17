import { z } from "zod";

// ActivityType作成リクエスト
export const CreateActivityTypeRequestSchema = z.object({
  name: z.string().min(1).max(50),
  order: z.number().int().positive(),
  description: z.string().max(255).optional(),
});

export type CreateActivityTypeRequest = z.infer<typeof CreateActivityTypeRequestSchema>;

// ActivityType更新リクエスト
export const UpdateActivityTypeRequestSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  order: z.number().int().positive().optional(),
  description: z.string().max(255).optional(),
});

export type UpdateActivityTypeRequest = z.infer<typeof UpdateActivityTypeRequestSchema>;