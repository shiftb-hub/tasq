"use client";

import type { InputHTMLAttributes } from "react";
import type { FieldValues, Path, PathValue } from "react-hook-form";

import React, { useState, useEffect, useCallback } from "react";
import { useFormContext, useFormState, useController, useWatch } from "react-hook-form";
import { LuSave, LuFileText } from "react-icons/lu";

import { Label } from "@/app/_components/ui/label";
import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/app/_components/ui/tooltip";
import { FormErrorMessage } from "@/app/_components/FormErrorMessage";

import { cn } from "@/app/_libs/utils";
import { getFieldErrorMessage } from "@/app/_libs/formUtils";

interface Props<T extends FieldValues> extends InputHTMLAttributes<HTMLInputElement> {
  labelText: string;
  fieldKey: Path<T>;
  exampleText?: string;
  placeholder?: string;
  containerStyles?: string;
  registerOnChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  registerOnBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  templateStorageKey?: string;
}

const FormTextFieldComponent = <T extends FieldValues>({
  labelText,
  fieldKey,
  exampleText,
  containerStyles,
  placeholder,
  registerOnChange,
  registerOnBlur,
  disabled,
  templateStorageKey,
  ...inputProps
}: Props<T>) => {
  const { control, setValue } = useFormContext<T>();
  const { field } = useController<T, Path<T>>({
    control,
    name: fieldKey,
  });
  const { errors, isSubmitting } = useFormState({ control, name: fieldKey });
  const currentValue = useWatch({ control, name: fieldKey });
  const inputType = inputProps.type ?? "text";

  const errMsg = getFieldErrorMessage(errors, fieldKey);

  // 制御系キーを除外して先にスプレッドするために分離
  const {
    onChange: _onChange,
    onBlur: _onBlur,
    value: _value,
    defaultValue: _defaultValue,
    ...restInputProps
  } = inputProps;

  // テンプレート機能の状態管理、テンプレート機能の有効性判定
  const [hasTemplate, setHasTemplate] = useState(false);
  const [dynamicPlaceholder, setDynamicPlaceholder] = useState<string>("");
  const enableTemplate = !!templateStorageKey;

  // フィールドの無効状態の設定
  // Props で disabled があれば、それを優先する。なければ isSubmitting を使用
  const isDisabled = disabled ?? isSubmitting;

  // プレースホルダーテキストの設定
  const finalPlaceholder = placeholder ?? dynamicPlaceholder;

  // 入力フィールドが変更されたときの処理
  //  - number のときは "" を許容し、入力中は文字列のまま RHF に渡す（全消しを安定させる）
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (inputType === "number") {
        field.onChange(e.target.value as unknown as PathValue<T, Path<T>>);
      } else {
        field.onChange(e);
      }
      registerOnChange?.(e);
    },
    [field, registerOnChange, inputType],
  );

  // 入力フィールドが変更されたときの処理
  //  - number のときは "" を許容し、入力中は文字列のまま RHF に渡す（全消しを安定させる）
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
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
    if (inputType !== "text") return;
    if (typeof currentValue === "string" && templateStorageKey) {
      if (confirm("現在の内容をテンプレート文字列として保存しますか？")) {
        localStorage.setItem(templateStorageKey, currentValue.trim());
        setDynamicPlaceholder(currentValue.trim());
        setHasTemplate(true);
      }
    }
  }, [currentValue, inputType, templateStorageKey]);

  // テンプレートの読込み処理
  const handleLoadTemplate = useCallback(() => {
    if (inputType !== "text") return;
    // テンプレート保存キーが無効な場合は何もしない
    if (!templateStorageKey) return;
    const value = localStorage.getItem(templateStorageKey)?.trim();
    if (!value) return; // テンプレートが空の場合は何もしない
    const parts = [value, currentValue ?? ""].filter(Boolean);
    setValue(fieldKey, parts.join(" ") as PathValue<T, Path<T>>, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  }, [inputType, templateStorageKey, currentValue, setValue, fieldKey]);

  // Input要素用の値正規化
  // なぜ: HTML input要素はstring/numberのみ受け付けるため、他の型は空文字に変換して型安全性を確保するため
  const inputValue: string | number =
    typeof field.value === "string" || typeof field.value === "number" ? field.value : "";

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
        <Input
          {...restInputProps}
          id={fieldKey}
          name={field.name}
          ref={field.ref}
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={!!errMsg}
          placeholder={finalPlaceholder}
          disabled={isDisabled}
        />

        {enableTemplate && (
          <div className="absolute top-1/2 right-2 flex -translate-y-1/2">
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

FormTextFieldComponent.displayName = "FormTextField";

export const FormTextField = React.memo(FormTextFieldComponent) as <T extends FieldValues>(
  props: Props<T>,
) => React.JSX.Element;
