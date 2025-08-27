"use client";

import type { JSX, TextareaHTMLAttributes } from "react";
import type { FieldValues, Path, PathValue } from "react-hook-form";

import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { LuSave, LuFileText } from "react-icons/lu";

import { Label } from "@/app/_components/ui/label";
import { Textarea } from "@/app/_components/ui/textarea";
import { Button } from "@/app/_components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/_components/ui/tooltip";
import { FormErrorMessage } from "@/app/_components/FormErrorMessage";

import { cn } from "@/app/_libs/utils";

interface Props<T extends FieldValues>
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  labelText: string;
  fieldKey: Path<T>;
  exampleText?: string;
  placeholder?: string;
  containerStyles?: string;
  registerOnChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  registerOnBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  templateStorageKey?: string;
}

const FormTextAreaFieldComponent = <T extends FieldValues>({
  labelText,
  fieldKey,
  exampleText,
  containerStyles,
  placeholder,
  registerOnChange,
  registerOnBlur,
  disabled,
  templateStorageKey,
  ...textareaProps
}: Props<T>) => {
  const { register, formState, watch, setValue } = useFormContext<T>();
  const errMsg = formState.errors[fieldKey]?.message as string | undefined;

  const [hasTemplate, setHasTemplate] = useState(false);
  const [dynamicPlaceholder, setDynamicPlaceholder] =
    useState<string>("未設定");
  const currentValue = watch(fieldKey);

  const enableTemplate = !!templateStorageKey;
  const isDisabled = disabled ?? formState.isSubmitting;

  // テンプレートの有無をチェック
  useEffect(() => {
    if (!enableTemplate || !templateStorageKey) return;

    const template = localStorage.getItem(templateStorageKey);
    const hasTemplateValue = !!(template && template.trim());
    setHasTemplate(hasTemplateValue);

    // Props の placeholder が undefined の場合のみ動的に設定
    if (placeholder === undefined) {
      setDynamicPlaceholder(hasTemplateValue ? template.trim() : "未設定");
    }
  }, [enableTemplate, templateStorageKey, placeholder]);

  const handleSaveTemplate = () => {
    if (typeof currentValue === "string" && templateStorageKey) {
      if (confirm("現在の内容をテンプレート文字列として保存しますか？")) {
        localStorage.setItem(templateStorageKey, currentValue.trim());
        setHasTemplate(true);
      }
    }
  };

  const handleLoadTemplate = () => {
    if (!templateStorageKey) return;
    if (typeof window === "undefined") return;
    const template = localStorage.getItem(templateStorageKey);
    if (template && template.trim()) {
      const newValue = template + (currentValue ? `\n${currentValue}` : "");
      setValue(fieldKey, newValue as PathValue<T, Path<T>>, {
        shouldValidate: true,
      });
    }
  };
  return (
    <div className={cn("flex flex-col gap-y-1.5", containerStyles)}>
      <div className="flex flex-row items-baseline justify-start gap-x-2">
        <Label htmlFor={fieldKey}>{labelText}</Label>
        {exampleText && (
          <p className="text-xs">
            <span className="text-gray-500">例：</span>
            <span className="text-blue-400">{exampleText}</span>
          </p>
        )}
      </div>
      <div className="relative">
        <Textarea
          id={fieldKey}
          aria-invalid={!!errMsg}
          placeholder={
            placeholder !== undefined ? placeholder : dynamicPlaceholder
          }
          disabled={isDisabled}
          {...textareaProps}
          {...register(fieldKey, {
            onChange: registerOnChange,
            onBlur: registerOnBlur,
          })}
        />
        {enableTemplate && (
          <div className="absolute top-2 right-2 flex">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-4 p-0"
                  onClick={handleSaveTemplate}
                  disabled={isDisabled || typeof currentValue !== "string"}
                >
                  <LuSave className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>現在の内容をテンプレート文字列として保存</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-4 p-0"
                  onClick={handleLoadTemplate}
                  disabled={isDisabled || !hasTemplate}
                >
                  <LuFileText className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>保存されているテンプレート文字列を挿入</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
      <FormErrorMessage msg={errMsg} />
    </div>
  );
};

FormTextAreaFieldComponent.displayName = "FormTextAreaField";

export const FormTextAreaField = React.memo(FormTextAreaFieldComponent) as <
  T extends FieldValues,
>(
  props: Props<T>,
) => JSX.Element;
