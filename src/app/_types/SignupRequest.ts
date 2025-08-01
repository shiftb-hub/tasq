import { z } from "zod";
import { emailSchema, passwordSchema } from "@/app/_types/CommonSchemas";

export const signupRequestSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine(
    // 初期状態でのバリデーションエラー表示を避けるため、
    // 両方が未入力またはどちらかが未入力のときはスキップ
    (data) => {
      if (!data.password || !data.confirmPassword) return true;
      return data.password === data.confirmPassword;
    },
    {
      path: ["confirmPassword"],
      message: "パスワードが一致しません",
    },
  );
export type SignupRequest = z.infer<typeof signupRequestSchema>;
