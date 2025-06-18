import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="w-full">
        <div className="flex flex-col">
          <div className="flex items-center justify-between bg-[var(--color-sidebar)]">
            <SidebarTrigger />
            <img src="/favicon.svg" alt="Logo" className="h-6 w-6 mx-4" />
          </div>
          <div className="flex justify-center w-full">
            <Outlet />
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}
