"use client";

// React と フォームライブラリ
import { useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// UIコンポーネント・アイコン
import { Button } from "@/app/_components/ui/button";

import { FormErrorMessage } from "@/app/_components/FormErrorMessage";
import { FormTextField } from "@/app/_components/FormTextField";
import { FormTextareaField } from "@/app/_components/FormTextAreaField";
import { FormTextReadonly } from "@/app/_components/FormTextReadonly";
import { AvatarManager } from "./AvatarManager";
import { ChapterSelectField } from "@/app/_components/ChapterSelectField";
import { SocialAccountVerifyLink } from "./SocialAccountVerifyLink";
import { MdCancel } from "react-icons/md";
import { FiCheckCircle, FiExternalLink } from "react-icons/fi";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";

// 型定義・バリデーションスキーマ
import type { SelfProfile } from "@/app/_types/Profile";
import type { ProfileUpdateRequest } from "../_types/ProfileUpdateRequest";
import { profileUpdateRequestSchema } from "../_types/ProfileUpdateRequest";

// ServerActions / API系
import { profileUpdateAction } from "../profileUpdateAction";
import { mutate } from "swr";

// ユーティリティ
import { dumpError } from "@/app/_libs/dumpException";
import { cn } from "@/app/_libs/utils";

const c_Name = "name";
const c_CurrentChapter = "currentChapter";
const c_Job = "job";
const c_SlackId = "slackId";
const c_InstagramId = "instagramId";
const c_ThreadsId = "threadsId";
const c_XId = "xId";
const c_GithubId = "githubId";
const c_Bio = "bio";
const c_ProfileImageKey = "profileImageKey";

type Props = {
  initValues: SelfProfile;
};

/**
 * プロフィール編集コンポーネント（CSR）
 *
 * @returns JSX.Element
 */
const ProfileEditorView: React.FC<Props> = (props) => {
  const { initValues } = props;

  const form = useForm<ProfileUpdateRequest>({
    mode: "onChange",
    resolver: zodResolver(profileUpdateRequestSchema),
    defaultValues: {
      name: initValues.name,
      job: initValues.job,
      currentChapter: initValues.currentChapter,
      slackId: initValues.slackId,
      githubId: initValues.githubId,
      instagramId: initValues.instagramId,
      threadsId: initValues.threadsId,
      xId: initValues.xId,
      bio: initValues.bio,
      profileImageKey: initValues.profileImageKey,
    } satisfies ProfileUpdateRequest,
  });
  const fieldErrors = form.formState.errors;

  // profileUpdateAction (ServerAction) で
  // 発生した問題はルートエラーに設定して表示
  const setRootError = useCallback(
    (errMsg: string) => {
      form.setError("root", { type: "manual", message: errMsg });
    },
    [form],
  );

  // ルートエラーのクリア
  const clearRootError = useCallback(() => {
    if (fieldErrors.root) form.clearErrors("root");
  }, [fieldErrors.root, form]);

  // 編集内容内容の破棄（デフォルト値の復元）
  const restoreInitialValues = useCallback(() => {
    clearRootError();
    form.reset();
  }, [form, clearRootError]);

  // 更新処理 (profileUpdateActionの実行）
  const onSubmit = useCallback(
    async (formValues: ProfileUpdateRequest) => {
      console.log(JSON.stringify(formValues, null, 2)); // デバッグ用
      clearRootError();
      try {
        const result = await profileUpdateAction(formValues);
        if (result.success) {
          form.reset(formValues); // デフォルト値の更新
          await mutate("/api/me");
          return;
        }
        setRootError(
          result.errorMessageForUser || "プロフィール更新に失敗しました。",
        );
      } catch (e) {
        dumpError(e, "プロフィール更新処理 (Client) ", {
          formValues,
        });
        setRootError(
          "フロントエンドで発生した予期せぬエラーでプロフィール更新処理に失敗しました。再度お試しください。",
        );
      }
    },
    [setRootError, clearRootError, form],
  );

  return (
    <div>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "space-y-4",
          form.formState.isSubmitting && "cursor-not-allowed opacity-50",
        )}
      >
        <FormProvider {...form}>
          <AvatarManager<ProfileUpdateRequest>
            userId={initValues.id}
            fieldKey={c_ProfileImageKey}
          />

          <FormTextField<ProfileUpdateRequest>
            fieldKey={c_Name}
            labelText={`名前（${initValues.role}）`}
            autoComplete="off"
          />

          <div className="flex flex-col">
            <FormTextReadonly
              labelText="メールアドレス"
              fieldKey="email"
              value={initValues.email}
            />
            <p className="mt-1 ml-1 text-right text-xs text-slate-500">
              メールアドレス（ログインID）の変更は
              <Link
                href="/change-email"
                className="inline-flex items-center px-1 text-blue-500"
              >
                こちら
                <FiExternalLink className="ml-0.5 inline-block" />
              </Link>
            </p>
          </div>

          <FormTextField<ProfileUpdateRequest>
            fieldKey={c_Job}
            labelText="ジョブ"
            exampleText="第92期生、卒業生、新米TA など"
          />

          <div className="flex flex-col gap-y-1">
            <ChapterSelectField<ProfileUpdateRequest>
              labelText="現在、取組み中の章"
              fieldKey={c_CurrentChapter}
            />
            <SocialAccountVerifyLink
              platformName="ShiftB"
              url="https://shiftb.dev/courses/react"
            />
          </div>

          <div className="flex flex-col gap-y-1">
            <FormTextField<ProfileUpdateRequest>
              fieldKey={c_SlackId}
              labelText="Slack ID"
              exampleText="@竈門炭治郎"
            />
            <SocialAccountVerifyLink
              platformName="ShiftB Slack"
              url="https://app.slack.com/client/T07AG20TL3E/"
            />
          </div>

          <div className="flex flex-col gap-y-1">
            <FormTextField<ProfileUpdateRequest>
              fieldKey={c_GithubId}
              labelText="GitHub ID"
            />
            <SocialAccountVerifyLink
              platformName="GitHub"
              url={`https://github.com/${form.watch(c_GithubId)}`}
            />
          </div>

          <div className="flex flex-col gap-y-1">
            <FormTextField<ProfileUpdateRequest>
              fieldKey={c_InstagramId}
              labelText="Instagram ID"
            />
            <SocialAccountVerifyLink
              platformName="Instagram"
              url={`https://instagram.com/${form.watch(c_InstagramId)}`}
            />
          </div>

          <div className="flex flex-col gap-y-1">
            <FormTextField<ProfileUpdateRequest>
              fieldKey={c_ThreadsId}
              labelText="Threads ID"
            />
            <SocialAccountVerifyLink
              platformName="Threads"
              url={`https://www.threads.com/@${form.watch(c_ThreadsId)}`}
            />
          </div>

          <div className="flex flex-col gap-y-1">
            <FormTextField<ProfileUpdateRequest>
              fieldKey={c_XId}
              labelText="X ID"
            />
            <SocialAccountVerifyLink
              platformName="X"
              url={`https://x.com/${form.watch(c_XId)}`}
            />
          </div>

          <FormTextareaField fieldKey={c_Bio} labelText="自己紹介" />

          {/* 
            TODO: デバッグ用（アバター画像設定のデバッグが十分に完了してから削除）
          */}
          <FormTextField<ProfileUpdateRequest>
            fieldKey={c_ProfileImageKey}
            labelText="ProfileImageKey"
          />
        </FormProvider>

        <FormErrorMessage msg={fieldErrors.root?.message} />

        <div>
          <div className="flex items-stretch justify-around gap-x-2">
            <Button
              type="button"
              className="flex-1"
              variant="secondary"
              disabled={form.formState.isSubmitting}
              onClick={restoreInitialValues}
            >
              <div className="flex items-center gap-x-1">
                <MdCancel />
                <div>編集内容を破棄</div>
              </div>
            </Button>

            <Button
              type="submit"
              className="flex-1"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <div className="flex items-center gap-x-1">
                  <Loader2Icon className="animate-spin" />
                  <span>プロフィールの更新処理中</span>
                </div>
              ) : (
                <div className="flex items-center gap-x-1">
                  <FiCheckCircle />
                  <div>プロフィールを更新</div>
                </div>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditorView;
