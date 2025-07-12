"use client";

import { supabase } from "@/lib/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormErrorMessage } from "@/app/_components/FormErrorMessage";

import { LuSend } from "react-icons/lu";
import { SignupRequest, signupRequestSchema } from "@/app/_types/SignupRequest";
import { appBaseUrl } from "@/config/app-config";

const c_Email = "email";
const c_Password = "password";
const c_ConfirmPassword = "confirmPassword";

const Page: React.FC = () => {
  const form = useForm<SignupRequest>({
    mode: "onChange",
    resolver: zodResolver(signupRequestSchema),
  });
  const fieldErrors = form.formState.errors;

  const setRootError = (errorMsg: string) => {
    form.setError("root", {
      type: "manual",
      message: errorMsg,
    });
  };

  const onSubmit = async (formValues: SignupRequest) => {
    console.log("onSubmit", formValues);
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
    } else {
      // setMsg(
      //   `登録いただいたメールアドレス ( ${formValues.email} ) 宛に、認証メールを送信しました。メールに記載のURLをクリックして、登録手続きを完了してください。`,
      // );
      // setIsSubmitted(true);
    }
  };

  return (
    <div className="flex justify-center pt-12">
      <form
        className="w-full max-w-[460px] space-y-4"
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-y-1.5">
          <Label htmlFor={c_Email}>メールアドレス</Label>
          <Input
            {...form.register(c_Email)}
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
            {...form.register(c_Password)}
            type="password"
            id={c_Password}
            placeholder="password"
            aria-invalid={!!fieldErrors.email}
          />
          <FormErrorMessage msg={fieldErrors.password?.message} />
        </div>

        <div className="flex flex-col gap-y-1.5">
          <Label htmlFor={c_ConfirmPassword}>パスワード（確認用）</Label>
          <Input
            {...form.register(c_ConfirmPassword)}
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
    </div>
  );
};

export default Page;
