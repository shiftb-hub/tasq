"use client";

import { ChevronUp, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/app/_components/ui/sidebar";
import type { User } from "@prisma/client";
import { logoutAction } from "@/app/_actions/logoutAction";
import Link from "next/link";
import { UserAvatar } from "./UserAvatar";
import useSWR from "swr";
import { api } from "@/app/_libs/api";
import { ApiResponse } from "@/app/_types/ApiResponse";

interface Props {
  user: User;
}

/**
 * ユーザー情報を取得するフェッチャー関数
 */
const fetcher = async (url: string): Promise<User> => {
  const res = await api.get<ApiResponse<User>>(url);
  if (res.success) {
    return res.payload;
  }
  throw res.error;
};

export const AppSidebarFooter: React.FC<Props> = ({ user: initialUser }) => {
  const { data, error } = useSWR<User>("/api/me", fetcher, {
    fallbackData: initialUser,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000,
  });

  if (error) {
    console.error("ユーザー情報取得エラー:", JSON.stringify(error, null, 2));
  }

  // SWR の fetcher が undefined を返した場合は initialUser にフォールバック
  const user: User = data ?? initialUser;

  const handleLogout = async () => {
    try {
      await logoutAction();
    } catch (error) {
      console.error("ログアウトに失敗しました:", error);
    }
  };
  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <UserAvatar user={user} />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                </div>
                <ChevronUp className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side="bottom"
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <UserAvatar user={user} />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center gap-2">
                  <Settings />
                  プロフィール設定
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                ログアウト
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
};
