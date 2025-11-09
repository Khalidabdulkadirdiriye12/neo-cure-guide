import { Activity, Image, Stethoscope, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import { NeuralNexusLogo } from "@/components/NeuralNexusLogo";
import { useAuth } from "@/contexts/AuthContext";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  SidebarHeader,
} from "@/components/ui/sidebar";

const items = [
  { title: "Treatment Recommender", url: "/", icon: Stethoscope, requireAdmin: false },
  { title: "Tumor Detection", url: "/tumor-detection", icon: Image, requireAdmin: false },
  { title: "Survival Prediction", url: "/survival-prediction", icon: Activity, requireAdmin: false },
  { title: "Patient Management", url: "/patient-management", icon: Users, requireAdmin: true },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const { isAdmin } = useAuth();

  // Filter items based on user role
  const visibleItems = items.filter(item => !item.requireAdmin || isAdmin);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-3">
          <NeuralNexusLogo className={open ? "w-10 h-10" : "w-8 h-8"} />
          {open && (
            <div>
              <h2 className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">
                Neural Nexus
              </h2>
              <p className="text-xs text-muted-foreground">AI Healthcare</p>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>AI Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink 
                      to={item.url}
                      className={({ isActive }) =>
                        isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : ""
                      }
                    >
                      <item.icon />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
