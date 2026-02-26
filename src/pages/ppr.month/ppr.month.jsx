import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  useMEQuery,
  usePprMonthQuery,
  usePPRtastiqlashGetForFindQuery,
} from "@/services/api";
import { ChevronLeft, ChevronRight, Lock, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AddPPRMonth from "./add.ppr.month";
import { useSelector } from "react-redux";
import { IconPercentage } from "@tabler/icons-react";

export default function PprMonth() {
  const bolim = useSelector((state) => state.bolim.bolim);
  const { data: me } = useMEQuery();
  const { data: yuborishStatus } = usePPRtastiqlashGetForFindQuery();

  const { data: PPR_DATA } = usePprMonthQuery({
    bolim_category: me?.role == "bolim" ? me?.bolim_nomi : bolim,
  });

  const today = new Date();
  const cleanToday = new Date();
  cleanToday.setHours(0, 0, 0, 0);

  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const weekDays = ["Yak", "Dush", "Sesh", "Chor", "Pay", "Jum", "Shan"];

  const daysInMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const firstDayOfMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const dateMap = useMemo(() => {
    const map = new Map();
    PPR_DATA?.results?.forEach((entry) => {
      if (!entry.sana) return;
      if (!map.has(entry.sana)) map.set(entry.sana, []);
      map.get(entry.sana).push(entry);
    });
    return map;
  }, [PPR_DATA]);

  const getDateString = (dayNum) =>
    `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(
      2,
      "0",
    )}-${String(dayNum).padStart(2, "0")}`;

  const isFuture = (dayNum) => {
    if (!dayNum) return false;
    const cellDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      dayNum,
    );
    return cellDate > cleanToday;
  };

  const isToday = (dayNum) => {
    if (!dayNum) return false;
    return (
      dayNum === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const prevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );

  const nextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );

  // Tekshirish: agar shu oyning statusi "tasdiqlandi" bo'lsa
  const isMonthApproved = useMemo(() => {
    if (!yuborishStatus?.results) return false;
    return yuborishStatus.results.some(
      (item) =>
        item.status === "tasdiqlandi" &&
        item.yil === currentDate.getFullYear() &&
        item.oy === currentDate.getMonth() + 1,
    );
  }, [yuborishStatus, currentDate]);

  const days = [];
  const totalCells = firstDayOfMonth(currentDate) + daysInMonth(currentDate);

  for (let i = 0; i < totalCells; i++) {
    if (i < firstDayOfMonth(currentDate)) {
      days.push(null);
    } else {
      days.push(i - firstDayOfMonth(currentDate) + 1);
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Card className="shadow-none border-none bg-transparent pt-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <h2 className="text-2xl font-semibold">
            {currentDate.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>

          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((day, idx) => (
            <div
              key={idx}
              className="text-center text-sm font-semibold text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((dayNum, idx) => {
            const dateStr = dayNum ? getDateString(dayNum) : null;
            const pprEntries = dateStr ? dateMap.get(dateStr) || [] : [];
            const future = isFuture(dayNum);
            const todayFlag = isToday(dayNum);

            return (
              <div key={idx} className="aspect-square relative">
                {dayNum ? (
                  <div
                    className={`h-full p-2 rounded-lg flex flex-col transition-all duration-300
                    ${
                      future
                        ? "bg-gray-200 dark:bg-gray-800 border border-dashed border-gray-400"
                        : todayFlag
                          ? "bg-primary/10 border-2 border-primary"
                          : "bg-card border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md"
                    }`}
                  >
                    {future && (
                      <Lock className="absolute top-2 right-2 w-4 h-4 text-gray-500" />
                    )}

                    {todayFlag && (
                      <Star className="absolute top-2 right-2 w-4 h-4 text-primary fill-primary" />
                    )}

                    <div className="text-sm font-semibold mb-1">{dayNum}</div>

                    <div className="flex-1 flex flex-col gap-1 scroll-custom px-2">
                      {pprEntries.map((entry) => (
                        <Link
                          key={entry.id}
                          to={`${entry.ppr_turi_name}/${entry?.id}`}
                          className="cursor-pointer"
                        >
                          <div
                            className={`text-xs px-2 py-1 rounded-lg truncate shadow-sm ${entry.muddat ? "bg-red-600" : "bg-primary"} text-white flex items-center justify-between`}
                          >
                            <span>{entry.ppr_turi_name}</span>

                            <span className="flex items-center justify-center">
                              {entry.umumiy_foiz}
                              <IconPercentage stroke={2} size={14} />
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {me?.role == "bolim" && !isMonthApproved ? (
                      <AddPPRMonth startDate={dateStr} />
                    ) : null}
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
