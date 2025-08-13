"use client";

import React from "react";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Search } from "lucide-react";

type Props = {
  totalTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  onSearch?: (query: string) => void;
  onAddTask?: () => void;
};

const TaskBoardHeader: React.FC<Props> = ({
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
          <Input
            type="text"
            placeholder="タスクを検索..."
            className="w-40 pl-10 sm:w-64"
            onChange={(e) => onSearch?.(e.target.value)}
          />
          <Search className="absolute top-2 left-3 h-5 w-5 text-gray-400" />
        </div>

        {/* Add Task Button */}
        {onAddTask && (
          <Button
            onClick={onAddTask}
            size="default"
            className="bg-blue-500 whitespace-nowrap transition-colors hover:bg-blue-600"
          >
            タスクを追加
          </Button>
        )}
      </div>
    </div>
  );
};

export default TaskBoardHeader;
