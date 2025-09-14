import { NextRequest, NextResponse } from "next/server";
import { authenticateAppUser as authenticateUser } from "@/app/_libs/authenticateUser";
import { ApiResponseBuilder as ResBuilder } from "@/app/_types/ApiResponse";
import { AppErrorCodes } from "@/app/_types/AppErrorCodes";
import { dumpError } from "@/app/_libs/dumpException";
import { CreateActivityTypeRequestSchema } from "@/app/_types/ActivityTypeRequest";
import * as activityTypeService from "@/app/_services/activityTypeService";
export const dynamic = "force-dynamic";

/**
 * ActivityType 一覧/作成
 */

export const GET = async () => {
  try {
    await authenticateUser();
    const activityTypes = await activityTypeService.getActivityTypes();
    return NextResponse.json(ResBuilder.success(activityTypes).build());
  } catch (error) {
    dumpError(error, "ActivityType operation");

    // 認証エラーのチェック
    if (
      error instanceof Error &&
      (error.message === AppErrorCodes.UNAUTHORIZED ||
        error.message === AppErrorCodes.APP_USER_NOT_FOUND ||
        error.message === AppErrorCodes.SUPABASE_USER_NOT_FOUND)
    ) {
      return NextResponse.json(
        ResBuilder.error(AppErrorCodes.UNAUTHORIZED)
          .withDescription("Authentication required")
          .build(),
        { status: 401 },
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

export const POST = async (request: NextRequest) => {
  try {
    const user = await authenticateUser();
    const body = await request.json();
    const validation = CreateActivityTypeRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        ResBuilder.error(AppErrorCodes.TASK_VALIDATION_ERROR)
          .withDescription(validation.error.issues[0].message)
          .build(),
        { status: 400 },
      );
    }
    const created = await activityTypeService.createActivityType(validation.data, user);
    return NextResponse.json(ResBuilder.success(created).build(), { status: 201 });
  } catch (error) {
    dumpError(error, "ActivityType operation");

    // 認証エラーのチェック
    if (
      error instanceof Error &&
      (error.message === AppErrorCodes.UNAUTHORIZED ||
        error.message === AppErrorCodes.APP_USER_NOT_FOUND ||
        error.message === AppErrorCodes.SUPABASE_USER_NOT_FOUND)
    ) {
      return NextResponse.json(
        ResBuilder.error(AppErrorCodes.UNAUTHORIZED)
          .withDescription("Authentication required")
          .build(),
        { status: 401 },
      );
    }

    if (error instanceof Error && error.message === AppErrorCodes.ADMIN_REQUIRED) {
      return NextResponse.json(
        ResBuilder.error(AppErrorCodes.ADMIN_REQUIRED)
          .withDescription("Admin privileges required")
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
