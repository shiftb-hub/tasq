import type { LearningLogInsertRequest } from "@/app/_types/LearningLog";

/**
 * 学習ログのダミーデータの生成
 * title: "#01", "#02", ..., "#99"
 * description: 空文字 ""
 * reflections: 空文字 ""
 * 日付: 2025年2月1日から1日1件
 */
export const createDummyLearningLogData = (): LearningLogInsertRequest[] => {
  const logs: LearningLogInsertRequest[] = [];
  const baseDate = new Date("2025-02-01T09:30:00Z");

  for (let i = 1; i <= 99; i++) {
    const dayOffset = i - 1;
    const startedAt = new Date(baseDate);
    startedAt.setDate(baseDate.getDate() + dayOffset);

    const endedAt = new Date(startedAt);
    endedAt.setHours(startedAt.getHours() + 2); // 2時間後に終了

    logs.push({
      title: `#${String(i).padStart(2, "0")}`,
      description: "",
      reflections: "",
      spentMinutes: 120,
      startedAt,
      endedAt,
    });
  }

  return logs;
};

// startedAt が undefined（未設定）の学習ログデータを作成
export const createNullStartedAtLogData = (): LearningLogInsertRequest => ({
  title: "#NULL",
  description: "",
  reflections: "",
  spentMinutes: 60,
  startedAt: undefined, // startedAtをundefinedに設定
  endedAt: undefined,
});
