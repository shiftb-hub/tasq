import { Role } from "@prisma/client";

/**
 * StudentServiceテスト用の共通モックデータ
 * 学習支援に特化した現実的なデータとして作成
 */

/**
 * テスト用受講生ユーザーデータ
 */
export const mockStudentUsers = [
  {
    id: "student-001",
    name: "田中 学習太郎",
    role: Role.STUDENT,
    currentChapter: 3,
    slackId: "@tanaka_learn",
    bio: "フロントエンド学習中",
  },
  {
    id: "student-002",
    name: "佐藤 苦戦花子",
    role: Role.STUDENT,
    currentChapter: 1,
    slackId: "@sato_struggle",
    bio: "プログラミング初心者",
  },
  {
    id: "student-003",
    name: "鈴木 理解次郎",
    role: Role.STUDENT,
    currentChapter: 5,
    slackId: "@suzuki_understand",
    bio: "バックエンドに挑戦中",
  },
  {
    id: "student-004",
    name: "高橋 困り助",
    role: Role.STUDENT,
    currentChapter: 2,
    slackId: "@takahashi_stuck",
    bio: "エラーと友達",
  },
];

/**
 * テスト用教師ユーザーデータ
 */
export const mockTeacherUsers = [
  {
    id: "teacher-001",
    name: "山田 指導先生",
    role: Role.TEACHER,
    slackId: "@yamada_sensei",
    bio: "Web開発講師",
  },
  {
    id: "teacher-002",
    name: "田村 サポート先生",
    role: Role.TEACHER,
    slackId: "@tamura_support",
    bio: "学習サポート担当",
  },
];

/**
 * テスト用タスクデータ
 */
export const mockTasks = [
  {
    title: "React基礎コンポーネント作成",
    description: "useStateとuseEffectを使ったカウンターコンポーネントを作成",
    relatedChapter: 3,
  },
  {
    title: "TypeScript型定義の理解",
    description: "interfaceとtypeの違いを学習し、実装する",
    relatedChapter: 4,
  },
  {
    title: "API連携の実装",
    description: "fetch APIを使ったデータ取得処理を実装",
    relatedChapter: 5,
  },
  {
    title: "エラーハンドリングの実装",
    description: "try-catch文を使った適切なエラー処理を実装",
    relatedChapter: 2,
  },
  {
    title: "テストコードの作成",
    description: "Jestを使った単体テストの作成",
    relatedChapter: 6,
  },
];

/**
 * ネガティブな感情タグ（詰まりタスク判定用）
 */
export const mockNegativeTags = [
  { name: "不安", icon: "😟", order: 1 },
  { name: "迷っている", icon: "😕", order: 3 },
  { name: "難しい", icon: "😣", order: 5 },
  { name: "自信がない", icon: "😰", order: 8 },
];

/**
 * ポジティブな感情タグ（対照用）
 */
export const mockPositiveTags = [
  { name: "楽しい", icon: "😊", order: 4 },
  { name: "理解できた", icon: "💡", order: 6 },
  { name: "もっと知りたい", icon: "🔍", order: 7 },
];

/**
 * ステータスデータ
 */
export const mockStatuses = [
  { name: "作業中", order: 1, icon: "⚡" },
  { name: "レビュー待ち", order: 2, icon: "👀" },
  { name: "修正中", order: 3, icon: "🔧" },
  { name: "完了", order: 4, icon: "✅" },
  { name: "保留", order: 5, icon: "⏸️" },
];

/**
 * テスト用の日時データ（トレンド計算用）
 */
export const mockDates = {
  now: new Date("2025-01-15T12:00:00Z"),
  sevenDaysAgo: new Date("2025-01-08T12:00:00Z"),
  threeDaysAgo: new Date("2025-01-12T12:00:00Z"),
  oneDayAgo: new Date("2025-01-14T12:00:00Z"),
  future: new Date("2025-01-20T12:00:00Z"),
};

/**
 * 期待されるStudentListItemの構造（検証用）
 */
export const expectedStudentListItemStructure = {
  id: "string",
  name: "string",
  profileImageKey: "string | null",
  role: "string",
  currentChapter: "number",
  slackId: "string | null",
  favorite: "boolean",
  totalTasks: "number",
  stuckTasks: "number",
  stuckTasksTrend: "number",
  createdAt: "string",
  updatedAt: "string",
};
