"use client";

import React from "react";
import { Button } from "@/app/_components/ui/button";
import { FormTextField } from "@/app/_components/FormTextField";
import { FormTextAreaField } from "@/app/_components/FormTextAreaField";
import { FormDateTimeField } from "@/app/_components/FormDateTimeField";
import { FormErrorMessage } from "@/app/_components/FormErrorMessage";
import { cn } from "@/app/_libs/utils";

const c_Title = "title" as const;
const c_Description = "description" as const;
const c_Reflections = "reflections" as const;
const c_SpentMinutes = "spentMinutes" as const;
const c_StartedAt = "startedAt" as const;
const c_EndedAt = "endedAt" as const;

type Props = {
  onSubmit: (e: React.FormEvent) => void;
  disabled: boolean;
  submitButtonText: string;
  errorMessage?: string;
};

export const LearningLogEditForm: React.FC<Props> = React.memo(
  ({ onSubmit, disabled, submitButtonText, errorMessage }) => {
    return (
      <form
        onSubmit={onSubmit}
        className={cn("space-y-4", disabled && "cursor-not-allowed opacity-50")}
      >
        <FormTextField
          fieldKey={c_Title}
          labelText="タイトル"
          exampleText=" 【23日目】 第6章の学習"
          disabled={disabled}
          templateStorageKey="learningLog_template_title"
        />
        <FormTextAreaField
          fieldKey={c_Description}
          labelText="取り組みの内容"
          disabled={disabled}
          templateStorageKey="learningLog_template_description"
        />
        <FormTextAreaField
          fieldKey={c_Reflections}
          labelText="学び・気づき・感想"
          disabled={disabled}
          templateStorageKey="learningLog_template_reflections"
        />
        {/* TODO:　別ブランチで、ここにタスクの紐付けコンポーネントを実装 */}
        <FormTextField
          fieldKey={c_SpentMinutes}
          labelText="学習時間（分）"
          type="number"
          min="1"
          max="6000"
          disabled={disabled}
        />
        <FormDateTimeField
          fieldKey={c_StartedAt}
          labelText="開始日時"
          disabled={disabled}
        />
        <FormDateTimeField
          fieldKey={c_EndedAt}
          labelText="終了日時"
          disabled={disabled}
        />
        <Button type="submit" className="w-full" disabled={disabled}>
          {submitButtonText}
        </Button>
        <FormErrorMessage msg={errorMessage} />
      </form>
    );
  },
);

LearningLogEditForm.displayName = "LearningLogEditForm";
