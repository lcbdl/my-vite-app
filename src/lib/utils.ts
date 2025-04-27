import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const toOrdinal = (num?: number): string => {
  const suffixes = ["th", "st", "nd", "rd"];
  if (num === undefined) return "";
  const remainder = num % 100;
  return num + (suffixes[(remainder - 20) % 10] || suffixes[remainder] || suffixes[0]);
};

export const zeroPad = (num: number, places: number) => {
  return String(num).padStart(places, "0");
};

export const daysInMonth = (month?: number, year?: number): number => {
  if (month === undefined || year === undefined) {
    return 31; // Default to 31 days
  }
  const date = new Date(year, month + 1, 0);
  return date.getDate();
};
