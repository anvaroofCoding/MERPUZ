import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  LogOut,
  Moon,
  Sun,
  X,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { Skeleton } from "./ui/skeleton";
import { Switch } from "./ui/switch";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";

export function NavUser({ data, isLoading }) {
  const [open, setOpen] = useState(false);
  const { isMobile } = useSidebar();
  const MainTitle = "Mening profilim";
  const { theme, toggleTheme } = useTheme();

  const exit = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("life");
    window.location.pathname = "/no-token-and-go-login";
  };

  const username = data?.username || "Admin";
  const photo = data?.photo || "/admin.jpg";
  const role = data?.faoliyati || "Umumiy boshqaruv";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {isLoading ? (
                <div className="flex items-center gap-3 w-full">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="w-6 h-6 rounded" />
                </div>
              ) : (
                <>
                  <Avatar className="h-8 w-8 rounded-full">
                    <AvatarImage src={photo} alt={username} />
                    <AvatarFallback>
                      {username?.charAt(0) ?? "A"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="grid flex-1 text-left text-sm leading-tight mx-2">
                    <span className="truncate font-medium">{username}</span>
                    <span className="truncate text-xs">{role}</span>
                  </div>

                  <ChevronsUpDown className="ml-auto size-4" />
                </>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-2 py-2">
                <Avatar className="h-8 w-8 rounded-full">
                  <AvatarImage src={photo} />
                  <AvatarFallback>{username?.charAt(0) ?? "A"}</AvatarFallback>
                </Avatar>

                <div className="grid flex-1 text-sm">
                  <span className="font-medium">{username}</span>
                  <span className="text-xs text-muted-foreground">{role}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* DARK MODE */}
            <DropdownMenuGroup>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
                  Dark mode
                </span>

                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={toggleTheme}
                />
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* MENU */}
            <DropdownMenuGroup>
              <Link to={`/me/${MainTitle}/${username}/${data?.id}`}>
                <DropdownMenuItem>
                  <BadgeCheck className="mr-2" />
                  Profil
                </DropdownMenuItem>
              </Link>

              <DropdownMenuItem>
                <Bell className="mr-2" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={exit}
              className={
                "bg-red-600 hover:bg-red-700 duration-300 text-white focus:bg-red-600 focus:text-white/60"
              }
            >
              <LogOut className="mr-2 text-white " />
              Chiqish
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* MANUAL CLOSE */}
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setOpen(false);
              }}
              className="justif"
            >
              <X />
              Yopish
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
