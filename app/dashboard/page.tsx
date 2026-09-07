import TotalHoursMonthChart from "../_components/total-hours-month.chart";
import { DatePickerWithRange } from "../_components/ui/range-date-picker";
import {
  getMonthlyWorkedHours,
  MonthlyWorkedHours,
} from "../_data-access/tasks/get-tasks";
import { getDashboardDateRange } from "../_lib/dashboard-date-range";
import { formatSecondsToTime } from "../_lib/shared/helper";

export interface TransformedMonthlyWorkedHours extends MonthlyWorkedHours {
  year_month: string;
  total_in_time: string;
}

const DashboardPage = async ({ searchParams }: PageProps<"/dashboard">) => {
  const params = await searchParams;
  const dateRange = getDashboardDateRange(params.from, params.to);
  const year = dateRange.from.getFullYear();
  const startMonth = dateRange.from.getMonth() + 1;
  const endMonth = dateRange.to.getMonth() + 1;
  const totalHoursPerMonthData = await getMonthlyWorkedHours(
    startMonth,
    endMonth,
    year,
  );
  const transformed = totalHoursPerMonthData.map((m) => {
    const { hours, minutes } = formatSecondsToTime(m.total_hours * 3600);
    const month = m.month.substring(5, 7);
    const year = m.month.substring(0, 4);

    const date = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
      new Date(+year, +month - 1, 1),
    );
    return {
      ...m,
      year_month: date,
      total_in_time: `${hours}:${minutes}`,
    };
  });

  return (
    <div className="p-3 flex flex-col space-y-3 w-full">
      <div className="md:mr-auto p-2">
        <DatePickerWithRange
          key={`${dateRange.from.toISOString()}-${dateRange.to.toISOString()}`}
          initialRange={dateRange}
        />
      </div>
      <div>
        <TotalHoursMonthChart chartData={transformed} dateRange={dateRange}/>
      </div>
    </div>
  );
};

export default DashboardPage;
