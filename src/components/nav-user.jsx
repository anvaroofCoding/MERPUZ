import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
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
import { Link, useNavigate } from "react-router-dom";
import { Skeleton } from "./ui/skeleton";

export function NavUser({ data, isLoading }) {
  const navigate = useNavigate();
  const { isMobile } = useSidebar();
  const user = Array.isArray(data) && data.length ? data[0] : null;
  const MainTitle = "Mening profilim";
  const SubTitle = user?.username;
  const count = data?.length;

  const exit = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("life");
    navigate("no-token-and-go-login");
  };
  return (
    <SidebarMenu>
      {count > 1 ? (
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {/* Trigger: avatar + text */}
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                {isLoading ? (
                  // skeleton uchun flex qator
                  <div className="flex items-center gap-3 w-full">
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="w-6 h-6 rounded" />
                  </div>
                ) : (
                  // haqiqiy kontent
                  <>
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src="/admin.jpg" alt="admin" />
                      <AvatarFallback className="rounded-lg">AD</AvatarFallback>
                    </Avatar>

                    <div className="grid flex-1 text-left text-sm leading-tight mx-2">
                      <span className="truncate font-medium">Admin</span>
                      <span className="truncate text-xs">Umumiy boshqaruv</span>
                    </div>

                    <ChevronsUpDown className="ml-auto size-4" />
                  </>
                )}
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            {/* Menu content */}
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  {isLoading ? (
                    <>
                      <Skeleton className="h-10 w-8 rounded-lg" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </>
                  ) : (
                    <>
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src="/admin.jpg" alt="admin" />
                        <AvatarFallback className="rounded-lg">
                          AD
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">Admin</span>
                        <span className="truncate text-xs">
                          Umumiy boshqaruv
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              {/* Guruh 1 */}
              <DropdownMenuGroup>
                {isLoading ? (
                  // loading paytida menyu skeleton elementlari
                  <>
                    <div className="px-3 py-2">
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </>
                ) : (
                  <DropdownMenuItem>
                    <Sparkles className="mr-2" />
                    Upgrade to Pro
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              {/* Guruh 2 */}
              <DropdownMenuGroup>
                {isLoading ? (
                  <div className="px-3 py-2 grid gap-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ) : (
                  <>
                    <DropdownMenuItem>
                      <BadgeCheck className="mr-2" />
                      Profil
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CreditCard className="mr-2" />
                      Billing
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Bell className="mr-2" />
                      Notifications
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              {isLoading ? (
                <div className="px-3 py-2">
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : (
                <button className="w-full h-full" onClick={exit}>
                  <DropdownMenuItem>
                    <LogOut className="mr-2" />
                    Log out
                  </DropdownMenuItem>
                </button>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      ) : (
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {/* Trigger: avatar + text */}
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                {isLoading ? (
                  // skeleton uchun flex qator
                  <div className="flex items-center gap-3 w-full">
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="w-6 h-6 rounded" />
                  </div>
                ) : (
                  // haqiqiy kontent
                  <>
                    <Avatar className="h-10 w-8 rounded-lg">
                      <AvatarImage src={user?.photo} alt={user?.username} />
                      <AvatarFallback className="rounded-lg">
                        {user?.username?.charAt(0) ?? "CN"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="grid flex-1 text-left text-sm leading-tight mx-2">
                      <span className="truncate font-medium">
                        {user?.username}
                      </span>
                      <span className="truncate text-xs">{user?.rahbari}</span>
                    </div>

                    <ChevronsUpDown className="ml-auto size-4" />
                  </>
                )}
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            {/* Menu content */}
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  {isLoading ? (
                    <>
                      <Skeleton className="h-10 w-8 rounded-lg" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </>
                  ) : (
                    <>
                      <Avatar className="h-10 w-8 rounded-lg">
                        <AvatarImage src={user?.photo} alt={user?.username} />
                        <AvatarFallback className="rounded-lg">
                          {user?.username?.charAt(0) ?? "CN"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">
                          {user?.username}
                        </span>
                        <span className="truncate text-xs">
                          {user?.rahbari}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              {/* Guruh 1 */}
              <DropdownMenuGroup>
                {isLoading ? (
                  // loading paytida menyu skeleton elementlari
                  <>
                    <div className="px-3 py-2">
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </>
                ) : (
                  <DropdownMenuItem>
                    <Sparkles className="mr-2" />
                    Upgrade to Pro
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              {/* Guruh 2 */}
              <DropdownMenuGroup>
                {isLoading ? (
                  <div className="px-3 py-2 grid gap-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ) : (
                  <>
                    <Link to={`/me/${MainTitle}/${SubTitle}/${user?.id}`}>
                      <DropdownMenuItem>
                        <BadgeCheck className="mr-2" />
                        Profil
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem>
                      <CreditCard className="mr-2" />
                      Billing
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Bell className="mr-2" />
                      Notifications
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              {isLoading ? (
                <div className="px-3 py-2">
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : (
                <button className="w-full h-full" onClick={exit}>
                  <DropdownMenuItem>
                    <LogOut className="mr-2" />
                    Log out
                  </DropdownMenuItem>
                </button>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      )}
    </SidebarMenu>
  );
}
