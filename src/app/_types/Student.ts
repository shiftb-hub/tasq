// クライアント／サーバー共有の受講生型
export type StudentListItem = {
  id: string;
  name: string;
  profileImageKey: string | null;
  role: string;
  currentChapter: number;
  slackId: string | null;
  favorite: boolean;
  totalTasks: number;
  stuckTasks: number;
  stuckTasksTrend: number;
  createdAt: string;
  updatedAt: string;
};

export type ToggleFavoriteResult = {
  ok: boolean;
  favorite: boolean;
};

