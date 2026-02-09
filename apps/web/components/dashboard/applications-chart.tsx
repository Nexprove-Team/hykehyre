"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@hackhyre/ui/components/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@hackhyre/ui/components/chart";
import { MOCK_CHART_DATA } from "@/lib/mock-data";

const chartConfig = {
  applications: {
    label: "Applications",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ApplicationsChart() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Applications This Week
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[220px] w-full">
          <AreaChart
            data={MOCK_CHART_DATA}
            margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="fillApplications"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              className="stroke-border"
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              className="text-muted-foreground text-xs"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              className="text-muted-foreground text-xs"
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              cursor={false}
            />
            <Area
              type="monotone"
              dataKey="applications"
              stroke="var(--chart-1)"
              strokeWidth={2}
              fill="url(#fillApplications)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
