"use client";

import * as React from "react";
import { endOfYear, format, startOfYear } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { type DateRange } from "react-day-picker";
import type { DateFilterRange } from "@/app/_lib/dashboard-date-range";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Field, FieldLabel } from "./field";
import { Button } from "./button";
import { Calendar } from "./calendar";

type DatePickerWithRangeProps = {
  initialRange: DateFilterRange;
};

function formatSearchDate(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export function DatePickerWithRange({
  initialRange,
}: DatePickerWithRangeProps) {
  const router = useRouter();
  const [date, setDate] = React.useState<DateRange>(initialRange);
  const yearStart = startOfYear(initialRange.from);
  const yearEnd = endOfYear(initialRange.from);

  const selectRange = (nextDate: DateRange | undefined) => {
    if (!nextDate?.from) {
      return;
    }

    if (!nextDate.to) {
      setDate(nextDate);
      return;
    }

    if (
      nextDate.from.getFullYear() !== initialRange.from.getFullYear() ||
      nextDate.to.getFullYear() !== initialRange.from.getFullYear()
    ) {
      return;
    }

    setDate(nextDate);
    router.replace(
      `/dashboard?from=${formatSearchDate(nextDate.from)}&to=${formatSearchDate(nextDate.to)}`,
    );
  };

  return (
    <Field className="mx-auto w-60 ">
      <FieldLabel htmlFor="date-picker-range">Date Picker Range</FieldLabel>
      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              id="date-picker-range"
              className="rounded-full justify-start px-2.5 font-normal cursor-pointer"
            >
              <CalendarIcon
                data-icon="inline-start"
                size={18}
                className="text-accent-500"
              />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          }
        />
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            showOutsideDays={false}
            defaultMonth={date?.from}
            selected={date}
            onSelect={selectRange}
            numberOfMonths={2}
            startMonth={yearStart}
            endMonth={yearEnd}
            disabled={{ before: yearStart, after: yearEnd }}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}
