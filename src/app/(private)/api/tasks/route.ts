import { NextRequest, NextResponse } from "next/server";
import { authenticateAppUser as authenticateUser } from "@/app/_libs/authenticateUser";
import { ApiResponseBuilder as ResBuilder } from "@/app/_types/ApiResponse";
import { AppErrorCodes } from "@/app/_types/AppErrorCodes";
import { dumpError } from "@/app/_libs/dumpException";
import { CreateTaskRequestSchema } from "@/app/_types/TaskRequest";
import * as taskService from "@/app/_services/taskService";
// (private)配下のAPIルートをNext.jsに認識されるために必要
export const dynamic = "force-dynamic";

/**
 * タスク一覧取得
 * GET /api/tasks
 */
export const GET = async () => {
  console.log("GET /api/tasks が呼び出されました");

  try {
    console.log("認証処理を開始します");
    const user = await authenticateUser();
    console.log("認証成功:", user.id, user.name, user.role);

    console.log("タスク取得処理を開始します");
    const tasks = await taskService.getTasks(user);
    console.log("タスク取得成功:", tasks.length, "件");

    return NextResponse.json(ResBuilder.success(tasks).build());
  } catch (error) {
    console.error("タスク取得でエラーが発生しました:", error);
    dumpError(error, "タスク一覧取得");

    // エラーメッセージがAppErrorCodesの値かチェック
    if (error instanceof Error) {
      const errorCode = error.message;
      // AppErrorCodesの値の型を取得
      const validErrorCodes = Object.values(AppErrorCodes);
      if (validErrorCodes.includes(errorCode)) {
        // タスク関連のエラーコードの場合、適切なステータスコードを設定
        const statusCode =
          errorCode === AppErrorCodes.TASK_NOT_FOUND
            ? 404
            : errorCode === AppErrorCodes.TASK_ACCESS_DENIED
              ? 403
              : errorCode === AppErrorCodes.TASK_VALIDATION_ERROR
                ? 400
                : 500;

        return NextResponse.json(
          ResBuilder.error(errorCode)
            .withDescription("Failed to fetch tasks")
            .build(),
          { status: statusCode },
        );
      }
    }

    return NextResponse.json(
      ResBuilder.error(AppErrorCodes.INTERNAL_SERVER_ERROR)
        .withDescription("An unexpected error occurred")
        .build(),
      { status: 500 },
    );
  }
};

/**
 * タスク作成
 * POST /api/tasks
 */
export const POST = async (request: NextRequest) => {
  try {
    const user = await authenticateUser();
    const body = await request.json();

    // バリデーション
    const validationResult = CreateTaskRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        ResBuilder.error(AppErrorCodes.TASK_VALIDATION_ERROR)
          .withDescription(validationResult.error.issues[0].message)
          .build(),
        { status: 400 },
      );
    }

    const task = await taskService.createTask(validationResult.data, user);

    return NextResponse.json(ResBuilder.success(task).build(), { status: 201 });
  } catch (error) {
    dumpError(error, "タスク作成");

    // エラーメッセージがAppErrorCodesの値かチェック
    if (error instanceof Error) {
      const errorCode = error.message;
      // AppErrorCodesの値の型を取得
      const validErrorCodes = Object.values(AppErrorCodes);
      if (validErrorCodes.includes(errorCode)) {
        // タスク関連のエラーコードの場合、適切なステータスコードを設定
        const statusCode =
          errorCode === AppErrorCodes.TASK_NOT_FOUND
            ? 404
            : errorCode === AppErrorCodes.TASK_ACCESS_DENIED
              ? 403
              : errorCode === AppErrorCodes.TASK_VALIDATION_ERROR
                ? 400
                : 500;

        return NextResponse.json(
          ResBuilder.error(errorCode)
            .withDescription("Failed to create task")
            .build(),
          { status: statusCode },
        );
      }
    }

    return NextResponse.json(
      ResBuilder.error(AppErrorCodes.INTERNAL_SERVER_ERROR)
        .withDescription("An unexpected error occurred")
        .build(),
      { status: 500 },
    );
  }
};
