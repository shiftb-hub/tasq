import prisma from "@/app/_libs/prisma";
import { NextResponse } from "next/server";
import { Post } from "@prisma/client";
import { getAppUser } from "@/app/_libs/getSupabaseUser";

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    // AppUserを取得
    const appUser = await getAppUser();
    // console.log("User:", JSON.stringify(appUser, null, 2));

    const posts: Post[] = await prisma.post.findMany({
      where: {
        userId: appUser.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(posts);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "投稿記事の一覧の取得に失敗しました" },
      { status: 500 },
    );
  }
};
