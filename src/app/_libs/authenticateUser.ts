import { createSupabaseServerClient } from "@/app/_libs/supabase/serverClient";
import { User } from "@supabase/supabase-js";
import { SupabaseUserNotFoundError } from "@/app/_libs/errors";
import { UserService } from "@/app/_services/userService";
import prisma from "@/app/_libs/prisma";

const getSupabaseUserOrNull = async (): Promise<User | null> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  return error || !data?.user ? null : data.user;
};

/**
 * Supabaseのセッション情報をもとに、認証済みのユーザー情報を取得する関数。
 *
 * この関数はサーバー上でSupabaseの認証セッションを確認し、ユーザー情報を取得します。
 * セッションが無効、またはユーザー情報が取得できない場合は SupabaseUserNotFoundError をスローします。
 *
 * @returns 認証済みSupabaseユーザー情報（User オブジェクト）
 * @throws SupabaseUserNotFoundError - ユーザーが存在しない、もしくはセッションが無効な場合
 */
export const authenticateSupabaseUser = async (): Promise<User> => {
  const user = await getSupabaseUserOrNull();
  if (!user) throw new SupabaseUserNotFoundError();
  return user;
};

/**
 * Supabaseのセッション情報をもとに、認証済みのユーザー情報を取得する関数（存在しない場合は null を返す）。
 *
 * この関数はサーバー上でSupabaseの認証セッションを確認し、ユーザー情報を取得します。
 * セッションが無効、またはユーザー情報が取得できない場合は null を返します。
 *
 * @returns 認証済みSupabaseユーザー情報（User オブジェクト）、または null
 */
export const maybeAuthenticateSupabaseUser = getSupabaseUserOrNull;

/**
 * Supabase上の認証に成功したユーザーに対応する、アプリケーション側のユーザーデータを取得する関数。
 *
 * Supabaseで認証されたユーザーIDを用いて、アプリケーションのデータベースから該当するユーザー情報を取得します。
 * アプリケーションのユーザー情報が存在しない場合、
 * UserService の getById メソッドでAppUserNotFoundError がスローされます。
 *
 * @returns アプリケーションのユーザー情報（独自の User モデルなど）
 * @throws SupabaseUserNotFoundError - Supabaseのセッションが無効またはユーザーが取得できない場合
 * @throws AppUserNotFoundError - Appユーザーが見つからない場合
 */
export const authenticateAppUser = async () => {
  const supabaseUser = await authenticateSupabaseUser();
  const userService = new UserService(prisma);
  const appUser = await userService.getById(supabaseUser.id);
  return appUser;
};
