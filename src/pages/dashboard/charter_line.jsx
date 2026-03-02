"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Loader } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForDashboardQuery, useMEQuery } from "@/services/api";
import { useSelector } from "react-redux";

const chartConfig = {
  umumiy: { label: "Umumiy", color: "#2563eb" },
  bajarilgan: { label: "Bajarilgan", color: "#22c55e" },
  muddati_otgan: { label: "Muddati o'tgan", color: "#ef4444" },
};

export default function InteractiveDashboard() {
  const bolim = useSelector((state) => state.bolim.bolim);
  const { data: me, isLoading: meLoading } = useMEQuery();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = React.useState(currentYear);
  const { data, isLoading } = useForDashboardQuery({
    bolim_category: me?.role == "bolim" ? me?.bolim_nomi : bolim,
    year: selectedYear,
  });
  const manYears = [2025, 2026, 2027, 2028, 2029, 2030];
  // Ma'lumotlarni tayyorlash
  const chartData = React.useMemo(() => {
    // Agar data bo'lmasa, bo'sh massiv qaytaramiz (Birdan chiqishi uchun muhim)
    if (!data?.months) return [];

    return data.months.map((item) => {
      const totals = item?.tuzilmalar?.reduce(
        (acc, curr) => ({
          muddati_otgan: acc.muddati_otgan + (curr.muddati_otgan || 0),
          bajarilgan: acc.bajarilgan + (curr.bajarilgan || 0),
          umumiy: acc.umumiy + (curr.umumiy || 0),
        }),
        { muddati_otgan: 0, bajarilgan: 0, umumiy: 0 },
      );

      return {
        name: item?.oy_nomi,
        ...totals,
      };
    });
  }, [data]); // selectedYear emas, data o'zgarganda hisoblasin

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Statistika Grafigi</CardTitle>
          <CardDescription>
            {selectedYear}-yil bo'yicha umumiy ko'rsatkichlar
          </CardDescription>
        </div>
        <div className="flex items-center px-6 py-4 sm:border-l">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[160px] rounded-lg">
              <SelectValue placeholder="Yilni tanlang" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {manYears?.map((items, index) => {
                return (
                  <SelectItem key={index} value={items}>
                    {items}-yil
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {/* Balandlikni qat'iy belgilash chartning "sakrashini" oldini oladi */}
        <div className="h-[350px] w-full">
          {isLoading || meLoading ? (
            <div className="flex justify-center items-center gap-2 w-full h-full">
              Yuklanmoqda <Loader className="animate-spin" />
            </div>
          ) : (
            <ChartContainer config={chartConfig} className="h-full w-full">
              <AreaChart
                data={chartData}
                margin={{ left: 0, right: 12 }}
                // Animatsiyani o'chirish yoki tezlashtirish uchun:
              >
                <defs>
                  <linearGradient id="colorUmumiy" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={chartConfig.umumiy.color}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={chartConfig.umumiy.color}
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient
                    id="colorBajarilgan"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={chartConfig.bajarilgan.color}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={chartConfig.bajarilgan.color}
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="colorMuddati" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={chartConfig.muddati_otgan.color}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={chartConfig.muddati_otgan.color}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />

                <ChartTooltip
                  cursor={true}
                  content={<ChartTooltipContent indicator="dot" />}
                />

                {/* isAnimationActive={false} qilsangiz chart darhol chiqadi */}
                <Area
                  isAnimationActive={true}
                  animationDuration={500}
                  name="Umumiy"
                  type="monotone"
                  dataKey="umumiy"
                  stroke={chartConfig.umumiy.color}
                  fillOpacity={1}
                  fill="url(#colorUmumiy)"
                  strokeWidth={2}
                />
                <Area
                  isAnimationActive={true}
                  animationDuration={500}
                  name="Bajarilgan"
                  type="monotone"
                  dataKey="bajarilgan"
                  stroke={chartConfig.bajarilgan.color}
                  fillOpacity={1}
                  fill="url(#colorBajarilgan)"
                  strokeWidth={2}
                />
                <Area
                  isAnimationActive={true}
                  animationDuration={500}
                  name="Muddati o'tgan"
                  type="monotone"
                  dataKey="muddati_otgan"
                  stroke={chartConfig.muddati_otgan.color}
                  fillOpacity={1}
                  fill="url(#colorMuddati)"
                  strokeWidth={2}
                />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
