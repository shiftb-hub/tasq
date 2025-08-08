"use client";

import React, { useState, useEffect } from "react";
import { Pencil, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/app/_components/ui/dialog";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { Textarea } from "@/app/_components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { cn } from "@/app/_libs/utils";
import type {
  TaskModalProps,
  Task,
  TaskPriority,
  TaskType,
  EmotionTag,
  Assignee,
} from "../_types/Tasks";

// サンプルのアサイニー（実際のアプリではAPIから取得、TAや講師の情報を表示）
const availableAssignees: Assignee[] = [
  { initials: "J", color: "#3B82F6", name: "John Doe" },
  { initials: "S", color: "#10B981", name: "Sarah Miller" },
  { initials: "A", color: "#F59E0B", name: "Alex Brown" },
  { initials: "M", color: "#8B5CF6", name: "Mike Johnson" },
  { initials: "L", color: "#EC4899", name: "Lisa Chen" },
  { initials: "D", color: "#6366F1", name: "David Kim" },
];

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  mode,
  task,
  columnTitle,
  onSave,
  onUpdate,
  onDelete,
}) => {
  const [isEditMode, setIsEditMode] = useState(mode === "edit");
  const [formData, setFormData] = useState<Omit<Task, "id">>({
    title: "",
    description: "",
    priority: "Normal",
    type: "frontend",
    estimate: 1,
    assignees: [],
    emotionTag: undefined,
    issueDetails: "",
  });

  useEffect(() => {
    if (task && (mode === "view" || mode === "edit")) {
      setFormData({
        title: task.title,
        description: task.description || "",
        priority: task.priority,
        type: task.type,
        estimate: task.estimate,
        assignees: task.assignees,
        emotionTag: task.emotionTag,
        issueDetails: task.issueDetails || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        priority: "Normal",
        type: "frontend",
        estimate: 1,
        assignees: [],
        emotionTag: undefined,
        issueDetails: "",
      });
    }
    setIsEditMode(mode === "edit");
  }, [task, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode && task && onUpdate) {
      onUpdate({ ...task, ...formData });
    } else if (mode === "create" && onSave) {
      onSave(formData);
    }
    onClose();
  };

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const getModalTitle = () => {
    if (mode === "create") {
      return columnTitle
        ? `${columnTitle}に新しいタスクを追加`
        : "新しいタスクを追加";
    }
    if (isEditMode) {
      return "タスクを編集";
    }
    return "タスクの詳細";
  };

  // タスクカードと同じスタイルのバッジを取得
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

  const getTypeLabel = (type: TaskType) => {
    switch (type) {
      case "bug":
        return "バグ";
      case "frontend":
        return "フロントエンド";
      case "backend":
        return "バックエンド";
      default:
        return type;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{getModalTitle()}</DialogTitle>
            <div className="flex items-center gap-2">
              {mode === "view" && !isEditMode && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleEditClick}
                  className="h-10 w-10"
                >
                  <Pencil className="h-5 w-5" />
                </Button>
              )}
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <X className="h-5 w-5" />
                  <span className="sr-only">閉じる</span>
                </Button>
              </DialogClose>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* タイトル */}
          <div className="space-y-2">
            <Label htmlFor="title">タイトル</Label>
            {isEditMode || mode === "create" ? (
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="タスクのタイトルを入力..."
                required
              />
            ) : (
              <p className="text-sm">{formData.title}</p>
            )}
          </div>

          {/* タスク詳細 */}
          <div className="space-y-2">
            <Label htmlFor="description">タスク詳細</Label>
            {isEditMode || mode === "create" ? (
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="タスクの詳細な説明を入力..."
                className="min-h-[100px]"
              />
            ) : (
              <p className="text-sm whitespace-pre-wrap">
                {formData.description || "詳細なし"}
              </p>
            )}
          </div>

          {/* ステータス（バッジ表示または編集フォーム） */}
          {isEditMode || mode === "create" ? (
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">優先度</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      priority: value as TaskPriority,
                    })
                  }
                >
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High Priority">高優先度</SelectItem>
                    <SelectItem value="Normal">通常</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">タイプ</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value as TaskType })
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bug">バグ</SelectItem>
                    <SelectItem value="frontend">フロントエンド</SelectItem>
                    <SelectItem value="backend">バックエンド</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimate">見積もり（pt）</Label>
                <Input
                  id="estimate"
                  type="number"
                  min="1"
                  value={formData.estimate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estimate: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              {/* Priority */}
              {formData.priority === "High Priority" && (
                <span className="rounded-full border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-600">
                  High Priority
                </span>
              )}

              {/* Type */}
              <span
                className={cn(
                  "rounded-full border px-2 py-1 text-xs font-medium",
                  getTypeColor(formData.type),
                )}
              >
                {getTypeLabel(formData.type)}
              </span>

              {/* Estimate */}
              <span className="flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600">
                {formData.estimate}
                <span className="text-gray-400">pt</span>
              </span>
            </div>
          )}

          {/* 担当者(TA・講師がタスクを作成・編集する時のみ表示する予定 ) */}
          <div className="space-y-2">
            <Label>担当者(TA・講師)</Label>
            {isEditMode || mode === "create" ? (
              <div className="flex flex-wrap gap-2">
                {availableAssignees.map((assignee) => {
                  const isSelected = formData.assignees.some(
                    (a) => a.initials === assignee.initials,
                  );
                  return (
                    <button
                      key={assignee.initials}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setFormData({
                            ...formData,
                            assignees: formData.assignees.filter(
                              (a) => a.initials !== assignee.initials,
                            ),
                          });
                        } else {
                          setFormData({
                            ...formData,
                            assignees: [...formData.assignees, assignee],
                          });
                        }
                      }}
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-all",
                        isSelected
                          ? "ring-2 ring-blue-500 ring-offset-2"
                          : "opacity-50 hover:opacity-100",
                      )}
                      style={{ backgroundColor: assignee.color }}
                    >
                      <span className="text-white">{assignee.initials}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex gap-2">
                {formData.assignees.map((assignee) => (
                  <div
                    key={assignee.initials}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium"
                    style={{ backgroundColor: assignee.color }}
                  >
                    <span className="text-white">{assignee.initials}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 感情タグ */}
          <div className="space-y-2">
            <Label>感情タグ</Label>
            {isEditMode || mode === "create" ? (
              <div className="flex gap-2">
                {(["😊", "😰", "🥹"] as EmotionTag[]).map((emotion) => (
                  <button
                    key={emotion}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        emotionTag:
                          formData.emotionTag === emotion ? undefined : emotion,
                      })
                    }
                    className={cn(
                      "text-2xl transition-all",
                      formData.emotionTag === emotion
                        ? "scale-125 opacity-100"
                        : "opacity-50 hover:opacity-100",
                    )}
                  >
                    {emotion}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-2xl">{formData.emotionTag || "なし"}</p>
            )}
          </div>

          {/* 詰まったところ */}
          {(formData.emotionTag || isEditMode || mode === "create") && (
            <div className="space-y-2">
              <Label htmlFor="issueDetails">
                具体的に詰まったところ・わからないところ
              </Label>
              {isEditMode || mode === "create" ? (
                <Textarea
                  id="issueDetails"
                  value={formData.issueDetails}
                  onChange={(e) =>
                    setFormData({ ...formData, issueDetails: e.target.value })
                  }
                  placeholder="どこで詰まっているか、何がわからないかを詳しく記入..."
                  className="min-h-[80px]"
                />
              ) : (
                <p className="text-sm whitespace-pre-wrap">
                  {formData.issueDetails || "記載なし"}
                </p>
              )}
            </div>
          )}

          <DialogFooter>
            {isEditMode || mode === "create" ? (
              <>
                <Button type="button" variant="outline" onClick={onClose}>
                  キャンセル
                </Button>
                <Button type="submit">保存</Button>
              </>
            ) : (
              <Button type="button" onClick={onClose}>
                閉じる
              </Button>
            )}
            {isEditMode && task && onDelete && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  if (confirm("このタスクを削除してもよろしいですか？")) {
                    onDelete(task.id);
                    onClose();
                  }
                }}
              >
                削除
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;
