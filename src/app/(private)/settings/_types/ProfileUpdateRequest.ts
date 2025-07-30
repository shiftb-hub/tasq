import { z } from "zod";
import {
  userNameSchema,
  jobSchema,
  chapterSchema,
  slackIdSchema,
  snsIdSchema,
  bioSchema,
  profileImageKeySchema,
} from "@/app/_types/CommonSchemas";

// ユーザープロフィールの更新リクエスト
export const profileUpdateRequestSchema = z.object({
  name: userNameSchema,
  job: jobSchema,
  currentChapter: chapterSchema,
  slackId: slackIdSchema,
  githubId: snsIdSchema,
  instagramId: snsIdSchema,
  threadsId: snsIdSchema,
  xId: snsIdSchema,
  bio: bioSchema.optional(),
  profileImageKey: profileImageKeySchema,
});
export type ProfileUpdateRequest = z.infer<typeof profileUpdateRequestSchema>;
