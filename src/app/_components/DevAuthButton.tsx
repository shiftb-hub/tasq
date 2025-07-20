"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/app/_libs/supabase/browserClient";
import { Button } from "@/app/_components/ui/button";
import type { User } from "@supabase/supabase-js";
import { mutate } from "swr";

// 開発テスト用
export const DevAuthButton: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabaseClient = createSupabaseBrowserClient();

    // 初期ユーザ状態を取得
    const getInitialUser = async () => {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();
      setUser(user);
      setIsLoading(false);
    };
    getInitialUser();

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async () => {
    setIsSubmitting(true);

    try {
      if (user) {
        // ログイン済みの場合：ログアウト処理
        const supabaseClient = createSupabaseBrowserClient();
        const { error } = await supabaseClient.auth.signOut();
        if (!error) {
          mutate(null);
          router.refresh();
          router.push("/");
          return;
        }
        console.error("ログアウトの失敗。", JSON.stringify(error, null, 2));
      } else {
        // ログインしていない場合：ログインページに遷移
        router.push("/login");
      }
    } catch (error) {
      console.error("予期せぬ認証の失敗。", JSON.stringify(error, null, 2));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Button type="button" disabled>
        読み込み中...
      </Button>
    );
  }

  return (
    <Button
      type="button"
      onClick={handleAuth}
      className="w-full"
      disabled={isSubmitting}
    >
      {user ? `${user.email} を ログアウト` : "ログイン"}
    </Button>
  );
};
