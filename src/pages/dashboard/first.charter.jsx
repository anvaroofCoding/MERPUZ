import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const title = "PPR Statistikasi (Multiple Line Chart)";

const chartData = [
  { month: "Yanvar", ppr1: 120, ppr2: 90, ppr3: 60, ppr4: 40 },
  { month: "Fevral", ppr1: 180, ppr2: 140, ppr3: 100, ppr4: 70 },
  { month: "Mart", ppr1: 240, ppr2: 190, ppr3: 150, ppr4: 110 },
  { month: "Aprel", ppr1: 200, ppr2: 170, ppr3: 130, ppr4: 90 },
  { month: "May", ppr1: 260, ppr2: 220, ppr3: 180, ppr4: 140 },
  { month: "Iyun", ppr1: 300, ppr2: 250, ppr3: 210, ppr4: 170 },
  { month: "Iyul", ppr1: 340, ppr2: 290, ppr3: 240, ppr4: 200 },
  { month: "Avgust", ppr1: 380, ppr2: 330, ppr3: 280, ppr4: 240 },
  { month: "Sentabr", ppr1: 360, ppr2: 310, ppr3: 260, ppr4: 220 },
  { month: "Oktabr", ppr1: 400, ppr2: 350, ppr3: 300, ppr4: 260 },
  { month: "Noyabr", ppr1: 450, ppr2: 400, ppr3: 350, ppr4: 300 },
  { month: "Dekabr", ppr1: 500, ppr2: 450, ppr3: 400, ppr4: 350 },
];

const chartConfig = {
  ppr1: {
    label: "PPR 1",
    color: "var(--chart-1)",
  },
  ppr2: {
    label: "PPR 2",
    color: "var(--chart-2)",
  },
  ppr3: {
    label: "PPR 3",
    color: "var(--chart-3)",
  },
  ppr4: {
    label: "PPR 4",
    color: "var(--chart-4)",
  },
};

const ChartLineMultiple = () => (
  <div className="w-full rounded-md border bg-background p-4">
    <ChartContainer config={chartConfig} className="w-full h-[400px]">
      <LineChart
        width={undefined}
        height={400}
        data={chartData}
        margin={{
          left: 12,
          right: 12,
          top: 10,
          bottom: 10,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          axisLine={false}
          dataKey="month"
          tickFormatter={(value) => value.slice(0, 3)}
          tickLine={false}
          tickMargin={8}
        />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} cursor={false} />

        <Line
          dataKey="ppr1"
          dot={false}
          stroke="var(--color-ppr1)"
          strokeWidth={2}
          type="monotone"
        />
        <Line
          dataKey="ppr2"
          dot={false}
          stroke="var(--color-ppr2)"
          strokeWidth={2}
          type="monotone"
        />
        <Line
          dataKey="ppr3"
          dot={false}
          stroke="var(--color-ppr3)"
          strokeWidth={2}
          type="monotone"
        />
        <Line
          dataKey="ppr4"
          dot={false}
          stroke="var(--color-ppr4)"
          strokeWidth={2}
          type="monotone"
        />
      </LineChart>
    </ChartContainer>
  </div>
);

export default ChartLineMultiple;
