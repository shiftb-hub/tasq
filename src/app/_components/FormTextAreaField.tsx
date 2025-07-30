"use client";

import type { TextareaHTMLAttributes } from "react";
import type { FieldValues, Path } from "react-hook-form";

import { useFormContext } from "react-hook-form";

import { Label } from "@/app/_components/ui/label";
import { Textarea } from "@/app/_components/ui/textarea";
import { FormErrorMessage } from "@/app/_components/FormErrorMessage";

import { twMerge } from "tailwind-merge";

interface Props<T extends FieldValues>
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  labelText: string;
  fieldKey: Path<T>;
  exampleText?: string;
  placeholder?: string;
  containerStyles?: string;
  registerOnChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  registerOnBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
}

// レンダリングコストが小さいため memo は省略
export const FormTextareaField = <T extends FieldValues>({
  labelText,
  fieldKey,
  exampleText,
  containerStyles,
  placeholder = "未設定",
  registerOnChange,
  registerOnBlur,
  ...textareaProps
}: Props<T>) => {
  const { register, formState } = useFormContext<T>();
  const errMsg = formState.errors[fieldKey]?.message as string | undefined;
  return (
    <div className={twMerge("flex flex-col gap-y-1.5", containerStyles)}>
      <div className="flex flex-row items-baseline justify-start gap-x-2">
        <Label htmlFor={fieldKey}>{labelText}</Label>
        {exampleText && (
          <p className="text-xs">
            <span className="text-gray-500">例：</span>
            <span className="text-blue-400">{exampleText}</span>
          </p>
        )}
      </div>
      <Textarea
        id={fieldKey}
        aria-invalid={!!errMsg}
        placeholder={placeholder}
        {...register(fieldKey, {
          onChange: registerOnChange,
          onBlur: registerOnBlur,
        })}
        {...textareaProps}
      />
      <FormErrorMessage msg={errMsg} />
    </div>
  );
};
