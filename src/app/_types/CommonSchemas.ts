import { Role } from "@prisma/client";
import { z } from "zod";

export const emailSchema = z.email({
  message: "メールアドレスの形式が正しくありません。",
});
export const passwordSchema = z
  .string()
  .min(5, "パスワードは5文字以上で入力してください。");

export const userNameSchema = z
  .string()
  .min(1)
  .max(16)
  .refine((val) => !/^[\s\u3000]|[\s\u3000]$/.test(val), {
    message: "前後に空白文字を含めることはできません。",
  });

export const roleSchema = z
  .string()
  .transform((val) => val.toUpperCase())
  .refine((val): val is Role => Object.values(Role).includes(val as Role))
  .transform((val) => val as Role)
  .optional();

export const chapterSchema = z.number().int().min(1).max(14).nullable();

export const jobSchema = z
  .string()
  .trim()
  .max(16)
  .transform((val) => (val.trim() === "" ? undefined : val))
  .optional();

export const slackIdSchema = z
  .string()
  .transform((val) => (val.trim() === "" ? undefined : val)) // 空文字なら undefined に変換
  .refine((val) => val === undefined || val.startsWith("@"), {
    message: "Slack ID は @ を含めて入力してください。",
  })
  .optional();

export const snsIdSchema = z
  .string()
  .max(64)
  .transform((val) => (val.trim() === "" ? undefined : val))
  .optional();

export const bioSchema = z.string().max(1000);

export const profileImageKeySchema = z
  .string()
  .transform((val) => (val.trim() === "" ? undefined : val))
  .optional();

// prettier-ignore
export const isUUID = (value: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

export const uuidSchema = z.string().refine(isUUID, {
  message: "Invalid UUID format.",
});

// 学習ログ（LearningLog）関連の zod スキーマ
export const learningLogTitleSchema = z
  .string()
  .trim()
  .min(1, "タイトルは必須です。")
  .max(64, "タイトルは64文字以内で入力してください。");

export const learningLogDescriptionSchema = z
  .string()
  .trim()
  .max(1024, "内容は1024文字以内で入力してください。");

export const learningLogReflectionsSchema = z
  .string()
  .trim()
  .max(1024, "内容は1024文字以内で入力してください。");

export const learningLogDateSchema = z
  .preprocess(
    (value) => {
      if (value === undefined) return undefined;
      if (typeof value === "string") return new Date(value);
      return value; // 既に Date型 の場合
    },
    z
      .date()
      .min(new Date("2025-01-01"), {
        message: "2025年1月1日以降を設定してください。",
      })
      .max(new Date("2030-12-31"), {
        message: "2030年12月31日以前を設定してください。",
      }),
  )
  .optional();

export const learningLogSpentMinutesSchema = z
  .number()
  .int()
  .min(0, { message: "学習時間（分）は0以上で入力してください。" })
  .max(6000, { message: "学習時間（分）は6000分以内で入力してください。" });
