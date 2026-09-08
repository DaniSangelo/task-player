import { Circle } from "lucide-react";
import {
  getDailyWorkedSeconds,
  getTasks,
} from "../../_data-access/tasks/get-tasks";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import AddTaskButton from "../../_components/add-task-form";
import { DatePickerInput } from "../../_components/ui/date-picker";
import { formatSecondsToTime } from "../../_lib/shared/helper";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function getSelectedDay(value: string | string[] | undefined) {
  if (typeof value !== "string" || !datePattern.test(value)) {
    return new Date();
  }

  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) || formatDay(date) !== value
    ? new Date()
    : date;
}

function formatDay(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default async function TaskPage({ searchParams }: PageProps<"/tasks">) {
  const selectedDay = getSelectedDay((await searchParams).date);
  const selectedDayParam = formatDay(selectedDay);
  const [tasks, dailyWorkedSeconds] = await Promise.all([
    getTasks(selectedDayParam),
    getDailyWorkedSeconds(undefined, selectedDay),
  ]);
  const { hours, minutes, seconds } = formatSecondsToTime(dailyWorkedSeconds);
  return (
    <div className="flex w-full min-w-0 flex-col space-y-5">
      <div className="w-full md:ml-auto md:w-auto">
        <div className="md:flex gap-5 items-center">
          <AddTaskButton selectedDay={selectedDayParam} />
        </div>
      </div>
      <div className="w-full min-w-0 overflow-hidden rounded-md border border-accent-100/50">
        <div className="mb-10 flex flex-col gap-3 border-b border-accent-100/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0 sm:py-0">
          <div className="flex items-center gap-2 sm:py-5">
            <Circle size={10} className="fill-accent-500 text-accent-500" />
            <p className="whitespace-nowrap text-sm">Today&#39;s tasks</p>
            <p className="text-[10px] text-secondary-500 bg-accent-50 rounded-full py-1 px-2">
              {tasks.length}
            </p>
          </div>
          <div className="self-center text-sm sm:m-2">
            <DatePickerInput
              key={selectedDayParam}
              selectedDay={selectedDayParam}
            />
          </div>
        </div>
        <DataTable columns={columns} data={tasks} />
      </div>
      <footer className="flex w-full px-2 py-8">
        {tasks.length ? (
          <div className="flex flex-col md:items-start md:ml-auto w-full md:w-fit items-center">
            <p className="tracking-widest font-heading uppercase text-xs font-semibold text-accent-950/50">
              Total time worked
            </p>
            <div className="flex gap-2 items-baseline">
              <p className="text-4xl font-bold text-accent-950">
                {hours}:{minutes}:{seconds}
              </p>
              <p className="text-sm opacity-50">hours</p>
            </div>
          </div>
        ) : (
          <></>
        )}
      </footer>
    </div>
  );
}
