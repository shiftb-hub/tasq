"use client";

// React と フォームライブラリ
import { useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { mutate } from "swr";

// UIコンポーネント・アイコン
import { Button } from "@/app/_components/ui/button";
import { FormTextField } from "@/app/_components/FormTextField";
import { FormErrorMessage } from "@/app/_components/FormErrorMessage";
import { LuSend } from "react-icons/lu";
import { Loader2Icon } from "lucide-react";
import { PageTitle } from "@/app/_components/PageTitle";

// 型定義・バリデーションスキーマ
import type { LoginRequest } from "@/app/_types/LoginRequest";
import { loginRequestSchema } from "@/app/_types/LoginRequest";

// ServerActions / API系
import { loginAction } from "../loginAction";

// ユーティリティ
import { cn } from "@/app/_libs/utils";
import { dumpError } from "@/app/_libs/dumpException";

const c_Email = "email";
const c_Password = "password";

type Props = {
  email?: string;
};

export const LoginPage: React.FC<Props> = (props) => {
  const router = useRouter();

  const form = useForm<LoginRequest>({
    mode: "onChange",
    resolver: zodResolver(loginRequestSchema),
    defaultValues: {
      email: props.email || "",
    },
  });
  const fieldErrors = form.formState.errors;

  // サーバサイドで発生した問題をルートエラーとして設定
  const setRootError = useCallback(
    (errorMsg: string) => {
      form.setError("root", {
        type: "manual",
        message: errorMsg,
      });
    },
    [form],
  );

  // ルートエラーのクリア
  const clearRootError = useCallback(() => {
    if (fieldErrors.root) form.clearErrors("root");
  }, [fieldErrors.root, form]);

  // ログインフォーム送信の処理 Server Action（Custom Invocation）で処理
  const onSubmit = useCallback(
    async (formValues: LoginRequest) => {
      try {
        clearRootError();
        const result = await loginAction(formValues);
        if (result.success) {
          // SWR全体の再検証を非同期で開始（例：タスク一覧などの再取得）
          await mutate(null);
          // "/api/me" はログイン状態に関わるため、旧キャッシュが表示されないよう即座に明示的に消す
          await mutate("/api/me", null, false);
          router.push(result.redirectTo);
          return;
        }
        setRootError(
          result.errorMessageForUser || "ログイン処理に失敗しました。",
        );
      } catch (e) {
        dumpError(e, "ログインページ（CSR）");
        setRootError(
          "予期せぬエラーでログイン処理に失敗しました。再度お試しください。",
        );
      }
    },
    [router, setRootError, clearRootError],
  );

  // フォーム管理とUI表示を同一コンポーネント内で保持（UIは意図的に分離していない）
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md">
        <PageTitle>ログイン</PageTitle>

        <form
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(
            "space-y-4",
            form.formState.isSubmitting && "cursor-not-allowed opacity-50",
          )}
        >
          <FormProvider {...form}>
            <FormTextField<LoginRequest>
              fieldKey={c_Email}
              labelText="メールアドレス"
              placeholder="name@example.com"
              registerOnChange={clearRootError}
              autoComplete="email"
            />

            <FormTextField<LoginRequest>
              type="password"
              fieldKey={c_Password}
              labelText="パスワード"
              placeholder="password"
              registerOnChange={clearRootError}
            />
          </FormProvider>

          <FormErrorMessage msg={fieldErrors.root?.message} />

          <div>
            <Button
              className="w-full"
              type="submit"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <div className="flex items-center gap-x-1">
                  <Loader2Icon className="animate-spin" />
                  <span>ログイン処理中</span>
                </div>
              ) : (
                <div className="flex items-center gap-x-1">
                  <LuSend />
                  <div>ログイン</div>
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
