import { NextRequest, NextResponse } from "next/server";
import { authenticateAppUser as authenticateUser } from "@/app/_libs/authenticateUser";
import { ApiResponseBuilder as ResBuilder } from "@/app/_types/ApiResponse";
import { AppErrorCodes } from "@/app/_types/AppErrorCodes";
import { dumpError } from "@/app/_libs/dumpException";
import { UpdateTagRequestSchema } from "@/app/_types/TagRequest";
import * as tagService from "@/app/_services/tagService";

export const dynamic = "force-dynamic";

type Props = {
  params: {
    id: string;
  };
};

/**
 * タグ詳細取得
 * GET /api/tags/[id]
 */
export const GET = async (_req: NextRequest, { params }: Props) => {
  try {
    await authenticateUser();
    const tag = await tagService.getTag(params.id);
    
    return NextResponse.json(
      ResBuilder.success(tag).build()
    );
  } catch (error) {
    dumpError(error, "Tag operation");
    
    // 認証エラーのチェック
    if (
      error instanceof Error &&
      (
        error.message === AppErrorCodes.UNAUTHORIZED ||
        error.message === AppErrorCodes.APP_USER_NOT_FOUND ||
        error.message === AppErrorCodes.SUPABASE_USER_NOT_FOUND
      )
    ) {
      return NextResponse.json(
        ResBuilder.error(AppErrorCodes.UNAUTHORIZED)
          .withDescription("Authentication required")
          .build(),
        { status: 401 }
      );
    }
    
    if (error instanceof Error && error.message === AppErrorCodes.TAG_NOT_FOUND) {
      return NextResponse.json(
        ResBuilder.error(AppErrorCodes.TAG_NOT_FOUND)
          .withDescription("Tag not found")
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
 * タグ更新（ADMINのみ）
 * PUT /api/tags/[id]
 */
export const PUT = async (request: NextRequest, { params }: Props) => {
  try {
    const user = await authenticateUser();
    const body = await request.json();
    
    // バリデーション
    const validationResult = UpdateTagRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        ResBuilder.error(AppErrorCodes.TASK_VALIDATION_ERROR)
          .withDescription(validationResult.error.issues[0].message)
          .build(),
        { status: 400 }
      );
    }
    
    const tag = await tagService.updateTag(params.id, validationResult.data, user);
    
    return NextResponse.json(
      ResBuilder.success(tag).build()
    );
  } catch (error) {
    dumpError(error, "Tag operation");
    
    // 認証エラーのチェック
    if (
      error instanceof Error &&
      (
        error.message === AppErrorCodes.UNAUTHORIZED ||
        error.message === AppErrorCodes.APP_USER_NOT_FOUND ||
        error.message === AppErrorCodes.SUPABASE_USER_NOT_FOUND
      )
    ) {
      return NextResponse.json(
        ResBuilder.error(AppErrorCodes.UNAUTHORIZED)
          .withDescription("Authentication required")
          .build(),
        { status: 401 }
      );
    }
    
    if (error instanceof Error && error.message === AppErrorCodes.ADMIN_REQUIRED) {
      return NextResponse.json(
        ResBuilder.error(AppErrorCodes.ADMIN_REQUIRED)
          .withDescription("Admin privileges required")
          .build(),
        { status: 403 }
      );
    }
    
    if (error instanceof Error && error.message === AppErrorCodes.TAG_NOT_FOUND) {
      return NextResponse.json(
        ResBuilder.error(AppErrorCodes.TAG_NOT_FOUND)
          .withDescription("Tag not found")
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
 * タグ削除（ADMINのみ）
 * DELETE /api/tags/[id]
 */
export const DELETE = async (_req: NextRequest, { params }: Props) => {
  try {
    const user = await authenticateUser();
    await tagService.deleteTag(params.id, user);
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    dumpError(error, "Tag operation");
    
    // 認証エラーのチェック
    if (
      error instanceof Error &&
      (
        error.message === AppErrorCodes.UNAUTHORIZED ||
        error.message === AppErrorCodes.APP_USER_NOT_FOUND ||
        error.message === AppErrorCodes.SUPABASE_USER_NOT_FOUND
      )
    ) {
      return NextResponse.json(
        ResBuilder.error(AppErrorCodes.UNAUTHORIZED)
          .withDescription("Authentication required")
          .build(),
        { status: 401 }
      );
    }
    
    if (error instanceof Error && error.message === AppErrorCodes.ADMIN_REQUIRED) {
      return NextResponse.json(
        ResBuilder.error(AppErrorCodes.ADMIN_REQUIRED)
          .withDescription("Admin privileges required")
          .build(),
        { status: 403 }
      );
    }
    
    if (error instanceof Error && error.message === AppErrorCodes.TAG_NOT_FOUND) {
      return NextResponse.json(
        ResBuilder.error(AppErrorCodes.TAG_NOT_FOUND)
          .withDescription("Tag not found")
          .build(),
        { status: 404 }
      );
    }
    
    if (error instanceof Error && error.message === AppErrorCodes.TAG_IN_USE) {
      return NextResponse.json(
        ResBuilder.error(AppErrorCodes.TAG_IN_USE)
          .withDescription("Tag is in use and cannot be deleted")
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