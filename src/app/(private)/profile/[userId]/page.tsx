import prisma from "@/app/_libs/prisma";
import { UserService } from "@/app/_services/userService";
import { createSupabaseServerClient } from "@/app/_libs/supabase/serverClient";

// UIコンポーネント・アイコン
import { ErrorPage } from "@/app/_components/ErrorPage";
import { CopyButton } from "@/app/_components/CopyButton";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";
import { SnsLinkIcon } from "@/app/_components/SnsLinkIcon";
import { BsTwitterX, BsGithub, BsInstagram, BsThreads } from "react-icons/bs";
import { FaSlack } from "react-icons/fa";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { HiOutlineBookOpen } from "react-icons/hi2";
import { SocialAccountVerifyLink } from "@/app/(private)/settings/_components/SocialAccountVerifyLink";

// 型定義・バリデーションスキーマ
import { avatarBucket } from "@/app/_configs/app-config";
import { AppUserNotFoundError } from "@/app/_libs/errors";
import { Role } from "@prisma/client";
import { ChapterTitles } from "@/app/_constants/ChapterTitles";

// ユーティリティ
import { Prisma } from "@prisma/client";
import { Input } from "@/app/_components/ui/input";

export const dynamic = "force-dynamic";

// ProfileImageKey からアバター画像の署名付きURLを取得
const getSignedAvatarUrl = async (imageKey: string | null): Promise<string> => {
  const defaultAvatarUrl = "/default-avatar.png";

  if (!imageKey) return defaultAvatarUrl;

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.storage
      .from(avatarBucket)
      .createSignedUrl(imageKey, 60 * 60);

    if (error) {
      console.error("アバター画像の署名付きURL生成に失敗", error);
      return defaultAvatarUrl;
    }

    return data.signedUrl;
  } catch (e) {
    console.error("アバター画像のURL取得に失敗", e);
    return defaultAvatarUrl;
  }
};

// 公開プロフィールとして必要なフィールドのみを取得するスキーマ
const publicProfileSchema = {
  select: {
    id: true,
    name: true,
    job: true,
    profileImageKey: true,
    role: true,
    slackId: true,
    instagramId: true,
    threadsId: true,
    githubId: true,
    xId: true,
    currentChapter: true,
    bio: true,
  },
} as const;

const roleToString: Record<Role, string> = {
  [Role.STUDENT]: "受講生",
  [Role.TA]: "ティーチングアシスタント",
  [Role.TEACHER]: "講師",
  [Role.ADMIN]: "TASQ管理者",
};

type Props = {
  params: Promise<{ userId: string }>;
};

const Page: React.FC<Props> = async ({ params }) => {
  const { userId } = await params;

  try {
    // [userId] で指定されるユーザの情報を取得
    const userService = new UserService(prisma);
    const user = (await userService.getById(
      userId,
      publicProfileSchema,
    )) satisfies Prisma.UserGetPayload<typeof publicProfileSchema>;

    // アバター画像の署名付きURLを取得
    const avatarUrl = await getSignedAvatarUrl(user.profileImageKey);

    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-y-6 px-4 py-8">
        {/* ヘッダー部分 */}
        <div className="flex flex-col items-center gap-y-4">
          <div className="rounded-full border-2 border-gray-300 p-0.5">
            <Avatar className="h-40 w-40">
              <AvatarImage src={avatarUrl} alt={user.name} />
              <AvatarFallback className="text-3xl">
                {user.name?.charAt(0) || "?"}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex flex-col items-center gap-y-1">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <div>{user.job}</div>
            {user.role === Role.STUDENT && (
              <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 font-bold text-indigo-700">
                {roleToString[Role.STUDENT]}
              </span>
            )}
          </div>

          {/* SNS・外部リンク */}
          <div className="flex flex-row justify-center gap-x-2 text-3xl text-white">
            {user.githubId && (
              <SnsLinkIcon
                // ユーザーIDを安全にURLに埋め込むためにencodeURIComponentでエスケープ
                url={`https://github.com/${encodeURIComponent(user.githubId)}`}
              >
                <BsGithub />
              </SnsLinkIcon>
            )}

            {user.instagramId && (
              <SnsLinkIcon
                url={`https://instagram.com/${encodeURIComponent(user.instagramId)}`}
              >
                <BsInstagram />
              </SnsLinkIcon>
            )}

            {user.threadsId && (
              <SnsLinkIcon
                url={`https://threads.net/@${encodeURIComponent(user.threadsId)}`}
              >
                <BsThreads />
              </SnsLinkIcon>
            )}

            {user.xId && (
              <SnsLinkIcon
                url={`https://x.com/${encodeURIComponent(user.xId)}`}
              >
                <BsTwitterX />
              </SnsLinkIcon>
            )}
          </div>
        </div>

        {/* Slack ID */}
        {user.slackId && (
          <div>
            <h2 className="mb-2 flex items-center text-xl font-bold">
              <FaSlack className="mr-1" />
              ShiftB Slack ID
            </h2>
            <div className="flex flex-row items-center gap-x-2">
              <Input value={user.slackId} readOnly className="w-full" />
              <CopyButton text={user.slackId} />
            </div>
          </div>
        )}

        {/* 現在の章（STUDENTのみ）*/}
        {user.role === Role.STUDENT && user.currentChapter && (
          <div>
            <h2 className="mb-2 flex items-center text-xl font-bold">
              <HiOutlineBookOpen className="mr-1" />
              現在の取り組み章
            </h2>
            <div className="ml-2 rounded-lg bg-indigo-50 px-4 py-1.5 font-bold text-indigo-700">
              {ChapterTitles[user.currentChapter as keyof typeof ChapterTitles]}
            </div>
            <SocialAccountVerifyLink
              platformName="ShiftB"
              url="https://shiftb.dev/courses/react"
            />
          </div>
        )}

        {/* 自己紹介 */}
        {user.bio && (
          <div>
            <h2 className="mb-2 flex items-center text-xl font-bold">
              <HiOutlineChatBubbleLeftRight className="mr-1" />
              自己紹介
            </h2>
            <p className="ml-2 whitespace-pre-wrap">{user.bio}</p>
          </div>
        )}
      </div>
    );
  } catch (e) {
    if (e instanceof AppUserNotFoundError) {
      return <ErrorPage message="ユーザーが見つかりません。" />;
    }
    console.error("Error loading user profile:", e);
    return <ErrorPage message="プロフィール情報の取得に失敗しました。" />;
  }
};

export default Page;
