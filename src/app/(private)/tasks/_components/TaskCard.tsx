import React from "react";
import type { TaskCardProps } from "../_types/Tasks";
import Image from "next/image";

const TaskCard: React.FC<TaskCardProps> = ({
  title,
  priority,
  type,
  estimate,
  assignees,
  emotionTag,
  onClick,
}) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "bug":
        return "bg-yellow-50 text-yellow-600 border-yellow-200";
      case "frontend":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "backend":
        return "bg-red-50 text-red-600 border-red-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  return (
    <button
      type="button"
      className="flex cursor-pointer flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm"
      onClick={onClick}
    >
      {/* Card Header */}
      <div className="flex flex-col gap-2">
        {/* タイトル - 1行表示で溢れたら...表示 */}
        <h3
          className="truncate text-sm leading-tight font-semibold text-gray-800"
          title={title}
        >
          {title}
        </h3>

        {/* Tags Container */}
        <div className="flex items-center justify-between">
          {/* Priority & Task Type Tags Group */}
          <div className="flex items-center gap-2">
            {/* Priority Tag - High Priorityのみ表示 */}
            {priority === "High Priority" && (
              <span className="rounded-full border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-600">
                High Priority
              </span>
            )}

            {/* Task Type Tag */}
            <span
              className={`rounded-full border px-2 py-1 text-xs font-medium ${getTypeColor(type)}`}
            >
              {type}
            </span>
          </div>

          {/* Emotion Tag */}
          {emotionTag && (
            <span className="text-lg" role="img" aria-label="emotion">
              {emotionTag}
            </span>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="flex items-center justify-between">
        {/* Estimate */}
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-semibold text-white">
          {estimate}
        </div>

        {/* Assignees */}
        <div className="flex items-center -space-x-2">
          {assignees.map((assignee, index) => (
            <div
              key={index}
              className="relative flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-xs font-semibold"
              style={{
                backgroundColor: assignee.avatarUrl
                  ? "transparent"
                  : assignee.color,
                zIndex: assignees.length - index,
              }}
              title={assignee.name || assignee.initials}
            >
              {assignee.avatarUrl ? (
                <Image
                  src={assignee.avatarUrl}
                  alt={assignee.initials}
                  className="h-full w-full rounded-full object-cover"
                  width={28}
                  height={28}
                />
              ) : (
                <span className="text-white">{assignee.initials}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </button>
  );
};

export default TaskCard;
