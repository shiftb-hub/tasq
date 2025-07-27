"use client";

import type { InputHTMLAttributes } from "react";
import type { FieldErrors, FieldValues } from "react-hook-form";

import { Label } from "@/app/_components/ui/label";
import { Input } from "@/app/_components/ui/input";
import { FormErrorMessage } from "@/app/_components/FormErrorMessage";

import { twMerge } from "tailwind-merge";

interface Props<T extends FieldValues>
  extends InputHTMLAttributes<HTMLInputElement> {
  labelText: string;
  fieldKey: string;
  validationErrors: FieldErrors<T>;
  containerStyles?: string;
}

export const FormTextField = <T extends FieldValues>({
  labelText,
  fieldKey,
  validationErrors,
  containerStyles,
  ...inputProps
}: Props<T>) => {
  const errMsg = validationErrors[fieldKey]?.message?.toString();
  return (
    <div className={twMerge("flex flex-col gap-y-1.5", containerStyles)}>
      <Label htmlFor={fieldKey}>{labelText}</Label>
      <Input
        type="text"
        {...inputProps}
        id={fieldKey}
        aria-invalid={!!errMsg}
      />
      <FormErrorMessage msg={errMsg} />
    </div>
  );
};
