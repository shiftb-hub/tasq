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
import { Role } from "@prisma/client";

const MAIN_NAV_ITEMS = [
  { title: "タスク一覧", url: "/tasks", icon: ClipboardList },
  { title: "学習グラフ", url: "/logBoard", icon: BarChart },
  { title: "学習ログ一覧", url: "/learning-logs", icon: BookOpen },
  { title: "受講生一覧", url: "/students", icon: Users },
];

const TEACHER_NAV_ITEMS = [
  {
    title: "気になるタスク",
    url: "/teacher/tasks",
    icon: AlertCircle,
  },
];

export const AppSidebar = async () => {
  const user = await authenticateAppUser();

  const navGroups = [
    {
      label: "メイン",
      items: MAIN_NAV_ITEMS,
    },
    // 権限がSTUDENT以外のとき（＝TA,TEACHER,ADMINのとき）のみ追加
    ...(user.role !== Role.STUDENT
      ? [
          {
            label: "講師向け機能",
            items: TEACHER_NAV_ITEMS,
          },
        ]
      : []),
  ];

  return (
    <Sidebar collapsible="icon" className="border-r">
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
