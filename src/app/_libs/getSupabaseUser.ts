import { createSupabaseServerClient } from "@/app/_libs/supabase/serverClient";
import { User } from "@supabase/supabase-js";
import { SupabaseUserNotFoundError } from "@/app/_libs/errors";
import { UserService } from "@/app/_services/userService";
import prisma from "@/app/_libs/prisma";

// バックエンドでSupabaseのユーザー情報を取得するヘルパー関数
export const getSupabaseUser = async (): Promise<User> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    throw new SupabaseUserNotFoundError();
  }
  return data.user;
};

// バックエンドでAppのユーザー情報を取得するヘルパー関数
export const getAppUser = async () => {
  const supabaseUser = await getSupabaseUser();
  const userService = new UserService(prisma);
  const appUser = await userService.getById(supabaseUser.id);
  return appUser;
};
