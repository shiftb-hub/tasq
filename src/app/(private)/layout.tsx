import { SidebarProvider, SidebarTrigger } from "@/app/_components/ui/sidebar";
import { AppSidebar } from "@/app/_components/sidebar/AppSidebar";
import { AppSidebarHeader } from "../_components/sidebar/AppSidebarHeader";

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger className="fixed top-2 left-2 z-50 grid size-fit place-items-center rounded-full bg-white/80 p-3 backdrop-blur-sm md:hidden" />
      <main className="mx-auto pt-12">{children}</main>
    </SidebarProvider>
  );
};

export default Layout;
