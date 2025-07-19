"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/app/_libs/supabase/browserClient";
import { Button } from "@/app/_components/ui/button";
import type { User } from "@supabase/supabase-js";

export const AuthButton: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabaseClient = createSupabaseBrowserClient();

    // 初期ユーザー状態を取得
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

        if (error) {
          console.error("ログアウトエラー:", error);
        } else {
          router.push("/");
        }
      } else {
        // 未ログインの場合：ログインページに遷移
        router.push("/login"); // ログインページのパスに合わせて調整
      }
    } catch (error) {
      console.error("認証エラー:", error);
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
    <Button type="button" onClick={handleAuth} disabled={isSubmitting}>
      {user ? "ログアウト" : "ログイン"}
    </Button>
  );
};
