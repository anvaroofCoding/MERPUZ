import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";

export function NavMain({ items, userRole }) {
  const navigate = useNavigate();

  // 🔐 Role filter
  const filteredItems = items
    .map((item) => {
      // Sub itemsni role bo'yicha filter qilamiz
      const filteredSubItems = item.items?.filter((sub) =>
        sub.roles?.includes(userRole),
      );
      // Agar subItems bo‘sh bo‘lsa, parent ham bo‘lmasin
      if (!filteredSubItems || filteredSubItems.length === 0) return null;

      return { ...item, items: filteredSubItems };
    })
    .filter(Boolean); // null bo'lganlarni olib tashlash

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menyular</SidebarGroupLabel>
      <SidebarMenu>
        {filteredItems.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <button
                          onClick={() =>
                            navigate(
                              `${subItem.url}/${item.title}/${subItem.title}`,
                            )
                          }
                          className="w-full text-left"
                        >
                          <span>{subItem.title}</span>
                        </button>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
