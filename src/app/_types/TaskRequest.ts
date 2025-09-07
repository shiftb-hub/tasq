import { z } from "zod";

// タスク作成リクエスト
export const CreateTaskRequestSchema = z
  .object({
    title: z.string().min(1).max(255),
    description: z.string().max(1000).optional(),
    userId: z.string().uuid().optional(),
    statusId: z.string().uuid().optional(),
    tagIds: z.array(z.string().uuid()).optional(),
    activityTypeIds: z.array(z.string().uuid()).optional(),
    relatedChapter: z.number().int().positive().optional(),
    startedAt: z.string().datetime().optional(),
    endedAt: z.string().datetime().optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.startedAt && data.endedAt) {
      if (new Date(data.endedAt) < new Date(data.startedAt)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["endedAt"],
          message: "endedAt は startedAt 以降である必要があります",
        });
      }
    }
  });

export type CreateTaskRequest = z.infer<typeof CreateTaskRequestSchema>;

// タスク更新リクエスト
export const UpdateTaskRequestSchema = z
  .object({
    title: z.string().min(1).max(255).optional(),
    description: z.string().max(1000).optional(),
    statusId: z.string().uuid().optional(),
    tagIds: z.array(z.string().uuid()).optional(),
    activityTypeIds: z.array(z.string().uuid()).optional(),
    relatedChapter: z.number().int().positive().optional(),
    startedAt: z.string().datetime().optional(),
    endedAt: z.string().datetime().optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.startedAt && data.endedAt) {
      if (new Date(data.endedAt) < new Date(data.startedAt)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["endedAt"],
          message: "endedAt は startedAt 以降である必要があります",
        });
      }
    }
  });

export type UpdateTaskRequest = z.infer<typeof UpdateTaskRequestSchema>;

// タスク一覧取得クエリパラメータ
export const TaskQuerySchema = z.object({
  userId: z.string().uuid().optional(),
  statusId: z.string().uuid().optional(),
  tagIds: z.array(z.string().uuid()).optional(),
  activityTypeIds: z.array(z.string().uuid()).optional(),
});

export type TaskQuery = z.infer<typeof TaskQuerySchema>;