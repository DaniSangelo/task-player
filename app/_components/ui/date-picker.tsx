"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Field } from "./field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./input-group";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Calendar } from "./calendar";

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

function formatSearchDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

type DatePickerInputProps = {
  selectedDay: string;
};

export function DatePickerInput({ selectedDay }: DatePickerInputProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const selectedDate = React.useMemo(
    () => new Date(`${selectedDay}T00:00:00`),
    [selectedDay],
  );
  const [date, setDate] = React.useState<Date | undefined>(selectedDate);
  const [month, setMonth] = React.useState<Date | undefined>(date);
  const [value, setValue] = React.useState(formatDate(date));

  const selectDate = (nextDate: Date) => {
    setDate(nextDate);
    setMonth(nextDate);
    setValue(formatDate(nextDate));
    router.replace(`/tasks?date=${formatSearchDate(nextDate)}`);
  };

  const selectTypedDate = () => {
    const typedDate = new Date(value);
    if (isValidDate(typedDate)) {
      selectDate(typedDate);
    }
  };

  return (
    <Field className="mx-auto w-48">
      <InputGroup>
        <InputGroupInput
          id="date-required"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={selectTypedDate}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
            if (e.key === "Enter") {
              e.preventDefault();
              selectTypedDate();
            }
          }}
        />
        <InputGroupAddon align="inline-end">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              render={
                <InputGroupButton
                  id="date-picker"
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Select date"
                  className="rounded-full p-7"
                >
                  <CalendarIcon className="text-accent-400" size={16}/>
                  {/* <span className="sr-only">Select date</span> */}
                </InputGroupButton>
              }
            />
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="end"
              alignOffset={-8}
              sideOffset={10}
            >
              <Calendar
                mode="single"
                selected={date}
                month={month}
                onMonthChange={setMonth}
                onSelect={(date) => {
                  if (!date) {
                    return;
                  }

                  selectDate(date);
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
