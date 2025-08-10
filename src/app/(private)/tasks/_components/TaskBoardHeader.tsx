"use client";

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
          <p className="text-xl font-bold text-gray-900 sm:text-2xl">
            {totalTasks}
          </p>
          <p className="text-xs text-gray-500">Total Tasks</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-blue-600 sm:text-2xl">
            {inProgressTasks}
          </p>
          <p className="text-xs text-gray-500">In Progress</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-green-600 sm:text-2xl">
            {completedTasks}
          </p>
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
            className="w-40 rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none sm:w-64"
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
            className="rounded-lg bg-blue-500 px-3 py-2 text-sm whitespace-nowrap text-white transition-colors hover:bg-blue-600 sm:px-4 sm:text-base"
          >
            タスクを追加
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskBoardHeader;
