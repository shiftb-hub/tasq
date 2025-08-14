import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/app/_components/ui/sidebar";
import { AppSidebar } from "@/app/_components/sidebar/AppSidebar";

type Props = {
  children: React.ReactNode;
};

const PrivateLayout: React.FC<Props> = (props) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SidebarTrigger className="fixed top-2 left-2 z-50 grid size-fit place-items-center rounded-full bg-white/80 p-3 opacity-90 backdrop-blur-sm md:hidden" />
        {props.children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default PrivateLayout;
