"use client";

import type { InputHTMLAttributes } from "react";
import type { FieldValues, Path } from "react-hook-form";

import { useFormContext } from "react-hook-form";

import { Label } from "@/app/_components/ui/label";
import { Input } from "@/app/_components/ui/input";
import { FormErrorMessage } from "@/app/_components/FormErrorMessage";

import { twMerge } from "tailwind-merge";

interface Props<T extends FieldValues>
  extends InputHTMLAttributes<HTMLInputElement> {
  labelText: string;
  fieldKey: Path<T>;
  exampleText?: string;
  placeholder?: string;
  containerStyles?: string;
  registerOnChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  registerOnBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

// レンダリングコストが小さいため memo は省略
export const FormTextField = <T extends FieldValues>({
  labelText,
  fieldKey,
  exampleText,
  containerStyles,
  placeholder = "未設定",
  registerOnChange,
  registerOnBlur,
  ...inputProps
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
      <Input
        type="text"
        id={fieldKey}
        aria-invalid={!!errMsg}
        placeholder={placeholder}
        // 送信中 (isSubmitting === true) はコンポーネントを無効化
        // 後続の {...inputProps} で disabled が指定されていれば、そちらで上書きされる
        disabled={formState.isSubmitting}
        {...register(fieldKey, {
          onChange: registerOnChange,
          onBlur: registerOnBlur,
        })}
        {...inputProps}
      />
      <FormErrorMessage msg={errMsg} />
    </div>
  );
};
