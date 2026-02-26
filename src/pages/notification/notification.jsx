"use client";

import { useState, useMemo } from "react";
import { Bell, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {
  useNotificationsQuery,
  useNotificationsViewQuery,
} from "@/services/api";
import { skipToken } from "@reduxjs/toolkit/query";

export default function Notification() {
  const [mainID, setMainID] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 20;

  // 🔔 Notifications list
  const { data, isLoading } = useNotificationsQuery({
    page,
    limit,
    search,
  });

  const notifications = data?.results || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  // 🔎 Search filter (frontend)
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [notifications, search]);

  // 🔴 Unread count
  const unreadCount = notifications.filter((item) => !item.is_read).length;

  // 📌 Selected notification detail
  const { data: MainIDDAta, isFetching: isMainFetching } =
    useNotificationsViewQuery(mainID ? { id: mainID } : skipToken);

  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button variant="default" size="icon" className="relative">
          <Bell size={18} />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 px-2 py-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DrawerTrigger>

      <DrawerContent className="w-[400px] p-0 flex flex-col">
        {/* Header */}
        <DrawerHeader className="border-b">
          <DrawerTitle>Bildirishnomalar</DrawerTitle>
        </DrawerHeader>

        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Notification list */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
          {isLoading && (
            <p className="text-sm text-muted-foreground">Yuklanmoqda...</p>
          )}

          {!isLoading && filteredNotifications.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Bildirishnoma topilmadi
            </p>
          )}

          {filteredNotifications.map((item) => (
            <div
              onClick={() => setMainID(item?.id)}
              key={item.id}
              className={`rounded-xl border p-4 transition hover:bg-muted/40 cursor-pointer ${
                !item.is_read ? "bg-muted/50 border-primary" : ""
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-sm font-semibold">{item.title}</h4>
                <Badge variant={item.is_read ? "secondary" : "default"}>
                  {item.is_read ? "O‘qildi" : "Yangi"}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">
                {item.message}
              </p>

              <div className="text-xs text-muted-foreground mt-2">
                {format(new Date(item.created_at), "dd.MM.yyyy HH:mm")}
              </div>
            </div>
          ))}

          {/* Selected notification detail (MainIDDAta) */}
          {mainID &&
            (isMainFetching ? (
              <p className="text-sm text-muted-foreground mt-2">
                Yuklanmoqda...
              </p>
            ) : (
              MainIDDAta && (
                <div className="mt-4 p-4 border rounded-lg bg-muted/20">
                  <h4 className="font-semibold mb-2">{MainIDDAta.title}</h4>
                  <p>{MainIDDAta.message}</p>
                  <div className="text-xs text-muted-foreground mt-2">
                    {format(
                      new Date(MainIDDAta.created_at),
                      "dd.MM.yyyy HH:mm",
                    )}
                  </div>
                </div>
              )
            ))}
        </div>

        {/* Pagination */}
        <div className="border-t p-3 flex items-center justify-between">
          <Button
            size="sm"
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            <ChevronLeft size={16} />
          </Button>

          <span className="text-sm text-muted-foreground">
            {page} / {totalPages || 1}
          </span>

          <Button
            size="sm"
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
