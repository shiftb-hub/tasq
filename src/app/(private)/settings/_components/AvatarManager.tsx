"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import type { InputHTMLAttributes } from "react";
import type { FieldValues, Path, PathValue } from "react-hook-form";

import { useFormContext } from "react-hook-form";
import { createSupabaseBrowserClient } from "@/app/_libs/supabase/browserClient";

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
import { twMerge } from "tailwind-merge";

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
  const [uploading, setUploading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const { watch, setValue } = useFormContext<T>();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const getSignedAvatarUrl = async () => {
      const imageKey = watch(fieldKey);
      if (imageKey === "" || imageKey === undefined) return;

      const { data, error } = await supabase.storage
        .from(avatarBucket)
        .createSignedUrl(imageKey, 60 * 60);
      if (error) {
        console.error("署名付きURL生成エラー:", error);
        setAvatarUrl(undefined);
        return;
      }
      setAvatarUrl(data.signedUrl);
    };
    getSignedAvatarUrl();
  }, [supabase.storage, setAvatarUrl, watch, fieldKey]);

  const mimeToExt: Record<string, string> = useMemo(
    () => ({
      "image/png": "png",
      "image/jpeg": "jpg",
      "image/webp": "webp",
    }),
    [],
  );

  // アバター画像のアップロード処理
  const uploadAvatar = useCallback(
    async (file: File) => {
      try {
        const mimeType = file.type; // 例: "image/png"
        const ext = mimeToExt[mimeType]; // 拡張子を取得
        if (!ext) throw new Error("許可されていないファイル形式です。");

        const fileName = `${nanoid()}.${ext}`;
        const filePath = `${userId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from(avatarBucket)
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) throw uploadError;

        setValue(fieldKey, filePath as PathValue<T, typeof fieldKey>);

        const { data, error: urlError } = await supabase.storage
          .from(avatarBucket)
          .createSignedUrl(filePath, 60 * 60); // 1時間有効

        if (urlError) {
          console.error("画像URL取得エラー:", urlError);
          return;
        }
        setAvatarUrl(data.signedUrl);
      } catch (e) {
        console.error("アップロードエラー:", e);
        setErrMsg("アップロードに失敗しました");
      } finally {
        setUploading(false);
      }
    },
    [mimeToExt, userId, supabase.storage, setValue, fieldKey],
  );

  // 「画像をアップロード」ボタンの処理
  const handleUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // ファイル選択時の処理
  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (mimeToExt[file.type]) {
        uploadAvatar(file);
      } else {
        setErrMsg(
          "対応していない画像形式です。jpg, png, webp のみ使用可能です。",
        );
      }
      e.target.value = "";
    },
    [uploadAvatar, mimeToExt],
  );

  // アバター画像の削除処理
  const handleDelete = useCallback(() => {
    setValue(fieldKey, undefined as PathValue<T, typeof fieldKey>);
    setAvatarUrl(undefined);
  }, [setValue, fieldKey]);

  return (
    <div
      className={twMerge("flex flex-col items-center gap-y-2", containerStyles)}
    >
      <div className="rounded-full border-2 border-gray-300 p-0.5">
        <Avatar className="h-32 w-32">
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

      <div className="flex flex-row items-center gap-x-2">
        <div>
          <Button
            type="button"
            size="sm"
            disabled={uploading}
            onClick={handleUpload}
          >
            <LuImagePlus />
            画像をアップロード
          </Button>
        </div>

        <div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            disabled={!avatarUrl || uploading}
            onClick={handleDelete}
          >
            <LuTrash2 />
            削除
          </Button>
        </div>
      </div>

      <FormErrorMessage msg={errMsg} />

      <input
        ref={fileInputRef}
        type="file"
        accept={Object.keys(mimeToExt).join(",")}
        onChange={handleFileSelect}
        hidden
      />
    </div>
  );
};
