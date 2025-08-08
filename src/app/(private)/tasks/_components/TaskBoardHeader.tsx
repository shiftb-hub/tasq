import React from "react";
import type { TaskBoardHeaderProps } from "../_types/Tasks";

const TaskBoardHeader: React.FC<TaskBoardHeaderProps> = ({
  totalTasks,
  inProgressTasks,
  completedTasks,
  onSearch,
  onAddTask,
}) => {
  return (
    <div className="flex items-center justify-between gap-4">
      {/* Task Statistics */}
      <div className="flex gap-4 sm:gap-8">
        <div className="text-center">
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{totalTasks}</p>
          <p className="text-xs text-gray-500">Total Tasks</p>
        </div>
        <div className="text-center">
          <p className="text-xl sm:text-2xl font-bold text-blue-600">{inProgressTasks}</p>
          <p className="text-xs text-gray-500">In Progress</p>
        </div>
        <div className="text-center">
          <p className="text-xl sm:text-2xl font-bold text-green-600">{completedTasks}</p>
          <p className="text-xs text-gray-500">Completed</p>
        </div>
      </div>

      {/* Search and Add Task */}
      <div className="flex gap-2 sm:gap-4">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="タスクを検索..."
            className="w-40 sm:w-64 rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
            onChange={(e) => onSearch?.(e.target.value)}
          />
          <svg
            className="absolute top-2.5 left-3 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Add Task Button */}
        {onAddTask && (
          <button
            onClick={onAddTask}
            className="whitespace-nowrap rounded-lg bg-blue-500 px-3 sm:px-4 py-2 text-sm sm:text-base text-white transition-colors hover:bg-blue-600"
          >
            タスクを追加
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskBoardHeader;
