/**
 * 受講生のモックデータ
 * @description 以下のフィールドはUserスキーマに存在しないが、ページ表示に必要な要素
 * @property {boolean} favorite - お気に入り状態（TeacherStudentリレーションで管理可能）
 * @property {number} totalTasks - 全タスク数（User.tasksリレーションで計算可能）
 * @property {number} stuckTasks - 困っているタスク数（Task.statusリレーションで計算可能）
 * @property {number} stuckTasksTrend - お困りタスクの変化量（正数=増加、負数=減少、0=変化なし）
 */
export const mockStudents = [
  {
    id: "1",
    name: "田中 太郎",
    profileImageKey: null,
    role: "STUDENT",
    currentChapter: 5,
    slackId: "tanaka_taro",
    favorite: false,
    totalTasks: 12,
    stuckTasks: 2,
    stuckTasksTrend: 2, // 2個増加
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-12-01T14:30:00Z",
  },
  {
    id: "2",
    name: "佐藤 花子",
    profileImageKey: null,
    role: "STUDENT",
    currentChapter: 8,
    slackId: "sato_hanako",
    favorite: true,
    totalTasks: 18,
    stuckTasks: 0,
    stuckTasksTrend: -3, // 3個減少
    createdAt: "2024-02-20T10:15:00Z",
    updatedAt: "2024-12-02T16:45:00Z",
  },
  {
    id: "3",
    name: "山田 次郎",
    profileImageKey: null,
    role: "STUDENT",
    currentChapter: 3,
    slackId: "yamada_jiro",
    favorite: false,
    totalTasks: 8,
    stuckTasks: 3,
    stuckTasksTrend: 0, // 変化なし
    createdAt: "2024-03-10T11:30:00Z",
    updatedAt: "2024-11-30T12:20:00Z",
  },
  {
    id: "4",
    name: "鈴木 美咲",
    profileImageKey: null,
    role: "STUDENT",
    currentChapter: 12,
    slackId: "suzuki_misaki",
    favorite: true,
    totalTasks: 25,
    stuckTasks: 1,
    stuckTasksTrend: 1, // 1個増加
    createdAt: "2024-01-25T08:45:00Z",
    updatedAt: "2024-12-03T09:15:00Z",
  },
  {
    id: "5",
    name: "渡辺 健太",
    profileImageKey: null,
    role: "STUDENT",
    currentChapter: 1,
    slackId: "watanabe_kenta",
    favorite: false,
    totalTasks: 3,
    stuckTasks: 1,
    stuckTasksTrend: -1, // 1個減少
    createdAt: "2024-11-01T13:20:00Z",
    updatedAt: "2024-12-01T18:30:00Z",
  },
  {
    id: "6",
    name: "高橋 麻衣",
    profileImageKey: null,
    role: "STUDENT",
    currentChapter: 7,
    slackId: "takahashi_mai",
    favorite: false,
    totalTasks: 15,
    stuckTasks: 0,
    stuckTasksTrend: 0, // 変化なし
    createdAt: "2024-04-05T14:10:00Z",
    updatedAt: "2024-12-02T11:40:00Z",
  },
];
