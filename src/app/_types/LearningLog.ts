import { z } from "zod";
import {
  uuidSchema,
  learningLogDescriptionSchema,
  learningLogReflectionsSchema,
  learningLogTitleSchema,
  learningLogSpentMinutesSchema,
  learningLogDateSchema,
} from "@/app/_types/CommonSchemas";

export const learningLogSchema = z.object({
  id: uuidSchema,
  userId: uuidSchema,
  taskId: uuidSchema.optional(), // タスクに紐づく場合は存在する
  title: learningLogTitleSchema,
  description: learningLogDescriptionSchema, // 学習内容の詳細
  reflections: learningLogReflectionsSchema, // 振り返り・課題や反省・改善点・学び
  spentMinutes: learningLogSpentMinutesSchema, // 投資時間（分）
  startedAt: learningLogDateSchema,
  endedAt: learningLogDateSchema,
});

export type LearningLog = z.infer<typeof learningLogSchema>;

// ページネーション関連のスキーマ
export const pageInfoSchema = z.object({
  page: z.number().int().min(1), // 現在のページ番号
  perPage: z.number().int().min(1), // 1ページの件数
  total: z.number().int().min(0), // 総件数
});

export const sortOrderSchema = z.enum(["asc", "desc"]);
export type SortOrder = z.infer<typeof sortOrderSchema>;

export type PageInfo = z.infer<typeof pageInfoSchema>;

export const learningLogsBatchSchema = z.object({
  learningLogs: learningLogSchema.array(),
  pageInfo: pageInfoSchema,
  sortOrder: sortOrderSchema,
});

export type LearningLogsBatch = z.infer<typeof learningLogsBatchSchema>;

// クエリパラメータの処理用の型（/learning-logs?page=1&per=5&order=desc）

// 配列のときは先頭要素を使用（Next.jsの searchParams は string | string[] のことがある）
const first = (v: unknown) => (Array.isArray(v) ? v[0] : v);
const numberParam = (def: number, min: number, max: number) =>
  z.preprocess(
    first,
    z.coerce.number().int().min(min).max(max).catch(def).default(def),
  );
const orderParam = (def: "asc" | "desc") =>
  z.preprocess(first, z.enum(["asc", "desc"]).catch(def).default(def));

export const learningLogSearchParamsSchema = z.object({
  page: numberParam(1, 1, 999), // デフォルト値、最小値、最大値
  per: numberParam(5, 1, 100),
  order: orderParam("desc"),
});

export type LearningLogSearchParams = z.infer<
  typeof learningLogSearchParamsSchema
>;

// 挿入・更新の共通入力フィールド（id, userId以外）
const learningLogUpsertBaseSchema = z.object({
  taskId: uuidSchema.optional(),
  title: learningLogTitleSchema,
  description: learningLogDescriptionSchema,
  reflections: learningLogReflectionsSchema,
  spentMinutes: learningLogSpentMinutesSchema,
  startedAt: learningLogDateSchema,
  endedAt: learningLogDateSchema,
});

// 挿入用スキーマ
export const learningLogInsertRequestSchema = learningLogUpsertBaseSchema;

// 更新用スキーマ（入力フィールド + id）
export const learningLogUpdateRequestSchema =
  learningLogUpsertBaseSchema.extend({
    id: uuidSchema,
  });

// 型定義
export type LearningLogInsertRequest = z.infer<
  typeof learningLogInsertRequestSchema
>;
export type LearningLogUpdateRequest = z.infer<
  typeof learningLogUpdateRequestSchema
>;
