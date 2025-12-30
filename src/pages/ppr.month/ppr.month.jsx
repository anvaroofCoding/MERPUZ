import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePprMonthQuery } from "@/services/api";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AddPPRMonth from "./add.ppr.month";

/* =======================
   Skeleton component
======================= */
const PprSkeleton = () => {
  return (
    <div className="flex-1 mt-1 space-y-1">
      <div className="h-3 w-full rounded bg-muted animate-pulse" />
      <div className="h-3 w-4/5 rounded bg-muted animate-pulse" />
    </div>
  );
};

export default function PprMonth() {
  const { data: PPR_DATA, isLoading } = usePprMonthQuery();

  const today = new Date();
  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  /* =======================
     Date helpers
  ======================= */
  const daysInMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const firstDayOfMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  /* =======================
     Create dateMap (PPR)
  ======================= */
  const dateMap = useMemo(() => {
    const map = new Map();

    PPR_DATA?.forEach((entry) => {
      const startDate = new Date(entry.boshlash_sanasi + "T00:00:00");
      const endDate = new Date(entry.yakunlash_sanasi + "T00:00:00");

      const current = new Date(startDate);

      while (current <= endDate) {
        const dateStr = `${current.getFullYear()}-${String(
          current.getMonth() + 1,
        ).padStart(2, "0")}-${String(current.getDate()).padStart(2, "0")}`;

        if (!map.has(dateStr)) {
          map.set(dateStr, []);
        }

        map.get(dateStr).push(entry);
        current.setDate(current.getDate() + 1);
      }
    });

    return map;
  }, [PPR_DATA]);

  /* =======================
     Calendar calculations
  ======================= */
  const monthName = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const days = [];
  const totalCells = firstDayOfMonth(currentDate) + daysInMonth(currentDate);

  for (let i = 0; i < totalCells; i++) {
    if (i < firstDayOfMonth(currentDate)) {
      days.push(null);
    } else {
      days.push(i - firstDayOfMonth(currentDate) + 1);
    }
  }

  const isToday = (dayNum) =>
    dayNum &&
    dayNum === today.getDate() &&
    currentDate.getMonth() === today.getMonth() &&
    currentDate.getFullYear() === today.getFullYear();

  const getDateString = (dayNum) =>
    `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(
      2,
      "0",
    )}-${String(dayNum).padStart(2, "0")}`;

  /* =======================
     Month navigation
  ======================= */
  const prevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );

  const nextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );

  const PPR_STYLES = {
    "PPR-1": {
      bg: "bg-[hsl(142.4_71.8%_29.2%)] dark:bg-[hsl(142.4_71.8%_20%)]",
      text: "text-white",
      hover: "hover:bg-[hsl(142.4_71.8%_35%)]",
    },

    "PPR-2": {
      bg: "bg-[hsl(26_90.5%_37.1%)] dark:bg-[hsl(26_90.5%_28%)]",
      text: "text-white",
      hover: "hover:bg-[hsl(26_90.5%_45%)]",
    },

    "PPR-3": {
      bg: "bg-[hsl(224.3_76.3%_48%)] dark:bg-[hsl(224.3_76.3%_38%)]",
      text: "text-white",
      hover: "hover:bg-[hsl(224.3_76.3%_55%)]",
    },

    "PPR-4": {
      bg: "bg-[hsl(272.9_67.2%_39.4%)] dark:bg-[hsl(272.9_67.2%_30%)]",
      text: "text-white",
      hover: "hover:bg-[hsl(272.9_67.2%_46%)]",
    },

    "PPR-5": {
      bg: "bg-[hsl(216.9_19.1%_26.7%)] dark:bg-[hsl(216.9_19.1%_18%)]",
      text: "text-white",
      hover: "hover:bg-[hsl(216.9_19.1%_33%)]",
    },
  };

  /* =======================
     Render
  ======================= */
  return (
    <main className="min-h-screen bg-background">
      <Card className="shadow-lg p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={prevMonth}
            disabled={isLoading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <h2 className="text-2xl font-semibold">{monthName}</h2>

          <Button
            variant="outline"
            size="icon"
            onClick={nextMonth}
            disabled={isLoading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Week days */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-semibold text-muted-foreground py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((dayNum, idx) => {
            const dateStr = dayNum ? getDateString(dayNum) : null;
            const pprEntries = dateStr ? dateMap.get(dateStr) : [];
            const todayFlag = isToday(dayNum);

            return (
              <div key={idx} className="aspect-square relative ">
                {dayNum ? (
                  <div
                    className={`h-full p-2 rounded-lg flex flex-col transition ${
                      todayFlag
                        ? "bg-primary text-primary-foreground ring-2 ring-primary/50"
                        : "bg-card border shadow-sm hover:shadow-md"
                    } ${isLoading ? "pointer-events-none opacity-80" : ""}`}
                  >
                    <div className="text-sm font-semibold">{dayNum}</div>

                    {/* CONTENT */}
                    <div className="flex-1 overflow-y-scroll no-scrollbar">
                      {isLoading && <PprSkeleton />}

                      {!isLoading &&
                        pprEntries?.slice(0, 10).map((entry) => {
                          const style =
                            PPR_STYLES[entry.ppr_turi_name] ||
                            PPR_STYLES["PPR-1"];
                          return (
                            <Link
                              to={`${entry.ppr_turi_name}/${entry?.id}`}
                              key={
                                entry.id ??
                                `${entry.ppr_turi_name}-${entry.obyekt_name}`
                              }
                            >
                              <div
                                className={`text-xs mt-1 px-1 py-0.5 rounded truncate duration-300
            ${style.bg} ${style.text} ${style.hover}
          `}
                              >
                                {entry.ppr_turi_name} – {entry.obyekt_name}
                              </div>
                            </Link>
                          );
                        })}

                      {/* {!isLoading && pprEntries?.length > 5 && (
                        <div className="text-xs text-muted-foreground mt-1">
                          +{pprEntries.length - 5} more
                        </div>
                      )} */}
                      {isLoading ? (
                        <Skeleton
                          className={"w-8 h-8 absolute bottom-1 right-1"}
                        />
                      ) : (
                        <AddPPRMonth startDate={dateStr} />
                      )}
                    </div>
                  </div>
                ) : (
                  <div />
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </main>
  );
}
