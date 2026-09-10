"use client";

import { PieChart, Pie } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import { DateFilterRange } from "../_lib/dashboard-date-range";
import { format } from "date-fns";
import { TotalHoursPerMonthAndStatus } from "../(auth)/dashboard/page";
export const description = "A pie chart with a legend";

const chartConfig = {
  tasks: {
    label: "Tarefas",
  },
  pending: {
    label: "Pending",
    color: "var(--chart-1)",
  },
  running: {
    label: "In progress",
    color: "var(--chart-2)",
  },
  done: {
    label: "Done",
    color: "var(--chart-3)",
  },
  paused: {
    label: "Paused",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

interface TotalHourMonthPerTaskStatusChartProps {
  chartData: TotalHoursPerMonthAndStatus[];
  dateRange: DateFilterRange;
}

const TotalHoursMonthPerTaskStatus = ({
  chartData,
  dateRange,
}: TotalHourMonthPerTaskStatusChartProps) => {
  const initialMonthName = format(dateRange.from, "MMMM");
  const endMonthName = format(dateRange.to, "MMMM");
  const year = format(dateRange.to, "yyyy");

  return (
    <Card className="rounded-lg shadow-sm md:w-[50%]">
      {/* <Card className="flex flex-col rounded-lg ml-3"> */}
      <CardHeader className="items-center pb-0">
        <CardTitle>Total hours in the period by status</CardTitle>
        <CardDescription>
          {initialMonthName === endMonthName
            ? `${initialMonthName}/${year}`
            : `${initialMonthName} - ${endMonthName}/${year}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-75"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name, item) => {
                    const originalData = item.payload;
                    return originalData?.total_in_time || value;
                  }}
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="total_hours"
              nameKey="status"
              stroke="0"
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="status" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default TotalHoursMonthPerTaskStatus;
