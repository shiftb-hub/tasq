import { Role } from "@prisma/client";
import { z } from "zod";

export const emailSchema = z.email();
export const passwordSchema = z.string().min(5);

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

export const chapterSchema = z.int().min(1).max(14).nullable();

export const jobSchema = z
  .string()
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

export const aboutContentSchema = z.string().min(0).max(1000);
export const aboutSlugSchema = z
  .string()
  .transform((value) => (value === "" ? null : value))
  .nullable()
  .refine(
    (val) =>
      val === null ||
      (val.length >= 4 && val.length <= 16 && /^[a-z0-9-]+$/.test(val)),
    {
      message: "4〜16文字の英小文字・数字・ハイフンのみ使用できます",
    },
  );
