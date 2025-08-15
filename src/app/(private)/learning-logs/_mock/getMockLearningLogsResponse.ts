import type { LearningLog, LearningLogsBatch } from "@/app/_types/LearningLog";
import { learningLogsMock } from "./learningLogsMock";

export const getMockLearningLogsResponse = (
  page: number,
  perPage: number,
  sortOrder: "asc" | "desc",
): LearningLogsBatch => {
  // ソート処理 [primary sort key] startedAt、[secondary sort key] createdAt
  const sorted = [...learningLogsMock].sort((a, b) => {
    // prettier-ignore
    const aTime = a.startedAt ? a.startedAt.getTime() : Number.POSITIVE_INFINITY;
    // prettier-ignore
    const bTime = b.startedAt ? b.startedAt.getTime() : Number.POSITIVE_INFINITY;

    if (aTime !== bTime)
      return sortOrder === "desc" ? bTime - aTime : aTime - bTime;

    const aCreatedTime = a.createdAt.getTime();
    const bCreatedTime = b.createdAt.getTime();
    return sortOrder === "desc"
      ? bCreatedTime - aCreatedTime
      : aCreatedTime - bCreatedTime;
  });

  const total = sorted.length;
  const offset = (page - 1) * perPage;
  const batchSlice = sorted.slice(offset, offset + perPage);

  // createdAt プロパティを除去
  const learningLogs: LearningLog[] = batchSlice.map(
    ({ createdAt, ...rest }) => rest,
  );

  return {
    learningLogs,
    pageInfo: {
      page,
      perPage,
      total,
    },
    sortOrder: sortOrder,
  };
};
