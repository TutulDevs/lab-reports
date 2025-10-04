import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getUsernameInitials = (username: string, length = 2): string => {
  return username.split("").slice(0, length).join("").toUpperCase();
};
