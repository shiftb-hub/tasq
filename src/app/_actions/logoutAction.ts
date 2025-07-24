"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/app/_libs/supabase/serverClient";
import { redirect } from "next/navigation";

/**
 * ユーザーログアウトを処理する Server Action
 * セッション確認後にSupabaseからログアウトし、成功・失敗に関わらずホームページにリダイレクトする
 *
 * @returns 常にホームページにリダイレクト（never）
 */
export const logoutAction = async () => {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    // 未ログイン状態であれば処理をスキップ
    if (session) {
      const { error } = await supabase.auth.signOut();
      if (error) console.error("ログアウト処理に失敗。", error.message);
    }
  } catch (e) {
    console.error("ログアウト処理に失敗。", JSON.stringify(e, null, 2));
  }
  revalidatePath("/", "layout");
  redirect("/");
};
