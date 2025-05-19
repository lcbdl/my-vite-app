import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// eslint-disable-next-line
export function debounce<T extends (...args: any[]) => void>(
  callback: T,
  timeout: number,
): (...args: Parameters<T>) => void {
  let timer: number | null = null;
  return (...args: Parameters<T>): void => {
    if (timer !== null) {
      clearTimeout(timer);
    }
    timer = window.setTimeout(() => callback(...args), timeout);
  };
}

export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const formatTime = (timeStr?: string) => {
  const time = timeStr ? dayjs(timeStr.replace(/[+-]\d{4}$/, "")) : null;
  return time?.format("MMMM DD, YYYY HH:mm");
};

export const zeroPad = (num: number, places: number) => {
  return String(num).padStart(places, "0");
};

export const toOrdinal = (num?: number) => {
  if (num === undefined) {
    return "";
  }
  const suffixes = ["th", "st", "nd", "rd"];
  const value = num % 100;
  return num + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0]);
};

export const daysInMonth = (month?: number, year?: number): number => {
  if (month === undefined || year === undefined) {
    return 31; // Default to 31 days
  }
  const date = new Date(year, month, 0);
  return date.getDate();
};
