"use client";

import NextLink from "next/link";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/app/_libs/supabase/browserClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { FormErrorMessage } from "@/app/_components/FormErrorMessage";

import { LuSend } from "react-icons/lu";
import type { SignupRequest } from "@/app/_types/SignupRequest";
import { signupRequestSchema } from "@/app/_types/SignupRequest";
import { appBaseUrl } from "@/app/_configs/app-config";

import { useRouter } from "next/navigation";

const c_Email = "email";
const c_Password = "password";
const c_ConfirmPassword = "confirmPassword";

const Page: React.FC = () => {
  const router = useRouter();
  const [isSignUpCompleted, setIsSignUpCompleted] = useState(false);

  const form = useForm<SignupRequest>({
    mode: "onChange",
    resolver: zodResolver(signupRequestSchema),
  });
  const fieldErrors = form.formState.errors;

  // ユーザーがフィールドを変更した時のみルートエラーをクリア
  const clearRootErrorOnChange = () => {
    if (fieldErrors.root) {
      form.clearErrors("root");
    }
  };

  const setRootError = (errorMsg: string) => {
    form.setError("root", {
      type: "manual",
      message: errorMsg,
    });
  };

  const onSubmit = async (formValues: SignupRequest) => {
    console.log("onSubmit", formValues);
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
      switch (error.code) {
        case "over_email_send_rate_limit":
          setRootError(
            "システムから送信可能な認証メールが規定数を超えました。しばらくたってから、再度、試してみてください。",
          );
          break;
        case "user_already_exists":
          setRootError(
            `メールアドレス ( ${formValues.email} ) は、既に使用されています。`,
          );
          break;
        default:
          setRootError(
            `サインアップ処理に失敗しました。詳細：${JSON.stringify(error)}`,
          );
          break;
      }
      return;
    }

    // ローカル環境の開発用 Supabase では、サインアップで自動ログインになるため、
    // 一旦、ログアウト処理をしておく。本番環境では以下のログアウト処理は不要。
    await supabase.auth.signOut();

    setIsSignUpCompleted(true);
  };

  return (
    <div className="flex justify-center pt-12">
      <div className="w-full max-w-[460px]">
        <h1 className="mb-8 text-center text-3xl font-bold">サインアップ</h1>
        <form
          className="space-y-4"
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
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
            />
            <FormErrorMessage msg={fieldErrors.password?.message} />
          </div>

          <div className="flex flex-col gap-y-1.5">
            <Label htmlFor={c_ConfirmPassword}>パスワード（確認用）</Label>
            <Input
              {...form.register(c_ConfirmPassword, {
                onChange: clearRootErrorOnChange,
              })}
              type="password"
              id={c_ConfirmPassword}
              placeholder="password"
              aria-invalid={!!fieldErrors.confirmPassword}
            />
            <FormErrorMessage msg={fieldErrors.confirmPassword?.message} />
          </div>

          <FormErrorMessage msg={fieldErrors.root?.message} />

          <div>
            <Button
              className="w-full"
              type="submit"
              disabled={!form.formState.isValid}
            >
              <div className="flex items-center gap-x-1">
                <LuSend />
                <div>登録</div>
              </div>
            </Button>
          </div>
        </form>
        {isSignUpCompleted && (
          <div className="mt-4">
            サインアップが完了しました。
            {/* 登録いただいたメールアドレス ( {form.getValues(c_Email)} ) 宛に、認証メールを送信しました。メールに記載のURLをクリックして、登録手続きを完了してください。 */}
            <NextLink
              href={`/login?${c_Email}=${form.getValues(c_Email)}`}
              className="text-blue-500 underline"
            >
              ログインページ
            </NextLink>
            からログインしてください。
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
