import {
  AudioWaveform,
  BellRing,
  BrainCog,
  Command,
  FileText,
  GalleryVerticalEnd,
  Gauge,
  ListPlus,
  NotebookPen,
  ScrollText,
  Settings2,
  Users,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useMEQuery } from "@/services/api";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export function AppSidebar({ ...props }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");
  if (!token) {
    navigate("/no-token-and-go-login");
  }
  const { data: supper, isLoading } = useMEQuery();
  const { t } = useTranslation();
  const data = {
    teams: [
      {
        name: "Acme Inc",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
      },
      {
        name: "Acme Corp.",
        logo: AudioWaveform,
        plan: "Startup",
      },
      {
        name: "Evil Corp.",
        logo: Command,
        plan: "Free",
      },
    ],
    navMain: [
      {
        title: t("20_20251120"),
        url: "",
        icon: Gauge,
        isActive: true,
        items: [
          {
            title: t("21_20251120"),
            url: "/Kompleks",
          },
        ],
      },
      {
        title: t("24_20251120"),
        url: "#",
        icon: ScrollText,
        items: [
          {
            title: "Arizalar Yuborish",
            url: "Arizalar",
          },
          {
            title: t("25_20251120"),
            url: "Kelgan-Arizalar",
          },
        ],
      },
      {
        title: t("26_20251120"),
        url: "#",
        icon: NotebookPen,
        items: [
          {
            title: "Yillik reja",
            url: "yil",
          },
          {
            title: "Oylik reja",
            url: "oy",
          },
        ],
      },
      {
        title: t("29_20251120"),
        url: "#",
        icon: ListPlus,
        items: [
          {
            title: t("31_20251120"),
            url: "PPRlar",
          },
          {
            title: t("32_20251120"),
            url: "Obyektlar",
          },
        ],
      },
      {
        title: t("33_20251120"),
        url: "#",
        icon: FileText,
        items: [
          {
            title: t("34_20251120"),
            url: "#",
          },
          {
            title: t("35_20251120"), // 1-zayavkalar - 2-PPR
            url: "#",
          },
        ],
      },
    ],
    projects: [
      {
        name: t("36_20251120"),
        url: "#",
        icon: BellRing,
      },
      {
        name: t("37_20251120"),
        url: "#",
        icon: BrainCog,
      },
      {
        name: "Foydalanuvchilar",
        url: "/foydalanuvchilar",
        icon: Users,
      },
      {
        name: "Dastur haqida",
        url: "/Programm",
        icon: Settings2,
      },
      {
        name: t("38_20251120"),
        url: "/Sozlamalar",
        icon: Settings2,
      },
    ],
  };
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser data={supper} isLoading={isLoading} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
