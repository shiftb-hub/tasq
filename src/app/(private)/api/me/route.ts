import prisma from "@/app/_libs/prisma";
import { NextResponse } from "next/server";
import { authenticateAppUser } from "@/app/_libs/authenticateUser";
import { UserService } from "@/app/_services/userService";
import { ApiResponseBuilder as ResBuilder } from "@/app/_types/ApiResponse";
import { AppErrorCodes } from "@/app/_types/AppErrorCodes";
import {
  SupabaseUserNotFoundError,
  AppUserNotFoundError,
} from "@/app/_libs/errors";

export const dynamic = "force-dynamic";

/**
 * 現在のユーザー情報を取得するAPI
 *
 * @returns 現在のユーザー情報
 */
export const GET = async () => {
  try {
    const appUser = await authenticateAppUser();
    const userService = new UserService(prisma);
    const user = await userService.getById(appUser.id);

    if (!user) {
      throw new AppUserNotFoundError(appUser.id);
    }

    return NextResponse.json(ResBuilder.success(user).build());
  } catch (e) {
    console.error("ユーザー情報取得エラー:", e);

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

    return NextResponse.json(
      ResBuilder.error()
        .withDescription("ユーザー情報の取得に失敗しました")
        .withMetadata({ error: e })
        .build(),
    );
  }
};
