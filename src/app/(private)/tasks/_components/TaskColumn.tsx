import React from "react";
import TaskCard from "./TaskCard";
import type { TaskColumnProps } from "../_types/Tasks";

const TaskColumn: React.FC<TaskColumnProps> = ({ title, tasks, onAddTask, onTaskClick }) => {
  // estimate の合計を計算
  const totalEstimate = tasks.reduce((sum, task) => sum + task.estimate, 0);

  return (
    <div className="flex h-full w-80 flex-col">
      {/* Column Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-500">
            {tasks.length} tasks / {totalEstimate} points
          </p>
        </div>
        {onAddTask && (
          <button
            onClick={onAddTask}
            className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500 text-white transition-colors hover:bg-blue-600"
            aria-label="タスクを追加"
          >
            <span className="text-xl leading-none">+</span>
          </button>
        )}
      </div>

      {/* Tasks - スクロール可能なコンテナ */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-3 pb-4">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              title={task.title}
              priority={task.priority}
              type={task.type}
              estimate={task.estimate}
              assignees={task.assignees}
              emotionTag={task.emotionTag}
              onClick={() => onTaskClick?.(task)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskColumn;
