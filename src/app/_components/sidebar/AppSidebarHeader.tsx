"use client";
import { SidebarTrigger, useSidebar } from "@/app/_components/ui/sidebar";

export const AppSidebarHeader: React.FC = () => {
  const { state } = useSidebar();
  return (
    <div className="mt-2 mb-4 flex items-center gap-2 px-2.5">
      <SidebarTrigger />
      {state === "expanded" && (
        <span className="text-sidebar-foreground font-serif text-xl font-bold tracking-tight">
          TASQ
        </span>
      )}
    </div>
  );
};
