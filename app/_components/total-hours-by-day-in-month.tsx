"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { MonthlyWorkedHoursByDay } from "../_data-access/tasks/get-tasks";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { format } from "date-fns";

const months = [
  [
    { name: "Jan", value: 0 },
    { name: "Feb", value: 1 },
    { name: "Mar", value: 2 },
    { name: "Apr", value: 3 },
  ],
  [
    { name: "May", value: 4 },
    { name: "Jun", value: 5 },
    { name: "Jul", value: 6 },
    { name: "Ago", value: 7 },
  ],
  [
    { name: "Sep", value: 8 },
    { name: "Oct", value: 9 },
    { name: "Nov", value: 10 },
    { name: "Dec", value: 11 },
  ],
];

const chartConfig = {
  total_hours: {
    label: "Hours Worked",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

interface TotalHoursByDayInMonthProps {
  chartData: MonthlyWorkedHoursByDay[];
  selectedMonth: number;
}

const TotalHoursByDayInMonth = ({
  chartData,
  selectedMonth,
}: TotalHoursByDayInMonthProps) => {
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();

  const handleSelectMonth = (e: React.MouseEvent, monthValue: number) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", monthValue.toString());
    router.push(`${path}?${params.toString()}`, { scroll: false });
  };

  const getMonth = (): string => {
    const params = new URLSearchParams(searchParams.toString());
    const month = params.get('month')
    const date = month ? new Date(2026, +month, 1) : new Date();
    return format(date, 'MMMM');
  }

  return (
    <Card className="py-0 rounded-lg ">
      <CardHeader className="flex flex-col items-stretch p-0! sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0!">
          <CardTitle>Total hours per day for the month</CardTitle>
          <CardDescription>Displaying data for the month of <span className="font-semibold">{getMonth()}</span></CardDescription>
        </div>
        <div className="flex">
          {months.map((quarter, index) => {
            return (
              <div
                key={index}
                className="rounded-lg border border-secondary-50 m-1 grid grid-cols-2 max-w-28"
              >
                {/* {quarter} */}
                {quarter.map((month) => {
                  const isSelected = selectedMonth === month.value;
                  return (
                    <button
                      type="button"
                      className={`p-2 m-0.5 font-semibold cursor-pointer transition-all hover:scale-105 rounded-md ${
                        isSelected
                          ? "bg-secondary/50 text-primary font-bold"
                          : "hover:bg-accent/10"
                      }`}
                      key={month.name}
                      onClick={(e) => handleSelectMonth(e, month.value)}
                    >
                      {month.name}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-62.5 w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              // minTickGap={32}
              // tickFormatter={(value) => {
              //   const date = new Date(value);
              //   return date.toLocaleDateString("en-US", {
              //     month: "short",
              //     day: "numeric",
              //   });
              // }}
              tickFormatter={(value) => `Day ${value}`}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `${val}h`}
            />
            <ChartTooltip
              cursor={false}
              content={
                // <ChartTooltipContent
                //   className="w-37.5"
                //   nameKey="views"
                //   labelFormatter={(value) => {
                //     return new Date(value).toLocaleDateString("en-US", {
                //       month: "short",
                //       day: "numeric",
                //       year: "numeric",
                //     });
                //   }}
                // />
                <ChartTooltipContent
                  nameKey="total_in_time"
                  formatter={(value, name, entry) => {
                    // 'entry.payload' contém o objeto de dados completo daquela linha atual
                    const formattedTime = entry.payload.total_in_time;

                    return [
                      `${formattedTime} hrs `,
                      "worked"
                    ];
                  }}
                  labelFormatter={(label) => `Day ${label}`}
                />
              }
            />
            <Bar
              dataKey="total_hours"
              fill={`var(--color-total_hours)`}
              radius={4}
              className="hover:bg-amber-200"
            >
              {/* <LabelList
                dataKey="total_in_time"
                position="top"
                offset={12}
                className="fill-foreground font-medium"
                fontSize={12}
              /> */}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default TotalHoursByDayInMonth;
