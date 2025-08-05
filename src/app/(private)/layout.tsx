import { SidebarProvider, SidebarTrigger } from "@/app/_components/ui/sidebar";
import { AppSidebar } from "@/app/_components/sidebar/AppSidebar";

type Props = {
  children: React.ReactNode;
};

const PrivateLayout: React.FC<Props> = async (props) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger className="fixed top-2 left-2 z-50 grid size-fit place-items-center rounded-full bg-white/80 p-3 backdrop-blur-sm md:hidden" />
      <main className="mx-auto max-w-3xl px-4 pt-12">{props.children}</main>
    </SidebarProvider>
  );
};

export default PrivateLayout;
