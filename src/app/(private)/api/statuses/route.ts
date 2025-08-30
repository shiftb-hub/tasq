import { NextRequest, NextResponse } from "next/server";
import { authenticateAppUser as authenticateUser } from "@/app/_libs/authenticateUser";
import { ApiResponseBuilder as ResBuilder } from "@/app/_types/ApiResponse";
import { AppErrorCodes } from "@/app/_types/AppErrorCodes";
import { dumpException } from "@/app/_libs/dumpException";
import { CreateStatusRequestSchema } from "@/app/_types/StatusRequest";
import * as statusService from "@/app/_services/statusService";

export const dynamic = "force-dynamic";

/**
 * ステータス一覧取得
 * GET /api/statuses
 */
export const GET = async () => {
  try {
    await authenticateUser();
    const statuses = await statusService.getStatuses();
    
    return NextResponse.json(
      ResBuilder.success(statuses).build()
    );
  } catch (error) {
    dumpException(error);
    
    return NextResponse.json(
      ResBuilder.error(AppErrorCodes.INTERNAL_SERVER_ERROR)
        .withDescription("An unexpected error occurred")
        .build(),
      { status: 500 }
    );
  }
};

/**
 * ステータス作成（ADMINのみ）
 * POST /api/statuses
 */
export const POST = async (request: NextRequest) => {
  try {
    const user = await authenticateUser();
    const body = await request.json();
    
    // バリデーション
    const validationResult = CreateStatusRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        ResBuilder.error(AppErrorCodes.TASK_VALIDATION_ERROR)
          .withDescription(validationResult.error.errors[0].message)
          .build(),
        { status: 400 }
      );
    }
    
    const status = await statusService.createStatus(validationResult.data, user);
    
    return NextResponse.json(
      ResBuilder.success(status).build(),
      { status: 201 }
    );
  } catch (error) {
    dumpException(error);
    
    if (error instanceof Error && error.message === AppErrorCodes.ADMIN_REQUIRED) {
      return NextResponse.json(
        ResBuilder.error(AppErrorCodes.ADMIN_REQUIRED)
          .withDescription("Admin privileges required")
          .build(),
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      ResBuilder.error(AppErrorCodes.INTERNAL_SERVER_ERROR)
        .withDescription("An unexpected error occurred")
        .build(),
      { status: 500 }
    );
  }
};