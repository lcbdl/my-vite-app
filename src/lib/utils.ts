import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const debounce = (callback: (...args: any[]) => void, timeout: number) => {
  let timer: number | null = null;
  return (...args: any[]) => {
    if (timer !== null) {
      clearTimeout(timer);
    }
    timer = window.setTimeout(() => callback(...args), timeout);
  };
};

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

export const getFocusableElements = (container: HTMLElement) => {
  return Array.from(
    container.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),
  ).filter((el) => {
    const isDisabled = el.hasAttribute("disabled");
    const ariaDisabled = el.getAttribute("aria-disabled") === "true";
    const minusTabIndex = el.getAttribute("tabindex") === "-1";
    return !isDisabled && !ariaDisabled && !minusTabIndex;
  });
};
