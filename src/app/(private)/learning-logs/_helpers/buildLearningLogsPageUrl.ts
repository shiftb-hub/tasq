import { learningLogSearchParamsSchema } from "@/app/_types/LearningLog";

// スキーマのデフォルト値を取得
const DEFAULT_VALUES = learningLogSearchParamsSchema.parse({});

export const buildLearningLogsPageUrl = (
  page: number,
  sortOrder: string,
  perPage: number,
): string => {
  const params = new URLSearchParams();
  if (page !== DEFAULT_VALUES.page) params.set("page", String(page));
  if (sortOrder !== DEFAULT_VALUES.order) params.set("order", sortOrder);
  if (perPage !== DEFAULT_VALUES.per) params.set("per", String(perPage));

  const queryString = params.toString();
  return `/learning-logs${queryString ? `?${queryString}` : ""}`;
};
