import { SidebarProvider, SidebarInset } from "@/app/_components/ui/sidebar";
import { AppSidebar } from "@/app/_components/sidebar/AppSidebar";

type Props = {
  children: React.ReactNode;
};

const PrivateLayout: React.FC<Props> = (props) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{props.children}</SidebarInset>
    </SidebarProvider>
  );
};

export default PrivateLayout;
