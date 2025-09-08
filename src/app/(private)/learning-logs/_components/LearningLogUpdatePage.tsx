"use client";

// React と フォームライブラリ
import { useCallback, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// ServerActions / API系
import { learningLogUpdateAction } from "../_actions/learningLogUpdateAction";

// UIコンポーネント・アイコン
import { PageTitle } from "@/app/_components/PageTitle";
import { LearningLogEditForm } from "./LearningLogEditForm";
import { Button } from "@/app/_components/ui/button";

// 型定義・バリデーションスキーマ
import { learningLogUpdateRequestSchema } from "@/app/_types/LearningLog";
import type { LearningLog } from "@/app/_types/LearningLog";

type LearningLogUpdateFormValues = z.input<typeof learningLogUpdateRequestSchema>;

// 定数
const c_Root = "root" as const;

type Props = {
  initValues: LearningLog;
};

export const LearningLogUpdatePage: React.FC<Props> = ({ initValues }) => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  // LearningLog を LearningLogUpdateRequest の形式に変換
  const convertToFormValues = useCallback(
    (learningLog: LearningLog): LearningLogUpdateFormValues => {
      return {
        id: learningLog.id,
        taskId: learningLog.taskId,
        title: learningLog.title,
        description: learningLog.description,
        reflections: learningLog.reflections,
        spentMinutes: learningLog.spentMinutes !== 0 ? learningLog.spentMinutes : undefined,
        startedAt: learningLog.startedAt,
        endedAt: learningLog.endedAt,
      };
    },
    [],
  );

  const form = useForm<LearningLogUpdateFormValues>({
    resolver: zodResolver(learningLogUpdateRequestSchema),
    mode: "onChange",
    defaultValues: convertToFormValues(initValues),
  });

  // リセット機能（初期値に戻す）
  const handleReset = useCallback(() => {
    form.reset(convertToFormValues(initValues));
  }, [form, initValues, convertToFormValues]);

  // フォームの Submit 処理
  const onSubmit = useCallback(
    async (formValues: LearningLogUpdateFormValues) => {
      form.clearErrors(c_Root);
      try {
        const req = learningLogUpdateRequestSchema.parse(formValues);
        const result = await learningLogUpdateAction(req);
        if (result.success) {
          startTransition(() => {
            router.push("/learning-logs");
          });
          return;
        }
        form.setError(c_Root, {
          message: result.errorMessageForUser ?? "バックエンドで学習ログの更新処理に失敗しました",
        });
      } catch {
        form.setError(c_Root, {
          message: "学習ログの更新に予期せず失敗しました",
        });
      }
    },
    [form, router],
  );

  const handleSubmit = useMemo(() => form.handleSubmit(onSubmit), [form, onSubmit]);

  const submitButtonText = useMemo(
    () => (isPending ? "画面遷移中..." : form.formState.isSubmitting ? "更新中..." : "更新"),
    [isPending, form.formState.isSubmitting],
  );

  const formLocked = useMemo(
    () => isPending || form.formState.isSubmitting,
    [isPending, form.formState.isSubmitting],
  );

  const submitDisabled = useMemo(
    () => isPending || form.formState.isSubmitting || !form.formState.isValid,
    [isPending, form.formState.isSubmitting, form.formState.isValid],
  );

  return (
    <div className="mx-auto my-4 w-full max-w-lg space-y-4 px-4 lg:px-0">
      <PageTitle>学習ログの編集</PageTitle>
      <FormProvider {...form}>
        <div className="space-y-4">
          <LearningLogEditForm
            onSubmit={handleSubmit}
            formLocked={formLocked}
            submitDisabled={submitDisabled}
            submitButtonText={submitButtonText}
            errorMessage={form.formState.errors.root?.message}
          />
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleReset}
            disabled={isPending || form.formState.isSubmitting}
          >
            リセット
          </Button>
        </div>
      </FormProvider>
    </div>
  );
};
