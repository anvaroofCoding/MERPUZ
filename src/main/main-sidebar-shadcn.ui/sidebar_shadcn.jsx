import { AppSidebar } from "@/components/app-sidebar";
import Example from "@/components/banner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";

export default function Sidebar_Shadcn() {
  const navigate = useNavigate();
  const access = localStorage.getItem("access");
  const notiv = localStorage.getItem("notiv");
  const params = useParams();
  const [font, setFont] = useState("roboto");
  useEffect(() => {
    const fonts = localStorage.getItem("font");
    setFont(fonts);
  }, []);
  if (!notiv) {
    localStorage.setItem("notiv", "rangli");
  }
  if (!font) {
    localStorage.setItem("font", "roboto");
  }
  if (!access) {
    window.location.href = "/no-token-and-go-login";
  }
  if (!access) {
    navigate("/no-token-and-go-login");
  }

  return (
    <div className={`${font}`}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
            <div className="flex items-center justify-between gap-2 px-4 w-full">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink>{params.MainTitle}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>
                        {params.SubTitle ? params.SubTitle : params.MainTitle}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>
                        {params.than_title ? params.than_title : ""}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
              <Bell />
            </div>
            <Example />
          </header>
          <div className="w-full h-full px-5 py-5">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
