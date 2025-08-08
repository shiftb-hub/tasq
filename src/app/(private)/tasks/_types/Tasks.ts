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

export type TaskColumnProps = {
  title: string;
  tasks: Task[];
  onAddTask?: () => void;
  onTaskClick?: (task: Task) => void;
};

export type TaskCardProps = {
  title: string;
  priority: TaskPriority;
  type: TaskType;
  estimate: number;
  assignees: Assignee[];
  emotionTag?: EmotionTag;
  onClick?: () => void;
};

export type TaskBoardHeaderProps = {
  totalTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  onSearch?: (query: string) => void;
  onAddTask?: () => void;
};

export type TaskModalMode = "create" | "view" | "edit";

export type TaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode: TaskModalMode;
  task?: Task;
  columnTitle?: string;
  onSave?: (task: Omit<Task, "id">) => void;
  onUpdate?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
};
