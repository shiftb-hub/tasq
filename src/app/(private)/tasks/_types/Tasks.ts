export type TaskPriority = "High Priority" | "Normal";

export type TaskType = "bug" | "frontend" | "backend";

export type EmotionTag = "😊" | "😰" | "🥹";

export type Assignee = {
  initials: string;
  color: string;
  avatarUrl?: string;
  name?: string;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  type: TaskType;
  estimate: number;
  assignees: Assignee[];
  emotionTag?: EmotionTag;
  issueDetails?: string;
};

export type TaskModalMode = "create" | "view" | "edit";
