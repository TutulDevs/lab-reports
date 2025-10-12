import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, FormatOptions } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getUsernameInitials = (username: string, length = 2): string => {
  return username.split("").slice(0, length).join("").toUpperCase();
};

export const dateFormatter = (
  date: null | string | number | Date,
  formatStr: string = "dd MMMM yyyy hh:mm a",
  options?: FormatOptions | undefined
) => {
  if (date == null) return "N/A";
  return format(date, formatStr, options);
};

export const sleep = async (time_in_ms = 50) => {
  return new Promise((resolve) => setTimeout(resolve, time_in_ms));
};

export function toPlainObject<T extends Record<string, any>>(obj: T) {
  return JSON.parse(
    JSON.stringify(obj, (key, value) =>
      typeof value === "bigint" || value?.constructor?.name === "Decimal"
        ? Number(value)
        : value
    )
  );
}
