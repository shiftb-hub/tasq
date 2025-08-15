// React と ライブラリ
import React, { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";

// UIコンポーネント・アイコン
import { Button } from "@/app/_components/ui/button";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";

// 型定義・バリデーションスキーマ
import type { LearningLog } from "@/app/_types/LearningLog";

// ユーティリティ
import { cn } from "@/app/_libs/utils";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

interface RowHandlers {
  onEdit: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  disabled: boolean;
}

export const useLearningLogColumns = ({
  onEdit,
  onDelete,
  disabled,
}: RowHandlers): ColumnDef<LearningLog>[] => {
  return useMemo(
    () => [
      {
        accessorKey: "startedAt",
        header: () => <div className="text-center">日時</div>,
        cell: ({ row }) => {
          const date = row.original.startedAt;
          if (!date)
            return (
              <div className="text-muted-foreground text-center text-xs">
                未設定
              </div>
            );
          return (
            <div className="flex flex-col items-center">
              <div className="font-bold">
                {format(date, "MM/dd", { locale: ja })}
              </div>
              <div className="text-muted-foreground text-xs">
                {date.getFullYear()}
              </div>
            </div>
          );
        },
      },
      {
        id: "summary",
        header: () => <></>,
        cell: ({ row }) => {
          const title = row.original.title;
          const summary = row.original.description;
          return (
            <div
              className={cn(
                "flex flex-col items-start",
                disabled ? "hover:cursor-not-allowed" : "hover:cursor-pointer",
              )}
              onClick={() => {
                if (disabled) return;
                onEdit(row.original.id);
              }}
            >
              <div className="font-bold">{title}</div>
              <div className="text-muted-foreground line-clamp-2 text-xs whitespace-break-spaces">
                {summary}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "spentMinutes",
        header: () => (
          <div className="my-1.5 flex flex-col items-center justify-center md:flex-row">
            <div>学習</div>
            <div>時間</div>
          </div>
        ),
        cell: ({ row }) => {
          const spentMinutes = row.original.spentMinutes;
          if (spentMinutes === 0)
            return (
              <div className="text-muted-foreground text-center text-xs">
                &mdash;
              </div>
            );
          return (
            <div className="flex flex-col items-center">
              <div className="font-bold">{spentMinutes}</div>
              <div className="text-muted-foreground text-xs">min</div>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: () => <div className="items-center text-center">操作</div>,
        cell: ({ row }) => {
          const logId = row.original.id;
          return (
            <div className="flex flex-col items-center justify-center gap-1 md:flex-row md:gap-0.5">
              <Button
                variant="ghost"
                className="h-auto p-0 hover:bg-transparent"
                onClick={() => onEdit(logId)}
                disabled={disabled}
              >
                <div className="hover:opacity-50">
                  <FiEdit />
                </div>
              </Button>
              <Button
                variant="ghost"
                className="h-auto p-0 hover:bg-transparent"
                onClick={() => onDelete(logId)}
                disabled={disabled}
              >
                <div className="hover:opacity-50">
                  <RiDeleteBinLine />
                </div>
              </Button>
            </div>
          );
        },
      },
    ],
    [disabled, onEdit, onDelete],
  );
};
