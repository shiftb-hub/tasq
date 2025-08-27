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

export const uuidSchema = z.uuidv4({
  error: "UUIDの形式が正しくありません。",
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
  .union([z.coerce.date(), z.date(), z.undefined()])
  .refine(
    (date) =>
      date === undefined ||
      (date >= new Date("2025-01-01") && date <= new Date("2030-12-31")),
    {
      message: "2025年1月1日から2030年12月31日の間にしてください。",
    },
  )
  .optional();

export const learningLogSpentMinutesSchema = z.preprocess(
  (val) => {
    // null, undefined, NaN, 空文字列の場合は 0 に変換 (RHF の valueAsNumber 対応)
    if (val == null || Number.isNaN(val) || val === "") return 0;
    // 数値でない文字列は coerce で数値変換を試行
    return typeof val === "string" ? Number(val) : val;
  },
  z
    .number()
    .int()
    .min(0, { message: "0 分以上を設定してください。" })
    .max(6000, { message: "6000 分以内を設定してください。" }),
);
