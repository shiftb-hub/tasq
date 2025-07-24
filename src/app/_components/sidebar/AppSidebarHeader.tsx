import { GraduationCap } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/app/_components/ui/sidebar";

export const AppSidebarHeader: React.FC = () => (
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton size="lg" asChild>
        <a href="#" className="flex items-center gap-2">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <GraduationCap className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">TASQ</span>
            <span className="truncate text-xs">学習記録アプリ</span>
          </div>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
);
