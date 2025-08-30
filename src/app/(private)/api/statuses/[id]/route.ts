import { NextRequest, NextResponse } from "next/server";
import { authenticateAppUser as authenticateUser } from "@/app/_libs/authenticateUser";
import { ApiResponseBuilder as ResBuilder } from "@/app/_types/ApiResponse";
import { AppErrorCodes } from "@/app/_types/AppErrorCodes";
import { dumpException } from "@/app/_libs/dumpException";
import { UpdateStatusRequestSchema } from "@/app/_types/StatusRequest";
import * as statusService from "@/app/_services/statusService";

export const dynamic = "force-dynamic";

type Props = {
  params: {
    id: string;
  };
};

/**
 * ステータス詳細取得
 * GET /api/statuses/[id]
 */
export const GET = async (request: NextRequest, { params }: Props) => {
  try {
    await authenticateUser();
    const status = await statusService.getStatus(params.id);
    
    return NextResponse.json(
      ResBuilder.success(status).build()
    );
  } catch (error) {
    dumpException(error);
    
    if (error instanceof Error && error.message === AppErrorCodes.STATUS_NOT_FOUND) {
      return NextResponse.json(
        ResBuilder.error(AppErrorCodes.STATUS_NOT_FOUND)
          .withDescription("Status not found")
          .build(),
        { status: 404 }
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

/**
 * ステータス更新（ADMINのみ）
 * PUT /api/statuses/[id]
 */
export const PUT = async (request: NextRequest, { params }: Props) => {
  try {
    const user = await authenticateUser();
    const body = await request.json();
    
    // バリデーション
    const validationResult = UpdateStatusRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        ResBuilder.error(AppErrorCodes.TASK_VALIDATION_ERROR)
          .withDescription(validationResult.error.errors[0].message)
          .build(),
        { status: 400 }
      );
    }
    
    const status = await statusService.updateStatus(params.id, validationResult.data, user);
    
    return NextResponse.json(
      ResBuilder.success(status).build()
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
    
    if (error instanceof Error && error.message === AppErrorCodes.STATUS_NOT_FOUND) {
      return NextResponse.json(
        ResBuilder.error(AppErrorCodes.STATUS_NOT_FOUND)
          .withDescription("Status not found")
          .build(),
        { status: 404 }
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

/**
 * ステータス削除（ADMINのみ）
 * DELETE /api/statuses/[id]
 */
export const DELETE = async (request: NextRequest, { params }: Props) => {
  try {
    const user = await authenticateUser();
    await statusService.deleteStatus(params.id, user);
    
    return NextResponse.json(
      ResBuilder.success({ success: true }).build()
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
    
    if (error instanceof Error && error.message === AppErrorCodes.STATUS_NOT_FOUND) {
      return NextResponse.json(
        ResBuilder.error(AppErrorCodes.STATUS_NOT_FOUND)
          .withDescription("Status not found")
          .build(),
        { status: 404 }
      );
    }
    
    if (error instanceof Error && error.message === AppErrorCodes.STATUS_IN_USE) {
      return NextResponse.json(
        ResBuilder.error(AppErrorCodes.STATUS_IN_USE)
          .withDescription("Cannot delete status that is in use")
          .build(),
        { status: 409 }
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