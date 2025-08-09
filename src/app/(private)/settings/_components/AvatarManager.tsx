"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { InputHTMLAttributes } from "react";
import type { FieldValues, Path, PathValue } from "react-hook-form";

import { useFormContext } from "react-hook-form";
import { createSupabaseBrowserClient } from "@/app/_libs/supabase/browserClient";
import { useFileDialog } from "@/app/_hooks/useFileDialog";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";
import { Button } from "@/app/_components/ui/button";
import { ImSpinner3 } from "react-icons/im";
import { LuImagePlus, LuTrash2 } from "react-icons/lu";
import { FormErrorMessage } from "@/app/_components/FormErrorMessage";

import { avatarBucket } from "@/app/_configs/app-config";

import { nanoid } from "nanoid";
import { cn } from "@/app/_libs/utils";

interface Props<T extends FieldValues>
  extends InputHTMLAttributes<HTMLInputElement> {
  userId: string;
  fieldKey: Path<T>;
  containerStyles?: string;
}

export const AvatarManager = <T extends FieldValues>({
  userId,
  fieldKey,
  containerStyles,
}: Props<T>) => {
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const { watch, setValue } = useFormContext<T>();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  // 許可ファイルタイプ MIME Type → 拡張子
  const mimeToExt: Record<string, string> = useMemo(
    () => ({
      "image/png": "png",
      "image/jpeg": "jpg",
      "image/webp": "webp",
    }),
    [],
  );

  // ファイル選択ダイアログのカスタムフック
  const { isBusy, setIsBusy, openFileDialog } = useFileDialog(mimeToExt, 2);

  // アバター画像キーに基づいて署名付きURLを取得
  useEffect(() => {
    const getSignedAvatarUrl = async () => {
      const imageKey = watch(fieldKey);
      if (imageKey === "" || imageKey === undefined) return;

      const { data, error: urlError } = await supabase.storage
        .from(avatarBucket)
        .createSignedUrl(imageKey, 60 * 60);
      if (urlError) {
        console.error("署名付きURL生成エラー:", urlError);
        setErrMsg("アバター画像の取得に失敗しました。");
        setValue(fieldKey, undefined as PathValue<T, typeof fieldKey>);
        setAvatarUrl(undefined);
        return;
      }
      setAvatarUrl(data.signedUrl);
    };
    getSignedAvatarUrl();
  }, [supabase.storage, setAvatarUrl, watch, fieldKey, setValue]);

  // エラーメッセージを10秒後に自動的にクリア
  useEffect(() => {
    if (errMsg) {
      const timer = setTimeout(() => setErrMsg(null), 10000);
      return () => clearTimeout(timer);
    }
  }, [errMsg]);

  // アバター画像のアップロード処理
  const uploadAvatar = useCallback(
    async (file: File) => {
      try {
        const ext = mimeToExt[file.type];
        if (!ext) throw new Error("許可されていないファイル形式です。");

        const fileName = `${nanoid()}.${ext}`;
        const filePath = `${userId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from(avatarBucket)
          .upload(filePath, file, {
            cacheControl: String(60 * 60),
            upsert: false,
          });

        if (uploadError) throw uploadError;

        setValue(fieldKey, filePath as PathValue<T, typeof fieldKey>);

        const { data, error: urlError } = await supabase.storage
          .from(avatarBucket)
          .createSignedUrl(filePath, 60 * 60);

        if (urlError) {
          console.error("アバター画像のURL取得に失敗: ", urlError);
          setErrMsg("アバター画像のURL取得に失敗しました。");
          return;
        }

        setAvatarUrl(data.signedUrl);
        setErrMsg(null);
      } catch (e) {
        console.error("アバター画像のアップロードに失敗: ", e);
        setErrMsg("アバター画像のアップロードに失敗しました。");
      } finally {
        setIsBusy(false); // アップロード処理完了時にローディング停止
      }
    },
    [mimeToExt, userId, supabase.storage, setValue, fieldKey, setIsBusy],
  );

  // 「画像をアップロード」ボタンのイベントハンドラ
  const handleUpload = useCallback(async () => {
    setErrMsg(null);

    const { file, error } = await openFileDialog();

    if (error) {
      setErrMsg(error);
      return;
    }

    if (file) {
      await uploadAvatar(file);
    }
  }, [openFileDialog, uploadAvatar]);

  // アバター画像の削除処理
  const handleDelete = useCallback(() => {
    setErrMsg(null);
    setValue(fieldKey, undefined as PathValue<T, typeof fieldKey>);
    setAvatarUrl(undefined);
  }, [setValue, fieldKey]);

  return (
    <div className={cn("flex flex-col items-center gap-y-3", containerStyles)}>
      <div className="rounded-full border-2 border-gray-300 p-0.5">
        <Avatar className="h-40 w-40">
          <AvatarImage
            src={avatarUrl ?? "/default-avatar.png"}
            alt="アバター画像"
          />
          <AvatarFallback>
            <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
              <ImSpinner3 className="mr-1 animate-spin" />
              Loading...
            </div>
          </AvatarFallback>
        </Avatar>
      </div>

      <FormErrorMessage msg={errMsg} />

      <div className="flex flex-row items-center gap-x-2 pb-4">
        <div>
          <Button
            type="button"
            size="sm"
            disabled={isBusy}
            onClick={handleUpload}
          >
            {isBusy ? <ImSpinner3 className="animate-spin" /> : <LuImagePlus />}
            画像をアップロード
          </Button>
        </div>

        <div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            disabled={!avatarUrl || isBusy}
            onClick={handleDelete}
          >
            <LuTrash2 />
            削除
          </Button>
        </div>
      </div>
    </div>
  );
};
