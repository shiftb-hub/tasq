"use client";

import React, { useState } from "react";
import TaskBoardHeader from "./_components/TaskBoardHeader";
import TaskColumn from "./_components/TaskColumn";
import TaskModal from "./_components/TaskModal";
import type { Task, TaskModalMode } from "./_types/Tasks";

const TaskBoardPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: TaskModalMode;
    task?: Task;
    columnTitle?: string;
  }>({
    isOpen: false,
    mode: "create",
  });

  // サンプルデータ（スクロール確認用に追加データを含む）
  const sampleTasks: { [key: string]: Task[] } = {
    "To Do": [
      {
        id: "1",
        title:
          "Fix user authentication bug that prevents login when password contains special characters",
        priority: "High Priority",
        type: "bug",
        estimate: 1,
        assignees: [{ initials: "J", color: "#3B82F6", name: "John Doe" }],
        emotionTag: "😰",
      },
      {
        id: "2",
        title: "Implement user profile page with avatar upload functionality",
        priority: "Normal",
        type: "frontend",
        estimate: 2,
        assignees: [{ initials: "S", color: "#10B981", name: "Sarah Miller" }],
        emotionTag: "😊",
      },
      {
        id: "6",
        title: "Add dark mode support to the application",
        priority: "Normal",
        type: "frontend",
        estimate: 3,
        assignees: [{ initials: "M", color: "#8B5CF6", name: "Mike Johnson" }],
      },
      {
        id: "7",
        title: "Optimize database queries for better performance",
        priority: "High Priority",
        type: "backend",
        estimate: 5,
        assignees: [{ initials: "L", color: "#EC4899", name: "Lisa Chen" }],
        emotionTag: "😰",
      },
      {
        id: "8",
        title: "Write unit tests for authentication module",
        priority: "Normal",
        type: "backend",
        estimate: 4,
        assignees: [{ initials: "D", color: "#6366F1", name: "David Kim" }],
      },
      {
        id: "9",
        title: "Implement real-time notifications using WebSocket",
        priority: "Normal",
        type: "frontend",
        estimate: 6,
        assignees: [{ initials: "E", color: "#14B8A6", name: "Emma Wilson" }],
        emotionTag: "🥹",
      },
      {
        id: "10",
        title: "Create API documentation with Swagger",
        priority: "Normal",
        type: "backend",
        estimate: 3,
        assignees: [{ initials: "R", color: "#F97316", name: "Robert Taylor" }],
      },
      {
        id: "11",
        title: "Refactor legacy code in user management module",
        priority: "Normal",
        type: "backend",
        estimate: 8,
        assignees: [
          { initials: "C", color: "#84CC16", name: "Chris Anderson" },
        ],
      },
    ],
    "In Progress": [
      {
        id: "3",
        title: "Update database schema for new user preferences table",
        priority: "High Priority",
        type: "backend",
        estimate: 3,
        assignees: [{ initials: "A", color: "#F59E0B", name: "Alex Brown" }],
        emotionTag: "🥹",
      },
      {
        id: "12",
        title: "Implement search functionality with Elasticsearch",
        priority: "Normal",
        type: "backend",
        estimate: 5,
        assignees: [{ initials: "N", color: "#06B6D4", name: "Nancy Davis" }],
      },
      {
        id: "13",
        title: "Design new landing page with responsive layout",
        priority: "Normal",
        type: "frontend",
        estimate: 4,
        assignees: [{ initials: "P", color: "#DC2626", name: "Paul Martinez" }],
        emotionTag: "😊",
      },
      {
        id: "14",
        title: "Add multi-language support (i18n)",
        priority: "Normal",
        type: "frontend",
        estimate: 6,
        assignees: [{ initials: "O", color: "#7C3AED", name: "Olivia Garcia" }],
      },
      {
        id: "15",
        title: "Implement data export functionality",
        priority: "High Priority",
        type: "backend",
        estimate: 4,
        assignees: [{ initials: "K", color: "#059669", name: "Kevin Lee" }],
      },
    ],
    Review: [
      {
        id: "4",
        title: "Code review for payment integration with Stripe API",
        priority: "Normal",
        type: "backend",
        estimate: 4,
        assignees: [
          { initials: "J", color: "#3B82F6", name: "John Doe" },
          { initials: "S", color: "#10B981", name: "Sarah Miller" },
        ],
      },
      {
        id: "16",
        title: "Review mobile app UI/UX improvements",
        priority: "Normal",
        type: "frontend",
        estimate: 2,
        assignees: [{ initials: "T", color: "#0891B2", name: "Tom Harris" }],
      },
      {
        id: "17",
        title: "Security audit for authentication system",
        priority: "High Priority",
        type: "backend",
        estimate: 5,
        assignees: [
          { initials: "V", color: "#BE185D", name: "Victoria Clark" },
        ],
        emotionTag: "😰",
      },
      {
        id: "18",
        title: "Performance testing for API endpoints",
        priority: "Normal",
        type: "backend",
        estimate: 3,
        assignees: [{ initials: "W", color: "#CA8A04", name: "William White" }],
      },
    ],
    Done: [
      {
        id: "5",
        title: "Setup CI/CD pipeline with GitHub Actions",
        priority: "Normal",
        type: "backend",
        estimate: 14,
        assignees: [{ initials: "A", color: "#F59E0B", name: "Alex Brown" }],
      },
      {
        id: "19",
        title: "Migrate from MongoDB to PostgreSQL",
        priority: "High Priority",
        type: "backend",
        estimate: 8,
        assignees: [{ initials: "Z", color: "#16A34A", name: "Zoe Robinson" }],
      },
      {
        id: "20",
        title: "Implement user role management system",
        priority: "Normal",
        type: "backend",
        estimate: 6,
        assignees: [{ initials: "Y", color: "#9333EA", name: "Yuki Tanaka" }],
      },
      {
        id: "21",
        title: "Create dashboard analytics page",
        priority: "Normal",
        type: "frontend",
        estimate: 5,
        assignees: [{ initials: "X", color: "#E11D48", name: "Xavier Lopez" }],
        emotionTag: "😊",
      },
      {
        id: "22",
        title: "Setup error tracking with Sentry",
        priority: "Normal",
        type: "backend",
        estimate: 2,
        assignees: [{ initials: "U", color: "#0EA5E9", name: "Uma Patel" }],
      },
    ],
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilter = (filter: string) => {
    setFilterValue(filter);
  };

  const handleAddTask = (columnTitle?: string) => {
    setModalState({
      isOpen: true,
      mode: "create",
      columnTitle,
    });
  };

  const handleTaskClick = (task: Task) => {
    setModalState({
      isOpen: true,
      mode: "view",
      task,
    });
  };

  const handleModalClose = () => {
    setModalState({
      ...modalState,
      isOpen: false,
    });
  };

  const handleTaskSave = (newTask: Omit<Task, "id">) => {
    console.log("Save new task:", newTask);
    // ここで実際のタスク保存ロジックを実装
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    console.log("Update task:", updatedTask);
    // ここで実際のタスク更新ロジックを実装
  };

  const handleTaskDelete = (taskId: string) => {
    console.log("Delete task:", taskId);
    // ここで実際のタスク削除ロジックを実装
  };

  // タスク数の計算
  const totalTasks = Object.values(sampleTasks).reduce(
    (total, tasks) => total + tasks.length,
    0,
  );
  const inProgressTasks = sampleTasks["In Progress"]?.length || 0;
  const completedTasks = sampleTasks["Done"]?.length || 0;

  return (
    <div className="flex h-screen flex-col bg-gray-100">
      {/* Fixed Header Container */}
      <div className="flex-shrink-0">
        <div className="sticky top-0 z-30 border-b border-gray-200 bg-gray-100 shadow-sm">
          <div className="px-4 pt-4 pb-2">
            <TaskBoardHeader
              totalTasks={totalTasks}
              inProgressTasks={inProgressTasks}
              completedTasks={completedTasks}
              onSearch={handleSearch}
              onAddTask={handleAddTask}
            />
          </div>
        </div>
      </div>

      {/* Scrollable Task Board Container */}
      <div className="h-full flex-1 overflow-x-auto overflow-y-hidden px-4 py-4">
        <div className="flex h-full gap-6">
          {Object.entries(sampleTasks).map(([columnTitle, tasks]) => (
            <TaskColumn
              key={columnTitle}
              title={columnTitle}
              tasks={tasks}
              onAddTask={() => handleAddTask(columnTitle)}
              onTaskClick={handleTaskClick}
            />
          ))}
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={modalState.isOpen}
        onClose={handleModalClose}
        mode={modalState.mode}
        task={modalState.task}
        columnTitle={modalState.columnTitle}
        onSave={handleTaskSave}
        onUpdate={handleTaskUpdate}
        onDelete={handleTaskDelete}
      />
    </div>
  );
};

export default TaskBoardPage;
