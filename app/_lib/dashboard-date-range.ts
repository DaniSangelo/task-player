import { endOfMonth, startOfDay, startOfMonth } from "date-fns";

export interface DateFilterRange {
  from: Date;
  to: Date;
}

type SearchParamValue = string | string[] | undefined;

export const getFormatedDefaultRange = (): DateFilterRange => {
  const today = new Date();

  return {
    from: startOfDay(startOfMonth(today)),
    to: startOfDay(endOfMonth(today)),
  };
};

export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const formatWorkedHours = (totalHours: number): string => {
  const totalMinutes = Math.round(totalHours * 60);
  const hours = Math.floor(totalMinutes / 60).toString().padStart(2, "0");
  const minutes = (totalMinutes % 60).toString().padStart(2, "0");

  return `${hours}:${minutes}`;
};

const parseDate = (value: SearchParamValue) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return undefined;
  }

  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) || formatDate(date) !== value
    ? undefined
    : date;
};

export const getDashboardDateRange = (
  fromParam: SearchParamValue,
  toParam: SearchParamValue,
): DateFilterRange => {
  const from = parseDate(fromParam);
  const to = parseDate(toParam);

  if (!from || !to || from > to || from.getFullYear() !== to.getFullYear()) {
    return getFormatedDefaultRange();
  }

  return { from: startOfDay(from), to: startOfDay(to) };
};
