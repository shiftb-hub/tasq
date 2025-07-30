"use client";

import React, { memo } from "react";
import { useFormContext, Controller } from "react-hook-form";
import type { FieldPath, FieldValues } from "react-hook-form";

import { Label } from "@/app/_components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";

import { ChapterTitles } from "@/app/_constants/ChapterTitles";
import { FormErrorMessage } from "@/app/_components/FormErrorMessage";

type Props<T extends FieldValues> = {
  labelText: string;
  fieldKey: FieldPath<T>;
  disabled: boolean;
};

const ChapterSelectFieldInner = <T extends FieldValues>({
  labelText,
  fieldKey,
  disabled,
}: Props<T>) => {
  const { control, formState } = useFormContext<T>();
  const errMsg = formState.errors[fieldKey]?.message as string | undefined;
  return (
    <Controller
      control={control}
      name={fieldKey}
      render={({ field }) => (
        <div className="flex flex-col gap-y-1.5">
          <Label htmlFor={field.name}>{labelText}</Label>
          <Select
            onValueChange={(value) =>
              field.onChange(value === "none" ? undefined : Number(value))
            }
            onOpenChange={(open) => {
              if (!open) field.onBlur();
            }}
            value={field.value !== undefined ? field.value?.toString() : "none"}
            disabled={disabled}
            name={field.name}
          >
            <SelectTrigger className="w-full" id={field.name}>
              <SelectValue placeholder="（なし）" />
            </SelectTrigger>
            <SelectContent id={fieldKey}>
              {Array.from({ length: 13 }, (_, i) => i + 1).map((chapterNum) => (
                <SelectItem key={chapterNum} value={chapterNum.toString()}>
                  {ChapterTitles[chapterNum as keyof typeof ChapterTitles]}
                </SelectItem>
              ))}
              <SelectItem value="none">（なし）</SelectItem>
            </SelectContent>
          </Select>
          <FormErrorMessage msg={errMsg} />
        </div>
      )}
    />
  );
};

const ChapterSelectField = memo(
  ChapterSelectFieldInner,
) as typeof ChapterSelectFieldInner;

export { ChapterSelectField };
