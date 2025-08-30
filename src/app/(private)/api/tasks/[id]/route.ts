import { NextRequest, NextResponse } from "next/server";
import { authenticateAppUser as authenticateUser } from "@/app/_libs/authenticateUser";
import { ApiResponseBuilder as ResBuilder } from "@/app/_types/ApiResponse";
import { AppErrorCodes } from "@/app/_types/AppErrorCodes";
import { dumpError } from "@/app/_libs/dumpException";
import { UpdateTaskRequestSchema } from "@/app/_types/TaskRequest";
import * as taskService from "@/app/_services/taskService";

export const dynamic = "force-dynamic";

type Props = {
  params: {
    id: string;
  };
};

/**
 * タスク詳細取得
 * GET /api/tasks/[id]
 */
export const GET = async (request: NextRequest, { params }: Props) => {
  try {
    const user = await authenticateUser();
    const task = await taskService.getTask(params.id, user);

    return NextResponse.json(ResBuilder.success(task).build());
  } catch (error) {
    dumpError(error, "タスク詳細取得");

    if (
      error instanceof Error &&
      error.message === AppErrorCodes.TASK_NOT_FOUND
    ) {
      return NextResponse.json(
        ResBuilder.error(AppErrorCodes.TASK_NOT_FOUND)
          .withDescription("Task not found")
          .build(),
        { status: 404 },
      );
    }

    if (
      error instanceof Error &&
      error.message === AppErrorCodes.TASK_ACCESS_DENIED
    ) {
      return NextResponse.json(
        ResBuilder.error(AppErrorCodes.TASK_ACCESS_DENIED)
          .withDescription("You don't have permission to access this task")
          .build(),
        { status: 403 },
      );
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
 * タスク更新
 * PUT /api/tasks/[id]
 */
export const PUT = async (request: NextRequest, { params }: Props) => {
  try {
    const user = await authenticateUser();
    const body = await request.json();

    // バリデーション
    const validationResult = UpdateTaskRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        ResBuilder.error(AppErrorCodes.TASK_VALIDATION_ERROR)
          .withDescription(validationResult.error.issues[0].message)
          .build(),
        { status: 400 },
      );
    }

    const task = await taskService.updateTask(
      params.id,
      validationResult.data,
      user,
    );

    return NextResponse.json(ResBuilder.success(task).build());
  } catch (error) {
    dumpError(error, "タスク更新");

    if (
      error instanceof Error &&
      error.message === AppErrorCodes.TASK_NOT_FOUND
    ) {
      return NextResponse.json(
        ResBuilder.error(AppErrorCodes.TASK_NOT_FOUND)
          .withDescription("Task not found")
          .build(),
        { status: 404 },
      );
    }

    if (
      error instanceof Error &&
      error.message === AppErrorCodes.TASK_ACCESS_DENIED
    ) {
      return NextResponse.json(
        ResBuilder.error(AppErrorCodes.TASK_ACCESS_DENIED)
          .withDescription("You don't have permission to update this task")
          .build(),
        { status: 403 },
      );
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
 * タスク削除
 * DELETE /api/tasks/[id]
 */
export const DELETE = async (request: NextRequest, { params }: Props) => {
  try {
    const user = await authenticateUser();
    await taskService.deleteTask(params.id, user);

    return NextResponse.json(ResBuilder.success({ success: true }).build());
  } catch (error) {
    dumpError(error, "タスク削除");

    if (
      error instanceof Error &&
      error.message === AppErrorCodes.TASK_NOT_FOUND
    ) {
      return NextResponse.json(
        ResBuilder.error(AppErrorCodes.TASK_NOT_FOUND)
          .withDescription("Task not found")
          .build(),
        { status: 404 },
      );
    }

    if (
      error instanceof Error &&
      error.message === AppErrorCodes.TASK_ACCESS_DENIED
    ) {
      return NextResponse.json(
        ResBuilder.error(AppErrorCodes.TASK_ACCESS_DENIED)
          .withDescription("You don't have permission to delete this task")
          .build(),
        { status: 403 },
      );
    }

    return NextResponse.json(
      ResBuilder.error(AppErrorCodes.INTERNAL_SERVER_ERROR)
        .withDescription("An unexpected error occurred")
        .build(),
      { status: 500 },
    );
  }
};
