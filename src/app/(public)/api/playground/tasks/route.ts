import prisma from "@/app/_libs/prisma";
import { NextResponse } from "next/server";
import { Task } from "@prisma/client";
import { ApiResponseBuilder as ResBuilder } from "@/app/_types/ApiResponse";

export const dynamic = "force-dynamic";

// タスクの一覧を取得するAPI（テスト用）
export const GET = async () => {
  try {
    const tasks: Task[] = await prisma.task.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(ResBuilder.success(tasks).build());
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      ResBuilder.error().withMetadata({ error: e }).build(),
    );
  }
};
