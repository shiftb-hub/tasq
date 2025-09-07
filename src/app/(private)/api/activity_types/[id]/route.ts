import { NextRequest, NextResponse } from "next/server";
import { authenticateAppUser as authenticateUser } from "@/app/_libs/authenticateUser";
import { ApiResponseBuilder as ResBuilder } from "@/app/_types/ApiResponse";
import { AppErrorCodes } from "@/app/_types/AppErrorCodes";
import { dumpError } from "@/app/_libs/dumpException";
import { UpdateActivityTypeRequestSchema } from "@/app/_types/ActivityTypeRequest";
import * as activityTypeService from "@/app/_services/activityTypeService";
export const dynamic = "force-dynamic";

type Props = {
  params: { id: string };
};

export const GET = async (_req: NextRequest, { params }: Props) => {
  try {
    await authenticateUser();
    const at = await activityTypeService.getActivityType(params.id);
    return NextResponse.json(ResBuilder.success(at).build());
  } catch (error) {
    dumpError(error, "ActivityType operation");
    
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
    
    if (error instanceof Error && error.message === AppErrorCodes.ACTIVITY_TYPE_NOT_FOUND) {
      return NextResponse.json(
        ResBuilder.error(AppErrorCodes.ACTIVITY_TYPE_NOT_FOUND).withDescription("ActivityType not found").build(),
        { status: 404 },
      );
    }
    return NextResponse.json(
      ResBuilder.error(AppErrorCodes.INTERNAL_SERVER_ERROR).withDescription("An unexpected error occurred").build(),
      { status: 500 },
    );
  }
};

export const PUT = async (request: NextRequest, { params }: Props) => {
  try {
    const user = await authenticateUser();
    const body = await request.json();
    const validation = UpdateActivityTypeRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        ResBuilder.error(AppErrorCodes.TASK_VALIDATION_ERROR)
          .withDescription(validation.error.errors[0].message)
          .build(),
        { status: 400 },
      );
    }
    const updated = await activityTypeService.updateActivityType(params.id, validation.data, user);
    return NextResponse.json(ResBuilder.success(updated).build());
  } catch (error) {
    dumpError(error, "ActivityType operation");
    
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
    
    if (error instanceof Error) {
      if (error.message === AppErrorCodes.ADMIN_REQUIRED) {
        return NextResponse.json(
          ResBuilder.error(AppErrorCodes.ADMIN_REQUIRED).withDescription("Admin privileges required").build(),
          { status: 403 },
        );
      }
      if (error.message === AppErrorCodes.ACTIVITY_TYPE_NOT_FOUND) {
        return NextResponse.json(
          ResBuilder.error(AppErrorCodes.ACTIVITY_TYPE_NOT_FOUND).withDescription("ActivityType not found").build(),
          { status: 404 },
        );
      }
    }
    return NextResponse.json(
      ResBuilder.error(AppErrorCodes.INTERNAL_SERVER_ERROR).withDescription("An unexpected error occurred").build(),
      { status: 500 },
    );
  }
};

export const DELETE = async (_req: NextRequest, { params }: Props) => {
  try {
    const user = await authenticateUser();
    await activityTypeService.deleteActivityType(params.id, user);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    dumpError(error, "ActivityType operation");
    
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
    
    if (error instanceof Error) {
      if (error.message === AppErrorCodes.ADMIN_REQUIRED) {
        return NextResponse.json(
          ResBuilder.error(AppErrorCodes.ADMIN_REQUIRED).withDescription("Admin privileges required").build(),
          { status: 403 },
        );
      }
      if (error.message === AppErrorCodes.ACTIVITY_TYPE_NOT_FOUND) {
        return NextResponse.json(
          ResBuilder.error(AppErrorCodes.ACTIVITY_TYPE_NOT_FOUND).withDescription("ActivityType not found").build(),
          { status: 404 },
        );
      }
      if (error.message === AppErrorCodes.ACTIVITY_TYPE_IN_USE) {
        return NextResponse.json(
          ResBuilder.error(AppErrorCodes.ACTIVITY_TYPE_IN_USE).withDescription("ActivityType is in use").build(),
          { status: 409 },
        );
      }
    }
    return NextResponse.json(
      ResBuilder.error(AppErrorCodes.INTERNAL_SERVER_ERROR).withDescription("An unexpected error occurred").build(),
      { status: 500 },
    );
  }
};