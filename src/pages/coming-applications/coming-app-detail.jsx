import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAplication2Query } from "@/services/api";
import { ArrowLeft, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Application_details_Main from "./coming-app-main";

export default function Aplication_Detail() {
  const { id } = useParams();
  const [mainID, setMainID] = useState(id);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { data, isLoading } = useAplication2Query({ search });
  const statusVariantMap = {
    "bajarilgan": "success",
    "qaytarildi": "destructive",
    "qabul qilindi": "default",
    "jarayonda": "warning",
  };
  useEffect(() => {});
  return (
    <div className="grid grid-cols-3 h-[89vh] overflow-hidden">
      {/* CHAP PANEL */}
      <div className="lg:col-span-1 lg:block rounded-xl border-r hidden">
        {/* HEADER */}
        <div className="sticky top-0 z-10 bg-background pb-3 pr-3 space-y-2">
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
              className="pl-8 h-9"
            />
          </div>
        </div>
        {/* LIST */}
        <ScrollArea className="h-screen no-scrollbar pb-60 pr-2">
          <div className="flex flex-col">
            {isLoading ? (
              // Skeleton
              Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-3 py-3 border-b"
                >
                  <Skeleton className="w-11 h-11 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-[60%]" />
                    <Skeleton className="h-3 w-[80%]" />
                  </div>
                </div>
              ))
            ) : (
              <>
                {data?.results?.map((item) => {
                  const isActive = mainID === item.id;
                  const firstLetter =
                    item?.tuzilma_nomlari?.[0]?.charAt(0)?.toUpperCase() || "?";

                  return (
                    <div
                      key={item.id}
                      onClick={() => setMainID(item.id)}
                      className={cn(
                        "group relative flex items-center gap-3 px-3 py-3 cursor-pointer transition",
                        "hover:bg-muted/60",
                        isActive && "bg-muted",
                      )}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <span className="absolute left-0 top-0 h-full w-[3px] bg-blue-500 rounded-r-full" />
                      )}

                      {/* Avatar */}
                      <div className="relative">
                        <div className="w-11 h-11 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-lg">
                          {firstLetter}
                        </div>

                        {/* Premium badge */}
                        {item?.premium && (
                          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-[10px] shadow">
                            ★
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Top row */}
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm truncate">
                            {item?.tuzilma_nomlari?.join(", ")}
                          </p>

                          <span className="text-[11px] text-muted-foreground shrink-0">
                            {item?.sana}
                          </span>
                        </div>

                        {/* Bottom row */}
                        <div className="flex items-center justify-between mt-0.5">
                          <p className="text-xs text-muted-foreground truncate max-w-[80%]">
                            {item?.comment}
                          </p>

                          <Badge
                            variant={statusVariantMap[item.status] || "outline"}
                            className="text-[10px] px-2 py-0.5 capitalize"
                          >
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {/* Empty */}
            {data?.count === 0 && (
              <p className="text-sm text-muted-foreground text-center py-10">
                Hech narsa topilmadi
              </p>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* O‘NG PANEL */}
      <div className="lg:col-span-2 h-screen col-span-3">
        <div className="h-full p-4">
          <Application_details_Main id={mainID} />
        </div>
      </div>
    </div>
  );
}
