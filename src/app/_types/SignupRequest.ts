import { z } from "zod";
import { emailSchema, passwordSchema } from "@/app/_types/CommonSchemas";

export const signupRequestSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "パスワードが一致しません",
  });
export type SignupRequest = z.infer<typeof signupRequestSchema>;
