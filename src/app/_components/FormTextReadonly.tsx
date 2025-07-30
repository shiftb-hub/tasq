"use client";

import type { HTMLAttributes } from "react";

import { Label } from "@/app/_components/ui/label";
import { Input } from "@/app/_components/ui/input";

import { twMerge } from "tailwind-merge";

interface Props extends HTMLAttributes<HTMLDivElement> {
  labelText: string;
  fieldKey: string;
  value: string | undefined;
  containerStyles?: string;
}

// レンダリングコストが小さいため memo は省略
export const FormTextReadonly = ({
  labelText,
  fieldKey,
  value,
  containerStyles,
  ...inputProps
}: Props) => {
  return (
    <div className={twMerge("flex flex-col gap-y-1.5", containerStyles)}>
      <Label htmlFor={fieldKey}>{labelText}</Label>
      <Input
        type="text"
        id={fieldKey}
        value={value ?? ""}
        readOnly
        className="bg-slate-50"
        autoComplete="off"
        {...inputProps}
      />
    </div>
  );
};
