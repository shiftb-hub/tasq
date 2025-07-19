"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";

import { LuSend } from "react-icons/lu";
import { Loader2Icon } from "lucide-react";

import { FormErrorMessage } from "@/app/_components/FormErrorMessage";

import type { LoginRequest } from "@/app/_types/LoginRequest";
import { loginRequestSchema } from "@/app/_types/LoginRequest";
import { loginAction } from "./loginAction";
import { twMerge } from "tailwind-merge";

const c_Email = "email";
const c_Password = "password";

const Page: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginRequest>({
    mode: "onChange",
    resolver: zodResolver(loginRequestSchema),
  });
  const fieldErrors = form.formState.errors;
  const setFromValue = form.setValue;

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const email = searchParams.get(c_Email);
    setFromValue(c_Email, email || "");
  }, [setFromValue]);

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

  const onSubmit = async (formValues: LoginRequest) => {
    console.log("onSubmit", formValues);
    setIsSubmitting(true);
    try {
      const result = await loginAction(formValues);

      if (result && !result.success) {
        setRootError(result.error);
      }
      // 成功時はredirectが実行されるため、ここには到達しない
    } catch (error) {
      console.error("Submit error:", error);
      setRootError("予期しないエラーが発生しました");
    } finally {
      setIsSubmitting(false);
    }
  };

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
