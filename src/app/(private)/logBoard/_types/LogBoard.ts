// 学習時間データ
export type LearningTimeData = {
  name: string;       // カテゴリ名
  value: number;      // 時間数
  percentage: number; // パーセンテージ
  color: string;      // 表示色
};

// 週次データ
export type WeeklyData = {
  week: string;
  Programming: number;
  Design: number;
  Reading: number;
  Practice: number;
};

// 月次トレンドデータ
export type MonthlyTrendData = {
  month: string;
  hours: number;
};

// 目標データ
export type Goal = {
  title: string;
  progress: number;
  color: string;
};