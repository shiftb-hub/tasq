import {
  BookOpen,
  BarChart,
  Users,
  AlertCircle,
  ClipboardList,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarRail,
} from "@/app/_components/ui/sidebar";
import { AppSidebarHeader } from "@/app/_components/sidebar/AppSidebarHeader";
import { AppSidebarFooter } from "@/app/_components/sidebar/AppSidebarFooter";
import { CustomSidebarGroup } from "@/app/_components/sidebar/CustomSidebarGroup";
import { authenticateAppUser } from "@/app/_libs/authenticateUser";

export const AppSidebar = async () => {
  const user = await authenticateAppUser();

  const navGroups = [
    {
      label: "メイン",
      items: [
        { title: "タスク一覧", url: "/tasks", icon: ClipboardList },
        { title: "学習グラフ", url: "/logBoard", icon: BarChart },
        { title: "学習ログ一覧", url: "/learningLog", icon: BookOpen },
      ],
    },
    // 権限がTA, TEACHER, ADMINのときのみ追加
    ...(user && ["TA", "TEACHER", "ADMIN"].includes(user.role)
      ? [
          {
            label: "講師向け機能",
            items: [
              { title: "受講生一覧", url: "/teacher/students", icon: Users },
              {
                title: "気になるタスク",
                url: "/teacher/tasks",
                icon: AlertCircle,
              },
              {
                title: "受講生別タスク一覧",
                url: "/teacher/tasks",
                icon: ClipboardList,
              },
            ],
          },
        ]
      : []),
  ];

  return (
    <Sidebar collapsible="offcanvas" className="border-r">
      <AppSidebarHeader />
      <SidebarContent>
        {navGroups.map((group) => (
          <CustomSidebarGroup
            key={group.label}
            label={group.label}
            items={group.items}
          />
        ))}
      </SidebarContent>
      <AppSidebarFooter user={user} />
      <SidebarRail />
    </Sidebar>
  );
};
