import { NextRequest, NextResponse } from "next/server";
import { authenticateAppUser as authenticateUser } from "@/app/_libs/authenticateUser";
import { ApiResponseBuilder as ResBuilder } from "@/app/_types/ApiResponse";
import { AppErrorCodes } from "@/app/_types/AppErrorCodes";
import { dumpException } from "@/app/_libs/dumpException";
import { CreateTagRequestSchema } from "@/app/_types/TagRequest";
import * as tagService from "@/app/_services/tagService";

export const dynamic = "force-dynamic";

/**
 * タグ一覧取得
 * GET /api/tags
 */
export const GET = async () => {
  try {
    await authenticateUser();
    const tags = await tagService.getTags();
    
    return NextResponse.json(
      ResBuilder.success(tags).build()
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
 * タグ作成（ADMINのみ）
 * POST /api/tags
 */
export const POST = async (request: NextRequest) => {
  try {
    const user = await authenticateUser();
    const body = await request.json();
    
    // バリデーション
    const validationResult = CreateTagRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        ResBuilder.error(AppErrorCodes.TASK_VALIDATION_ERROR)
          .withDescription(validationResult.error.errors[0].message)
          .build(),
        { status: 400 }
      );
    }
    
    const tag = await tagService.createTag(validationResult.data, user);
    
    return NextResponse.json(
      ResBuilder.success(tag).build(),
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