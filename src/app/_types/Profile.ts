import { z } from "zod";
import {
  userNameSchema,
  jobSchema,
  roleSchema,
  emailSchema,
  chapterSchema,
  slackIdSchema,
  snsIdSchema,
  bioSchema,
  profileImageKeySchema,
} from "@/app/_types/CommonSchemas";

// プロフィールの情報
export const selfProfileSchema = z.object({
  name: userNameSchema,
  role: roleSchema,
  email: emailSchema,
  job: jobSchema,
  currentChapter: chapterSchema,
  slackId: slackIdSchema,
  githubId: snsIdSchema,
  instagramId: snsIdSchema,
  threadsId: snsIdSchema,
  xId: snsIdSchema,
  bio: bioSchema,
  profileImageKey: profileImageKeySchema,
});

// 公開用プロフィールのスキーマを作成
export const publicProfileSchema = selfProfileSchema.omit({ email: true });

export type SelfProfile = z.infer<typeof selfProfileSchema>;
export type PublicProfile = z.infer<typeof publicProfileSchema>;
