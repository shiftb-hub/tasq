import prisma from "@/app/_libs/prisma";
import { NextResponse } from "next/server";
import { Post } from "@prisma/client";

export const dynamic = "force-dynamic";

export const GET = async () => {
  try {
    const posts: Post[] = await prisma.post.findMany({
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
