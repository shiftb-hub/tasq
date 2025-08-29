"use client";

// React と フォームライブラリ
import { useFormContext } from "react-hook-form";
import type { FieldValues, Path, PathValue } from "react-hook-form";

import { useMemo, useCallback } from "react";

// UIコンポーネント・アイコン
import { Label } from "@/app/_components/ui/label";
import { Button } from "@/app/_components/ui/button";
import { Calendar } from "@/app/_components/ui/calendar";
// prettier-ignore
import { FormControl, FormField, FormItem, FormLabel } from "@/app/_components/ui/form";
// prettier-ignore
import { Popover, PopoverContent, PopoverTrigger } from "@/app/_components/ui/popover";
// prettier-ignore
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/app/_components/ui/select";
import { CalendarIcon } from "lucide-react";
import { IoMdCloseCircle } from "react-icons/io";
import { FormErrorMessage } from "@/app/_components/FormErrorMessage";

// ユーティリティ
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { cn } from "@/app/_libs/utils";

// 時刻関連のヘルパー関数
const isTimeUnset = (date: Date): boolean => {
  return (
    date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 1
  );
};

const setTimeUnset = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 1, 0); // 時, 分, 秒, ミリ秒
  return newDate;
};

const setTimeToDate = (date: Date, timeString: string): Date => {
  const newDate = new Date(date);
  if (timeString === "unset") {
    return setTimeUnset(newDate);
  }

  // 入力値を検証
  const trimmed = timeString.trim();
  const parts = trimmed.split(":");
  if (parts.length !== 2) {
    console.error("Invalid timeString format:", timeString);
    // 不正な場合はデフォルト値（0:00）で返す
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  }
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    console.error("Invalid timeString values:", timeString);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  }
  newDate.setHours(hours, minutes, 0, 0); // 秒とミリ秒は0にリセット
  return newDate;
};

const getTimeString = (date: Date): string => {
  if (isTimeUnset(date)) {
    return "unset";
  }
  return format(date, "HH:mm");
};

// 時刻選択肢を生成（15分刻み）
const generateTimeOptions = (): Array<{ value: string; label: string }> => {
  const options = [{ value: "unset", label: "未設定" }];

  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      options.push({ value: timeString, label: timeString });
    }
  }

  return options;
};

const toJaDate = (date: Date): string => {
  return format(date, "yyyy年MM月dd日（E）", { locale: ja });
};

// Props型定義 - PathValueが Date | undefined である場合のみ受け入れる
interface Props<T extends FieldValues, TName extends Path<T>> {
  fieldKey: PathValue<T, TName> extends Date | undefined ? TName : never;
  labelText: string;
  disabled?: boolean;
}

// 学習ログの日付・時刻フォームフィールドコンポーネント
// 記録をつけるための心理的の負担を最大限に減らすため、
// 未設定／日付のみ／日付＋時刻の3形式をサポートするUIとして設計
export const FormDateTimeField = <
  T extends FieldValues,
  TName extends Path<T>,
>({
  fieldKey,
  labelText,
  disabled,
}: Props<T, TName>) => {
  const form = useFormContext<T>();
  const watchedValue = form.watch(fieldKey);
  disabled = disabled ?? form.formState.isSubmitting;

  // 時刻選択肢をメモ化
  const timeOptions = useMemo(() => generateTimeOptions(), []);

  // 日付表示をメモ化
  const displayDate = useMemo(() => {
    return watchedValue ? toJaDate(watchedValue) : null;
  }, [watchedValue]);

  // 時刻文字列をメモ化
  const timeString = useMemo(() => {
    return watchedValue ? getTimeString(watchedValue) : "unset";
  }, [watchedValue]);

  const handleTimeChange = useCallback(
    (timeValue: string) => {
      const currentDate = form.getValues(fieldKey);
      if (currentDate) {
        const newDate = setTimeToDate(currentDate, timeValue);
        form.setValue(fieldKey, newDate as PathValue<T, TName>, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    },
    [form, fieldKey],
  );

  const handleClearClick = useCallback(() => {
    form.setValue(fieldKey, undefined as PathValue<T, TName>, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [form, fieldKey]);

  const handleDateSelect = useCallback(
    (date: Date | undefined) => {
      if (date) {
        // 日付選択時は時刻を未設定にする
        const newDate = setTimeUnset(date);
        form.setValue(fieldKey, newDate as PathValue<T, TName>, {
          shouldValidate: true,
          shouldDirty: true,
        });
      } else {
        form.setValue(fieldKey, undefined as PathValue<T, TName>, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    },
    [form, fieldKey],
  );

  return (
    <FormField
      control={form.control}
      name={fieldKey}
      render={({ field }) => (
        <FormItem className="flex flex-col gap-y-1.5">
          <div className="flex flex-row items-start gap-x-2">
            <div className="flex w-60 flex-col gap-y-1.5">
              <div className="flex flex-row items-center gap-x-0.5">
                <FormLabel className="h-4">{labelText}</FormLabel>
                {watchedValue && (
                  <IoMdCloseCircle
                    onClick={handleClearClick}
                    className={cn("cursor-pointer hover:opacity-50")}
                  />
                )}
              </div>
              <div className="flex-shrink-0">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left",
                          !field.value && "text-muted-foreground",
                        )}
                        disabled={disabled}
                      >
                        {displayDate || `日付を選択（オプション）`}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={handleDateSelect}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {watchedValue && (
              <div className="flex flex-col gap-y-1.5">
                <Label className="h-4" htmlFor={fieldKey + "_time"}>
                  時刻
                </Label>
                <Select
                  value={timeString}
                  onValueChange={handleTimeChange}
                  disabled={disabled}
                >
                  <SelectTrigger className="w-32" id={fieldKey + "_time"}>
                    <SelectValue placeholder="時刻を選択（任意）" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <FormErrorMessage
            msg={form.formState.errors[fieldKey]?.message as string | undefined}
          />
        </FormItem>
      )}
    />
  );
};
