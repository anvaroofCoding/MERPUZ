import { useSidebar } from "@/context/sidebar-context";
import { cn } from "@/lib/utils";

export default function AppSidebar() {
  const { position, collapsed, width } = useSidebar();

  return (
    <aside
      className={cn(
        "fixed top-0 h-screen bg-background border z-40 transition-all",
        position === "left" ? "left-0" : "right-0",
      )}
      style={{
        width: collapsed ? 72 : width,
      }}
    >
      <div className="p-4 font-semibold">Sidebar</div>
    </aside>
  );
}
