// テストデータ

import type {
  LearningTimeData,
  WeeklyData,
  MonthlyTrendData,
  Goal,
} from "../_types/LogBoard";

export const learningTimeData: LearningTimeData[] = [
  { name: "Programming", value: 48.2, percentage: 38, color: "#3B82F6" },
  { name: "Design", value: 32.1, percentage: 25, color: "#10B981" },
  { name: "Reading", value: 24.8, percentage: 19, color: "#F59E0B" },
  { name: "Practice", value: 22.4, percentage: 18, color: "#EF4444" },
];

export const weeklyData: WeeklyData[] = [
  {
    week: "Week 1",
    Programming: 12,
    Design: 8,
    Reading: 6,
    Practice: 4,
  },
  {
    week: "Week 2",
    Programming: 15,
    Design: 10,
    Reading: 7,
    Practice: 5,
  },
  {
    week: "Week 3",
    Programming: 13,
    Design: 9,
    Reading: 6,
    Practice: 4,
  },
  {
    week: "Week 4",
    Programming: 16,
    Design: 12,
    Reading: 8,
    Practice: 6,
  },
];

export const monthlyTrendData: MonthlyTrendData[] = [
  { month: "Jan", hours: 25 },
  { month: "Feb", hours: 30 },
  { month: "Mar", hours: 28 },
  { month: "Apr", hours: 35 },
  { month: "May", hours: 32 },
  { month: "Jun", hours: 38 },
];

export const goalsData: Goal[] = [
  {
    title: "Complete 40 hours of learning",
    progress: 85,
    color: "#10B981",
  },
  {
    title: "Finish 3 programming courses",
    progress: 67,
    color: "#3B82F6",
  },
  {
    title: "Read 2 technical books",
    progress: 50,
    color: "#F59E0B",
  },
  {
    title: "Build 2 side projects",
    progress: 25,
    color: "#EF4444",
  },
];
