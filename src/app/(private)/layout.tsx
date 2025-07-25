import { SidebarProvider } from "@/app/_components/ui/sidebar";
import { AppSidebar } from "@/app/_components/sidebar/AppSidebar";

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>{children}</main>
    </SidebarProvider>
  );
};

export default Layout;
