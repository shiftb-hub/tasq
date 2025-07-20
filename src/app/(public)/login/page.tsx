"use client";

// React と フォームライブラリ
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { mutate } from "swr";

// UIコンポーネント・アイコン
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { FormErrorMessage } from "@/app/_components/FormErrorMessage";
import { LuSend } from "react-icons/lu";
import { Loader2Icon } from "lucide-react";

// 型定義・バリデーションスキーマ
import type { LoginRequest } from "@/app/_types/LoginRequest";
import { loginRequestSchema } from "@/app/_types/LoginRequest";

// ServerActions / API系
import { loginAction } from "./loginAction";
import { logoutAction } from "@/app/_actions/logoutAction";

// ユーティリティ
import { twMerge } from "tailwind-merge";
import { createSupabaseBrowserClient } from "@/app/_libs/supabase/browserClient";

const c_Email = "email";
const c_Password = "password";

const Page: React.FC = () => {
  const router = useRouter();
  // 既ログインなら「アカウント」、そうでなければ「null」を保持
  const [loggedInEmail, setLoggedInEmail] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginRequest>({
    mode: "onChange",
    resolver: zodResolver(loginRequestSchema),
  });
  const fieldErrors = form.formState.errors;
  const setFromValue = form.setValue;

  // 既にログインしている場合はアカウント（メールアドレス）を取得
  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const fetchAuthenticatedUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email) setLoggedInEmail(user.email);
    };
    fetchAuthenticatedUser();
  }, []);

  // `/logion?email=xxx` のクエリパラメータからメールアドレス（初期値）を取得
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const email = searchParams.get(c_Email);
    setFromValue(c_Email, email || "");
  }, [setFromValue]);

  // ユーザーがフィールドを変更したときにルートエラーをクリア
  const clearRootErrorOnChange = () => {
    if (fieldErrors.root) {
      form.clearErrors("root");
    }
  };

  // サーバサイドで発生した問題をルートエラーとして設定・通知
  const setRootError = (errorMsg: string) => {
    form.setError("root", {
      type: "manual",
      message: errorMsg,
    });
  };

  // ログインフォーム送信の処理 Server Action（Custom Invocation）で処理
  const onSubmit = async (formValues: LoginRequest) => {
    setIsSubmitting(true);
    try {
      const result = await loginAction(formValues);
      if (result.success) {
        mutate(null); // SWRのキャッシュを全更新
        router.push("/");
        return;
      }
      setRootError(result.error);
      setIsSubmitting(false);
    } catch (error) {
      console.error(
        "ログイン処理に予期せぬ失敗。",
        JSON.stringify(error, null, 2),
      );
      setRootError(
        "ログイン処理において、予期しないエラーが発生しました。再度、お試しください。",
      );
    }
  };

  if (loggedInEmail) {
    return (
      <div className="flex justify-center pt-12">
        <div className="w-full max-w-[460px]">
          <h1 className="mb-8 text-center text-3xl font-bold">ログイン</h1>
          <div>
            <p className="mt-3 text-sm break-all">
              現在、<span className="font-bold">{loggedInEmail}</span>
              として既にログインしています。
              <br />
              別のアカウントでログインするためには、一度、
              <Button
                variant="link"
                className="px-1"
                onClick={async () => await logoutAction()}
              >
                ログアウト
              </Button>
              してください。
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center pt-12">
      <div className="w-full max-w-[460px]">
        <h1 className="mb-8 text-center text-3xl font-bold">ログイン</h1>

        <form
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className={twMerge(
            "space-y-4",
            isSubmitting && "cursor-not-allowed opacity-50",
          )}
        >
          <div className="flex flex-col gap-y-1.5">
            <Label htmlFor={c_Email}>メールアドレス</Label>
            <Input
              {...form.register(c_Email, {
                onChange: clearRootErrorOnChange,
              })}
              type="email"
              id={c_Email}
              placeholder="name@example.com"
              aria-invalid={!!fieldErrors.email}
              disabled={isSubmitting}
            />
            <FormErrorMessage msg={fieldErrors.email?.message} />
          </div>

          <div className="flex flex-col gap-y-1.5">
            <Label htmlFor={c_Password}>パスワード</Label>
            <Input
              {...form.register(c_Password, {
                onChange: clearRootErrorOnChange,
              })}
              type="password"
              id={c_Password}
              placeholder="password"
              aria-invalid={!!fieldErrors.password}
              disabled={isSubmitting}
            />
            <FormErrorMessage msg={fieldErrors.password?.message} />
          </div>

          <FormErrorMessage msg={fieldErrors.root?.message} />

          <div>
            <Button
              className="w-full"
              type="submit"
              disabled={!form.formState.isValid || isSubmitting}
            >
              {isSubmitting ? (
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

export default Page;
