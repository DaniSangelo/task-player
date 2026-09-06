"use client";

import { TransformedMonthlyWorkedHours } from "../dashboard/page";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  ChartContainer, type ChartConfig
} from "./ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

const chartConfig = {
  settings: {},
} satisfies ChartConfig;

interface TotalHOurMonthChartProps {
  chartData: TransformedMonthlyWorkedHours[];
}

const TotalHoursMonthChart = ({ chartData }: TotalHOurMonthChartProps) => {
  const maxDataValue = Math.max(...chartData.flatMap((d) => [d.total_hours]));

  const yAxisMax = Math.ceil(maxDataValue * 1.25);

  return (
    <Card className="min-h-full w-100 shadow-sm">
      <CardHeader>
        <CardTitle className="uppercase tracking-wide">
          Total hours per month
        </CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <ChartContainer config={chartConfig} className="w-full h-75">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 30, right: 10, left: 10, bottom: 10 }}
          >
            <CartesianGrid vertical={false} />
            <YAxis hide domain={[0, yAxisMax]} />
            <XAxis
              dataKey="year_month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            {/* <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => {
                    const { hours, minutes } = formatSecondsToTime(
                      Number(value) * 3600,
                    );
                    return [`${hours}:${minutes}`];
                  }}
                />
              }
            /> */}
            {/* <ChartLegend content={<ChartLegendContent />} /> */}
            <Bar dataKey="total_hours" fill="var(--color-primary)" radius={4}>
              <LabelList
                dataKey="total_in_time"
                position="top"
                offset={12}
                className="fill-foreground font-medium"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default TotalHoursMonthChart;
