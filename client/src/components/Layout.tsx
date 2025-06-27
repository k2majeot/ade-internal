import { Outlet } from "react-router-dom";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Toaster } from "@/components/ui/sonner";

export default function Layout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <main className="flex flex-col flex-1">
          <SidebarTrigger />
          <div className="flex justify-center flex-1">
            <Outlet />
          </div>
        </main>
        <Toaster />
      </div>
    </SidebarProvider>
  );
}
