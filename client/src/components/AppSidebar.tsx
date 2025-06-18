"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Home,
  Table,
  Search,
  Settings as SettingsIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import SettingsDialog from "@/pages/Settings/Settings"; // ⬅️ full component with trigger removed

const items = [
  { title: "Home", url: "/", icon: Home },
  { title: "Data Sheet", url: "/data", icon: Table },
  { title: "Attendance", url: "/attendance", icon: Calendar },
];

export function AppSidebar() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Adult Day Experiences</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}

                {/* Settings: dialog-triggering row */}
                <SidebarMenuItem>
                  <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                    <DialogTrigger asChild>
                      <SidebarMenuButton>
                        <div className="flex items-center gap-2">
                          <SettingsIcon className="h-4 w-4" />
                          <span>Settings</span>
                        </div>
                      </SidebarMenuButton>
                    </DialogTrigger>

                    {/* SettingsDialog must exclude <Dialog> wrapper and be content only */}
                    <DialogContent className="overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
                      <DialogTitle className="sr-only">Settings</DialogTitle>
                      <DialogDescription className="sr-only">
                        Settings menu
                      </DialogDescription>
                      <SettingsDialog />
                    </DialogContent>
                  </Dialog>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
}
