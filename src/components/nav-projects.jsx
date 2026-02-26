"use client";

import {
  useSidebar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";

export function NavProjects({ projects, userRole }) {
  const { isMobile } = useSidebar();
  const navigate = useNavigate();

  // 🔐 Role filter
  const filteredProjects = projects.filter((project) =>
    project.roles?.includes(userRole),
  );

  if (filteredProjects.length === 0) return null; // Hech narsa bo'lmasa ko'rsatmaslik

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Yordamchi menyular</SidebarGroupLabel>
      <SidebarMenu>
        {filteredProjects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <button onClick={() => navigate(`${item.url}/${item.name}`)}>
                {item.icon && <item.icon />}
                <span>{item.name}</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
