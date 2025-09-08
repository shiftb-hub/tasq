"use client";

// React と フォームライブラリ
import { useCallback, useEffect, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebouncedCallback } from "use-debounce";

// ServerActions / API系
import { learningLogInsertAction } from "../_actions/learningLogInsertAction";

// UIコンポーネント・アイコン
import { PageTitle } from "@/app/_components/PageTitle";
import { LearningLogEditForm } from "../_components/LearningLogEditForm";

// 型定義・バリデーションスキーマ
import { learningLogDateSchema } from "@/app/_types/CommonSchemas";
import { learningLogInsertRequestSchema } from "@/app/_types/LearningLog";

type LearningLogInsertFormValues = z.input<typeof learningLogInsertRequestSchema>;

type Draft = {
  title?: string;
  description?: string;
  reflections?: string;
  spentMinutes?: number;
  startedAt?: Date;
  endedAt?: Date;
  updatedAt: number;
};

// 定数
const c_Root = "root" as const;
const c_StorageKey = "draft:learning-log" as const;

// 下書きの startedAt / endedAt 用スキーマ
// もともとの learningLogDateSchema は null を許容しないため、catch で undefined に変換する
const draftDateSchema = learningLogDateSchema.catch(undefined);

const Page: React.FC = () => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const form = useForm<LearningLogInsertFormValues>({
    resolver: zodResolver(learningLogInsertRequestSchema),
    mode: "onChange",
  });

  // 最初にページを読み込んだときに localStorage にドラフト（下書き）があれば復元
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(c_StorageKey);
      if (!raw) return;
      const parsed: Draft = JSON.parse(raw);
      // spentMinutes は 0 を「未設定」という特殊な値として扱う（フォームには undefined として与える）
      const parsedSpentMinutes =
        parsed.spentMinutes === 0 || parsed.spentMinutes === null ? undefined : parsed.spentMinutes;
      // prettier-ignore
      form.reset({
        title: parsed.title ?? "",
        description: parsed.description ?? "",
        reflections: parsed.reflections ?? "",
        spentMinutes: parsedSpentMinutes,
        startedAt: parsed.startedAt ? draftDateSchema.parse(parsed.startedAt) : undefined,
        endedAt: parsed.endedAt ? draftDateSchema.parse(parsed.endedAt) : undefined,
      });
    } catch {
      // エラーが発生したときはドラフトを削除
      window.localStorage.removeItem(c_StorageKey);
    }
  }, [form]);

  // デバウンス付きのドラフト自動保存機能
  const saveDraft = useDebouncedCallback((values: LearningLogInsertFormValues) => {
    const draft: Draft = {
      title: values.title,
      description: values.description,
      reflections: values.reflections,
      spentMinutes: (values.spentMinutes ?? undefined) as number | undefined,
      startedAt: (values.startedAt ?? undefined) as Date | undefined,
      endedAt: (values.endedAt ?? undefined) as Date | undefined,
      updatedAt: Date.now(),
    };
    window.localStorage.setItem(c_StorageKey, JSON.stringify(draft));
    console.log("学習ログを下書き保存しました。\n", JSON.stringify(draft, null, 2));
  }, 2000);

  // フォームの値が更新されたとき saveDraft (useDebouncedCallback) をコール
  useEffect(() => {
    const subscription = form.watch((values) => {
      if (form.formState.isSubmitting || isPending) return;
      saveDraft(values as LearningLogInsertFormValues);
    });
    return () => {
      subscription.unsubscribe();
      saveDraft.cancel();
    };
  }, [form, saveDraft, isPending]);

  // フォームの Submit 処理
  const onSubmit = useCallback(
    async (formValues: LearningLogInsertFormValues) => {
      form.clearErrors(c_Root);
      saveDraft.cancel();
      try {
        const req = learningLogInsertRequestSchema.parse(formValues);
        const result = await learningLogInsertAction(req);
        if (result.success) {
          saveDraft.cancel(); // 念のために再度キャンセル処理
          window.localStorage.removeItem(c_StorageKey);
          startTransition(() => {
            router.push("/learning-logs");
          });
          return;
        }
        form.setError(c_Root, {
          message: result.errorMessageForUser ?? "バックエンドで学習ログの保存処理に失敗しました",
        });
      } catch {
        form.setError(c_Root, {
          message: "学習ログの保存に予期せず失敗しました",
        });
      }
    },
    [form, router, saveDraft],
  );

  const handleSubmit = useMemo(() => form.handleSubmit(onSubmit), [form, onSubmit]);

  const submitButtonText = useMemo(
    () =>
      isPending ? "画面遷移中..." : form.formState.isSubmitting ? "新規作成中..." : "新規作成",
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
      <PageTitle>学習ログの新規作成</PageTitle>
      <FormProvider {...form}>
        <LearningLogEditForm
          onSubmit={handleSubmit}
          formLocked={formLocked}
          submitDisabled={submitDisabled}
          submitButtonText={submitButtonText}
          errorMessage={form.formState.errors.root?.message}
        />
      </FormProvider>
    </div>
  );
};

export default Page;
