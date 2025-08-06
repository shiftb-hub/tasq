"use client";

import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/app/_libs/supabase/browserClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";

import { Button } from "@/app/_components/ui/button";
import { FormTextField } from "@/app/_components/FormTextField";
import { FormErrorMessage } from "@/app/_components/FormErrorMessage";
import { PageTitle } from "@/app/_components/PageTitle";

import { LuSend } from "react-icons/lu";
import { Loader2Icon } from "lucide-react";

import type { SignupRequest } from "@/app/_types/SignupRequest";
import { signupRequestSchema } from "@/app/_types/SignupRequest";
import { appBaseUrl } from "@/app/_configs/app-config";

const c_Email = "email";
const c_Password = "password";
const c_ConfirmPassword = "confirmPassword";

export const SignupPage: React.FC = () => {
  const [isSignUpCompleted, setIsSignUpCompleted] = useState(false);

  const form = useForm<SignupRequest>({
    mode: "onChange",
    resolver: zodResolver(signupRequestSchema),
  });
  const fieldErrors = form.formState.errors;

  // ルートエラーのクリア
  const clearRootError = useCallback(() => {
    if (fieldErrors.root) form.clearErrors("root");
  }, [fieldErrors.root, form]);

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

  // confirmPassword が先に入力され、その後 password が変更された場合、
  // zod の refine() による一致チェックが再評価されず、バリデーションエラーが反映されない問題に対応
  // password の変更時に confirmPassword のバリデーションを明示的に再実行するようにしている
  const password = form.watch(c_Password);
  useEffect(() => {
    if (!password) return; // 初期状態ではバリデーションをスキップ
    form.trigger(c_ConfirmPassword);
  }, [password, form]);

  // サインアップフォーム送信の処理 Server Action（Custom Invocation）で処理
  const onSubmit = useCallback(
    async (formValues: SignupRequest) => {
      try {
        const supabase = createSupabaseBrowserClient();

        // Supabase で AutoConfirm が ON の場合、signUp () 完了時点で
        // ログイン状態になることに注意。
        const { error } = await supabase.auth.signUp({
          email: formValues.email,
          password: formValues.password,
          options: {
            emailRedirectTo: `${appBaseUrl}/login`,
          },
        });
        if (error) {
          // Supabaseに接続不可のときの特別処理
          if (error.name === "AuthRetryableFetchError") {
            console.error(
              "Supabase接続に失敗。Supabaseの稼働状況を確認してください。",
            );
            setRootError(
              "DB接続に失敗しました。しばらく時間をおいてから再度お試しください。",
            );
            return;
          }

          // 通常のサインアップエラーの処理
          switch (error.code) {
            case "over_email_send_rate_limit":
              setRootError(
                "システムから送信可能な認証メールが規定数を超えました。しばらく時間をおいてから再度お試しください。",
              );
              break;
            case "user_already_exists":
              setRootError(
                `メールアドレス ( ${formValues.email} ) は、既に使用されています。`,
              );
              break;
            case "weak_password":
              setRootError(
                "もう少し安全性の高いパスワードを設定してください。",
              );
              break;
            default:
              setRootError(
                `サインアップ処理に失敗しました ( code: ${error.code} )`,
              );
              break;
          }
          return;
        }

        // ローカル環境の開発用 Supabase では、サインアップで自動ログインになるため、
        // 一旦、ログアウト処理をしておく。本番環境では以下のログアウト処理は不要。
        await supabase.auth.signOut();

        setIsSignUpCompleted(true);
      } catch (e) {
        setRootError(
          "予期せぬエラーによりサインアップ処理に失敗しました。再度お試しください。",
        );
      }
    },
    [setRootError],
  );

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md">
        <PageTitle>サインアップ</PageTitle>
        <form
          className="space-y-4"
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormProvider {...form}>
            <FormTextField<SignupRequest>
              fieldKey={c_Email}
              labelText="メールアドレス"
              placeholder="name@example.com"
              autoComplete="email"
              registerOnChange={clearRootError}
              disabled={isSignUpCompleted || form.formState.isSubmitting}
            />

            <FormTextField<SignupRequest>
              fieldKey={c_Password}
              labelText="パスワード"
              type="password"
              placeholder="password"
              registerOnChange={clearRootError}
              disabled={isSignUpCompleted || form.formState.isSubmitting}
            />

            <FormTextField<SignupRequest>
              fieldKey={c_ConfirmPassword}
              labelText="パスワード（確認用）"
              type="password"
              placeholder="password"
              registerOnChange={clearRootError}
              disabled={isSignUpCompleted || form.formState.isSubmitting}
            />
          </FormProvider>

          <FormErrorMessage msg={fieldErrors.root?.message} />

          <div>
            <Button
              className="w-full"
              type="submit"
              disabled={
                !form.formState.isValid ||
                form.formState.isSubmitting ||
                isSignUpCompleted
              }
            >
              {form.formState.isSubmitting ? (
                <div className="flex items-center gap-x-1">
                  <Loader2Icon className="animate-spin" />
                  <span>サインアップ処理中</span>
                </div>
              ) : (
                <div className="flex items-center gap-x-1">
                  <LuSend />
                  <div>サインアップ</div>
                </div>
              )}
            </Button>
          </div>
        </form>
        <div className="mt-2 text-sm">
          {isSignUpCompleted ? (
            <>
              サインアップが完了しました。
              <Link
                href={`/login?${c_Email}=${form.getValues(c_Email)}`}
                className="px-0.5 text-blue-500 underline"
              >
                ログインページ
              </Link>
              からログインしてください。
            </>
          ) : (
            <>
              既にアカウントをお持ちの方は
              <Link href="/login" className="px-0.5 text-blue-500 underline">
                ログインページ
              </Link>
              をご利用ください。
            </>
          )}
        </div>
      </div>
    </div>
  );
};
