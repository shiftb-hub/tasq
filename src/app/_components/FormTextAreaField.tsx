"use client";

import type { TextareaHTMLAttributes } from "react";
import type { FieldValues, Path } from "react-hook-form";

import React, { useState, useEffect, useCallback } from "react";
import { useFormContext, useFormState, useController, useWatch } from "react-hook-form";
import { LuSave, LuFileText } from "react-icons/lu";

import { Label } from "@/app/_components/ui/label";
import { Textarea } from "@/app/_components/ui/textarea";
import { Button } from "@/app/_components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/app/_components/ui/tooltip";
import { FormErrorMessage } from "@/app/_components/FormErrorMessage";

import { cn } from "@/app/_libs/utils";
import { getFieldErrorMessage } from "@/app/_libs/formUtils";

interface Props<T extends FieldValues> extends TextareaHTMLAttributes<HTMLTextAreaElement> {
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
  const { control } = useFormContext<T>();
  const { field } = useController<T, Path<T>>({
    control,
    name: fieldKey,
  });
  const { errors, isSubmitting } = useFormState({ control, name: fieldKey });
  const currentValue = useWatch({ control, name: fieldKey });

  const errMsg = getFieldErrorMessage(errors, fieldKey);

  // テンプレート機能の状態管理、テンプレート機能の有効性判定
  const [hasTemplate, setHasTemplate] = useState(false);
  const [dynamicPlaceholder, setDynamicPlaceholder] = useState<string>("");
  const enableTemplate = !!templateStorageKey;

  // フィールドの無効状態を設定
  // Props で disabled があれば、それを優先する。なければ isSubmitting を使用
  const isDisabled = disabled ?? isSubmitting;

  // プレースホルダーテキストの設定
  const finalPlaceholder = placeholder ?? dynamicPlaceholder;

  // 入力フィールドが変更されたときの処理
  // RHFのバリデーション発火と、Props に registerOnChange があればそれも発火
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      field.onChange(e);
      registerOnChange?.(e);
    },
    [field, registerOnChange],
  );

  // 入力フィールドからフォーカスアウトされたときの処理
  // RHFのバリデーション発火と、Props に registerOnBlur があればそれも発火
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLTextAreaElement>) => {
      field.onBlur();
      registerOnBlur?.(e);
    },
    [field, registerOnBlur],
  );

  // テンプレートの存在確認と動的プレースホルダーの設定
  useEffect(() => {
    if (!templateStorageKey) return;
    const template = localStorage.getItem(templateStorageKey);
    const hasValidTemplate = !!(template && template.trim());
    setHasTemplate(hasValidTemplate);

    if (placeholder === undefined) {
      setDynamicPlaceholder(hasValidTemplate ? template!.trim() : "未設定");
    }
  }, [placeholder, templateStorageKey]);

  // テンプレートの保存処理
  const handleSaveTemplate = useCallback(() => {
    if (typeof currentValue === "string" && templateStorageKey) {
      if (confirm("現在の内容をテンプレート文字列として保存しますか？")) {
        localStorage.setItem(templateStorageKey, currentValue.trim());
        setDynamicPlaceholder(currentValue.trim());
        setHasTemplate(true);
      }
    }
  }, [currentValue, templateStorageKey]);

  // テンプレートの読込み処理（現在値の末尾に追加）
  const handleLoadTemplate = useCallback(() => {
    if (!templateStorageKey) return;
    const value = localStorage.getItem(templateStorageKey)?.trim();
    if (!value) return;
    const parts = [value, currentValue ?? ""].filter(Boolean);
    field.onChange(parts.join("\n"));
  }, [templateStorageKey, currentValue, field]);

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
          name={field.name}
          ref={field.ref}
          value={typeof field.value === "string" ? field.value : ""}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={!!errMsg}
          placeholder={finalPlaceholder}
          disabled={isDisabled}
          className="pr-12"
          {...textareaProps}
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

export const FormTextAreaField = React.memo(FormTextAreaFieldComponent) as <T extends FieldValues>(
  props: Props<T>,
) => React.JSX.Element;
