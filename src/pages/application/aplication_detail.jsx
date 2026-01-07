import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAplication2Query } from "@/services/api";
import { ArrowLeft, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Aplication_Main_Page from "./aplication.Main.Page";

export default function ApplicationDetailPage() {
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
    <div className="grid grid-cols-3 h-[85vh] overflow-hidden">
      {/* CHAP PANEL */}
      <div className="lg:col-span-1 lg:block rounded-xl border-r hidden">
        {/* HEADER */}
        <div className="sticky top-0 z-10 bg-background pb-3 pr-3 space-y-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>

            <h2 className="text-sm font-semibold flex-1">
              Yuborilgan arizalar
            </h2>
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
        <ScrollArea className="h-[calc(100vh-110px)] no-scrollbar pr-4">
          <div className="space-y-3">
            {isLoading ? (
              // Skeleton loading
              <>
                {Array.from({ length: 20 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-3 space-y-2">
                      {/* Top row */}
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-[180px] rounded" />
                        <Skeleton className="h-5 w-[90px] rounded-full" />
                      </div>

                      {/* Comment */}
                      <div className="space-y-1">
                        <Skeleton className="h-3 w-full rounded" />
                        <Skeleton className="h-3 w-[70%] rounded" />
                      </div>

                      {/* Bottom row */}
                      <div className="flex justify-between">
                        <Skeleton className="h-3 w-[80px] rounded" />
                        <Skeleton className="h-3 w-[70px] rounded" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : (
              // Real data
              <>
                {data?.results?.map((item) => (
                  <Card
                    key={item?.id}
                    onClick={() => setMainID(item?.id)}
                    className={cn(
                      "cursor-pointer hover:bg-muted transition w-full",
                      mainID == item?.id &&
                        "bg-gray-200 dark:bg-muted/10 dark:border-white/50 border-black/20",
                    )}
                  >
                    <CardContent className="p-3 space-y-2">
                      {/* Top row: Tuzilma nomlari + status */}
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1 max-w-[70%]">
                          {item?.tuzilma_nomlari?.map((it, idx) => (
                            <span key={idx} className="text-sm font-medium">
                              {it}
                              {idx !== item.tuzilma_nomlari.length - 1 && ","}
                            </span>
                          ))}
                        </div>

                        <Badge
                          variant={statusVariantMap[item.status] || "outline"}
                        >
                          {item.status}
                        </Badge>
                      </div>

                      {/* Comment */}
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {item?.comment}
                      </p>

                      {/* Bottom row */}
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{item?.turi}</span>
                        <span>{item?.sana}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}

            {/* No results */}
            {data?.count === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">
                Hech narsa topilmadi
              </p>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* O‘NG PANEL */}
      <div className="lg:col-span-2 h-screen col-span-3">
        <div className="h-full p-4">
          <Aplication_Main_Page id={mainID} />
        </div>
      </div>
    </div>
  );
}
