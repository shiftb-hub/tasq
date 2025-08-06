import { SidebarProvider, SidebarTrigger } from "@/app/_components/ui/sidebar";
import { AppSidebar } from "@/app/_components/sidebar/AppSidebar";

type Props = {
  children: React.ReactNode;
};

const PrivateLayout: React.FC<Props> = (props) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger className="fixed top-2 left-2 z-50 grid size-fit place-items-center rounded-full bg-white/80 p-3 backdrop-blur-sm md:hidden" />
      <main className="mx-auto w-full px-4 py-8">{props.children}</main>
    </SidebarProvider>
  );
};

export default PrivateLayout;
