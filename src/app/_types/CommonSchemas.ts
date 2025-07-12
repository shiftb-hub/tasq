import { z } from "zod";

export const passwordSchema = z.string().min(5);
export const emailSchema = z.email();
export const userNameSchema = z.string().min(1);

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
