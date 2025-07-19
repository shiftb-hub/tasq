import prisma from "@/app/_libs/prisma";
import { NextResponse } from "next/server";
import { User, Role } from "@prisma/client";
import { ApiResponseBuilder as ResBuilder } from "@/app/_types/ApiResponse";
import { AppErrorCodes } from "@/app/_types/AppErrorCodes";
import {
  SupabaseUserNotFoundError,
  AppUserNotFoundError,
  UserPermissionDeniedError,
} from "@/app/_libs/errors";
import { authenticateAppUser } from "@/app/_libs/authenticateUser";
import { UserService } from "@/app/_services/userService";

export const dynamic = "force-dynamic";

// ユーザ一覧を取得するAPI（テスト用）
export const GET = async () => {
  try {
    // 認証とユーザ情報の取得
    // 失敗時は SupabaseUserNotFoundError / AppUserNotFoundError がスローされる
    const appUser = await authenticateAppUser();

    // // 必要に応じて権限チェックを行う
    // if (appUser.role === Role.STUDENT) {
    //   throw new UserPermissionDeniedError({
    //     userId: appUser.id,
    //     actualRole: appUser.role,
    //     requiredRole: Role.TA,
    //     action: "get all users",
    //     message: "Students are not allowed to access this resource.",
    //   });
    // }

    const userService = new UserService(prisma);
    const users = await userService.getAll({
      select: {
        id: true,
        name: true,
      },
    });
    return NextResponse.json(ResBuilder.success<User[]>(users).build());
  } catch (e) {
    console.error(e);
    if (
      e instanceof SupabaseUserNotFoundError ||
      e instanceof AppUserNotFoundError
    ) {
      return NextResponse.json(
        ResBuilder.error(AppErrorCodes.UNAUTHORIZED)
          .withDescription(e.message)
          .withMetadata({ error: e })
          .build(),
      );
    }
    if (e instanceof UserPermissionDeniedError) {
      return NextResponse.json(
        ResBuilder.error(AppErrorCodes.USER_PERMISSION_DENIED_ERROR)
          .withDescription(e.message)
          .withMetadata({ error: e })
          .build(),
      );
    }
    return NextResponse.json(
      ResBuilder.error().withMetadata({ error: e }).build(),
    );
  }
};
