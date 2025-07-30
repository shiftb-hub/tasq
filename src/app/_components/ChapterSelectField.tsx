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
              field.onChange(value === "none" ? null : Number(value))
            }
            onOpenChange={(open) => {
              if (!open) field.onBlur();
            }}
            value={field.value !== null ? field.value?.toString() : "none"}
            disabled={disabled}
            name={field.name}
          >
            <SelectTrigger className="w-full" id={field.name}>
              <SelectValue>
                {field.value === null ? "（なし）" : ChapterTitles[field.value]}
              </SelectValue>
            </SelectTrigger>
            <SelectContent id={fieldKey}>
              {Object.keys(ChapterTitles).map((key) => {
                const chapterNum = Number(key) as keyof typeof ChapterTitles;
                return (
                  <SelectItem key={chapterNum} value={chapterNum.toString()}>
                    {ChapterTitles[chapterNum]}
                  </SelectItem>
                );
              })}
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
