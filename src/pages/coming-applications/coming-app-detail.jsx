import { useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useComingaplication2Query } from "@/services/api";
import Application_details_Main from "./coming-app-main";

export default function Aplication_Detail() {
  const [selectedTab, setSelectedTab] = useState("all");
  const { id } = useParams();
  const [mainID, setMainID] = useState(id);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { data, isLoading } = useComingaplication2Query({
    search,
    status: selectedTab,
  });

  const [leftWidth, setLeftWidth] = useState(500); // boshlang'ich chap panel width
  const [isResizing, setIsResizing] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showRightPanel, setShowRightPanel] = useState(false);

  const statusTabs = [
    { label: "Hammasi", value: "all" },
    { label: "Jarayonda", value: "jarayonda" },
    { label: "Qabul qilindi", value: "qabul_qilindi" },
    { label: "Bajarilgan", value: "bajarilgan" },
    { label: "Qaytarilgan", value: "qaytarildi" },
  ];

  const statusVariantMap = {
    bajarilgan: "success",
    qaytarildi: "destructive",
    "qabul qilindi": "default",
    jarayonda: "warning",
  };

  const startResize = () => !isMobile && setIsResizing(true);
  const stopResize = () => setIsResizing(false);

  const handleResize = (e) => {
    if (isResizing && !isMobile) {
      const newWidth = e.clientX;
      if (newWidth > 250 && newWidth < 550) setLeftWidth(newWidth); // min-max
    }
  };

  // mousemove listener & responsive listener
  useState(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("mousemove", handleResize);
    window.addEventListener("mouseup", stopResize);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleResize);
      window.removeEventListener("mouseup", stopResize);
      window.removeEventListener("resize", handleResize);
    };
  });

  return (
    <div className="flex h-[85vh] gap-2 overflow-hidden bg-background">
      {/* LEFT PANEL */}
      <div
        className={cn(
          "flex flex-col  transition-all duration-300",
          isMobile ? (showRightPanel ? "hidden" : "w-full") : "bg-background",
        )}
        style={{
          width: isMobile ? undefined : leftWidth,
          height: "85vh",
          maxHeight: "85vh",
        }}
      >
        {/* HEADER */}
        <div className="sticky top-0 z-10 bg-background pb-3  space-y-3 border-b">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-sm font-semibold flex-1">Kelgan arizalar</h2>
          </div>

          {/* SEARCH */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-9 text-sm"
            />
          </div>

          {/* TABS - SCROLLABLE */}
          <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 py-1">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="w-full justify-start gap-1 bg-transparent p-0">
                {statusTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="whitespace-nowrap text-xs px-3 py-1.5"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* LIST - SCROLLABLE */}
        <div className="flex-1 min-h-0 ">
          <ScrollArea className="h-full overflow-y-auto pr-1">
            {isLoading
              ? Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-3 py-3 border-b"
                  >
                    <Skeleton className="w-11 h-11 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2 min-w-0">
                      <Skeleton className="h-4 w-[60%]" />
                      <Skeleton className="h-3 w-[80%]" />
                    </div>
                  </div>
                ))
              : data?.results?.map((item) => {
                  const isActive = mainID === item.id;
                  const firstLetter =
                    item?.kim_tomonidan?.name?.charAt(0)?.toUpperCase() || "?";

                  return (
                    <div
                      key={item.id}
                      onClick={() => setMainID(item.id)}
                      className={cn(
                        "group relative flex items-center gap-3 px-3 py-3 cursor-pointer transition-all duration-200 rounded-lg border-b",
                        "hover:bg-accent/50",
                        isActive && "bg-accent border-l-4 border-l-blue-500",
                      )}
                    >
                      <div className="relative flex-shrink-0">
                        <div className="w-11 h-11 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-base shadow-sm">
                          {firstLetter}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium text-sm truncate">
                            {item?.kim_tomonidan?.name}
                          </p>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {item?.sana}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2 mt-1">
                          <p className="text-xs text-muted-foreground truncate">
                            {item?.comment.slice(0, 30) + "..."}
                          </p>
                          <Badge
                            size="sm"
                            variant={statusVariantMap[item.status] || "outline"}
                            className="text-[10px] px-2 py-0.5 capitalize flex-shrink-0"
                          >
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
          </ScrollArea>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div
        className={cn(
          "flex flex-col transition-all duration-300",
          isMobile ? (showRightPanel ? "w-full" : "hidden") : "flex-1",
          "h-full md:h-[85vh] overflow-hidden",
        )}
      >
        {/* MOBILE BACK BUTTON */}
        {isMobile && showRightPanel && (
          <div className="flex items-center gap-2 px-4 py-3 border-b bg-background">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowRightPanel(false)}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-sm font-semibold">Tafsilotlar</h2>
          </div>
        )}
        <div className="flex-1 overflow-hidden">
          <Application_details_Main id={mainID} />
        </div>
      </div>
    </div>
  );
}
