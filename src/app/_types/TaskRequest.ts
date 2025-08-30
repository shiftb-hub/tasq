import { z } from "zod";

// タスク作成リクエスト
export const CreateTaskRequestSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  userId: z.string().uuid().optional(),
  statusId: z.string().uuid().optional(),
  tagId: z.string().uuid().optional(),
  activityTypeId: z.string().uuid().optional(),
  relatedChapter: z.number().int().positive().optional(),
  startedAt: z.string().datetime().optional(),
  endedAt: z.string().datetime().optional(),
});

export type CreateTaskRequest = z.infer<typeof CreateTaskRequestSchema>;

// タスク更新リクエスト
export const UpdateTaskRequestSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  statusId: z.string().uuid().optional(),
  tagId: z.string().uuid().optional(),
  activityTypeId: z.string().uuid().optional(),
  relatedChapter: z.number().int().positive().optional(),
  startedAt: z.string().datetime().optional(),
  endedAt: z.string().datetime().optional(),
});

export type UpdateTaskRequest = z.infer<typeof UpdateTaskRequestSchema>;

// タスク一覧取得クエリパラメータ
export const TaskQuerySchema = z.object({
  userId: z.string().uuid().optional(),
  statusId: z.string().uuid().optional(),
  tagId: z.string().uuid().optional(),
  activityTypeId: z.string().uuid().optional(),
});

export type TaskQuery = z.infer<typeof TaskQuerySchema>;