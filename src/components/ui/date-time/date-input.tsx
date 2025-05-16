import i18n from "@/i18n/i18n";
import { cn, daysInMonth, toOrdinal, zeroPad } from "@/lib/utils";
import dayjs from "dayjs";
import { FocusEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { DateTimeNumberInput } from "./date-time-number-input";

const regex = /^(YYYY|MM|DD)([-\/])(MM|DD|YYYY)\2(MM|DD|YYYY)$/;

const MONTHS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

export type DateInputProps = {
  id?: string;
  name?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  invalid?: boolean;
  value?: string;
  className?: string;
  pattern?: string;
  onChange?: (value: string) => void;
  onInput?: (e: FormEvent<HTMLInputElement>) => void;
  onFocus?: (e: FocusEvent<HTMLSpanElement, Element>) => void;
};

export const DateInput = ({
  id: idProp,
  name,
  disabled = false,
  readonly,
  required = false,
  invalid = false,
  value,
  className,
  pattern = "YYYY-MM-DD",
  onChange,
  onInput,
  onFocus,
}: DateInputProps) => {
  const id = uuid();
  const dateProp = value && pattern ? dayjs(value, pattern) : undefined;

  ////////////////// States //////////////////////
  const [day, setDay] = useState(dateProp?.isValid() ? dateProp.date() : undefined);
  const [month, setMonth] = useState(dateProp?.isValid() ? dateProp.month() + 1 : undefined);
  const [year, setYear] = useState(dateProp?.isValid() ? dateProp.year() : undefined);
  const [focused, setFocused] = useState(false);

  ////////////////// Effects //////////////////////
  useEffect(() => {
    if (value && pattern) {
      const ymd = getYearMonthDayFromStringDate(value, pattern);
      setDay(ymd?.day);
      setMonth(ymd?.month);
      setYear(ymd?.year);
    }
  }, [value, pattern]);

  const getYearMonthDayFromStringDate = (strDate: string, format: string) => {
    const match = format.match(regex);
    if (!match) return undefined;
    const separator = match[2];
    const patternParts = format.split(separator); // e.g., ['YYYY', 'MM', 'DD']
    const dateParts = strDate.split(separator); // e.g., ['2025', '01', '12']
    let year: number | undefined = undefined,
      month: number | undefined = undefined,
      day: number | undefined = undefined;
    patternParts.forEach((part, i) => {
      const val = Number.parseInt(dateParts[i]);
      if (part === "YYYY") year = isNaN(val) ? undefined : val;
      if (part === "MM") month = isNaN(val) ? undefined : val;
      if (part === "DD") day = isNaN(val) ? undefined : val;
    });
    return { year, month, day };
  };

  ////////////////// Memos ////////////////////////
  const parsedPattern = useMemo<{
    isValidPattern: boolean;
    parts?: {
      type: "year" | "month" | "day";
      min: number;
      max: number;
      label: string;
      value?: number;
      textValue?: string;
      pattern: "YYYY" | "MM" | "DD";
    }[];
    separator?: string;
  }>(() => {
    const match = pattern.match(regex);
    if (!match) return { isValidPattern: false };
    const parts = [match[1], match[3], match[4]];
    const uniqueParts = new Set(parts);
    const isValidPattern = uniqueParts.size === 3;
    return {
      isValidPattern,
      parts: parts.map((p) => {
        if (p === "YYYY")
          return {
            type: "year",
            min: 1,
            max: 2199,
            label: i18n.t("calendar.year"),
            value: year,
            textValue: year === undefined ? "" : `${year}`,
            pattern: "YYYY",
          };
        if (p === "MM")
          return {
            type: "month",
            min: 1,
            max: 12,
            label: i18n.t("calendar.month"),
            value: month,
            textValue: month == undefined ? undefined : i18n.t(`calendar.months.${MONTHS[month ?? 1]}.value`),
            pattern: "MM",
          };
        return {
          type: "day",
          min: 1,
          max: daysInMonth(month, year),
          label: i18n.t("calendar.day"),
          value: day,
          textValue: toOrdinal(day),
          pattern: "DD",
        };
      }),
      separator: match[2],
    };
  }, [pattern, year, month, day]);

  const handleDateChange = (type: "year" | "month" | "day", num: number) => {
    const newYear = type === "year" ? num : year;
    const newMonth = type === "month" ? num : month;
    let newDay = type === "day" ? num : day;
    const maxDay = daysInMonth(newMonth, newYear);
    if (newDay !== undefined && newDay > maxDay) {
      newDay = maxDay;
    }
    setYear(newYear);
    setMonth(newMonth);
    setDay(newDay);
    if (inputRef.current) {
      inputRef.current.value = dateStrValue;
      inputRef.current.dispatchEvent(new InputEvent("input", { bubbles: true }));
      inputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
      onChange?.(dateStrValue);
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const dateStrValue = useMemo(() => {
    const parts = parsedPattern.parts;
    if ((parts?.filter((p) => p.value === undefined).length ?? 0) === 3) {
      return "";
    } else {
      return (
        (parts ?? [])
          .map((p) => (p.value === undefined ? p.pattern : zeroPad(p.value, p.pattern.length)))
          .join(parsedPattern.separator) ?? "-"
      );
    }
  }, [parsedPattern]);
  return (
    <div
      id={idProp}
      data-testid="date-input-container"
      className={cn(
        "flex w-full appearance-none flex-col rounded border border-gray-300 px-3 py-2 leading-tight text-gray-700 shadow focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-none disabled:opacity-70",
        {
          "ring-2": focused && !disabled,
          "ring-sky-400": focused && !disabled,
          "ring-offset-2": focused && !disabled,
          "outline-none": focused && !disabled,
          "ring-offset-white": focused && !disabled,
          "pointer-events-none opacity-70": disabled,
        },
        className,
      )}
    >
      {parsedPattern.isValidPattern && (
        <>
          <span
            id={id}
            className="flex gap-0"
            role="group"
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") {
                e.preventDefault();
                const target = e.target as HTMLSpanElement;
                const prev = target.previousElementSibling;
                if (prev) {
                  (prev as HTMLSpanElement).focus();
                }
              } else if (e.key === "ArrowRight") {
                e.preventDefault();
                const target = e.target as HTMLSpanElement;
                const next = target.nextElementSibling;
                if (next) {
                  (next as HTMLSpanElement).focus();
                }
              }
            }}
          >
            <DateTimeNumberInput
              // type={pattern.parts![0].type}
              disabled={disabled}
              tabIndex={0}
              className={cn({
                "after:content-['-']": parsedPattern.separator === "-",
                "after:content-['/']": parsedPattern.separator === "/",
              })}
              min={parsedPattern.parts![0].min}
              max={parsedPattern.parts![0].max}
              label={parsedPattern.parts![0].label}
              value={parsedPattern.parts![0].value}
              textValue={parsedPattern.parts![0].textValue}
              pattern={parsedPattern.parts![0].pattern}
              onChange={(num) => handleDateChange(parsedPattern.parts![0].type, num!)}
              onFocus={(e) => {
                onFocus?.(e);
                setFocused(true);
              }}
              onBlur={() => setFocused(false)}
            />
            <DateTimeNumberInput
              // type={parsedPattern.parts![1].type}
              disabled={disabled}
              className={cn({
                "after:content-['-']": parsedPattern.separator === "-",
                "after:content-['/']": parsedPattern.separator === "/",
              })}
              min={parsedPattern.parts![1].min}
              max={parsedPattern.parts![1].max}
              label={parsedPattern.parts![1].label}
              value={parsedPattern.parts![1].value}
              textValue={parsedPattern.parts![1].textValue}
              pattern={parsedPattern.parts![1].pattern}
              onChange={(num) => handleDateChange(parsedPattern.parts![1].type, num!)}
              onFocus={(e) => {
                onFocus?.(e);
                setFocused(true);
              }}
              onBlur={() => setFocused(false)}
            />
            <DateTimeNumberInput
              // type={parsedPattern.parts![2].type}
              disabled={disabled}
              min={parsedPattern.parts![2].min}
              max={parsedPattern.parts![2].max}
              label={parsedPattern.parts![2].label}
              value={parsedPattern.parts![2].value}
              textValue={parsedPattern.parts![2].textValue}
              pattern={parsedPattern.parts![2].pattern}
              onChange={(num) => handleDateChange(parsedPattern.parts![2].type, num!)}
              onFocus={(e) => {
                onFocus?.(e);
                setFocused(true);
              }}
              onBlur={() => setFocused(false)}
            />
          </span>
          <input
            style={{ display: "none" }}
            id={`${id}-input`}
            ref={inputRef}
            type="hidden"
            data-testid="date-input"
            tabIndex={-1}
            disabled={disabled}
            aria-hidden="true"
            aria-invalid={!!invalid}
            aria-disabled={!!disabled}
            aria-readonly={!!readonly}
            aria-required={!!required}
            name={name}
            // value={date()?.format(finalProps.pattern) ?? ""}
            value={dateStrValue}
            onInput={(e) => {
              onInput?.(e);
            }}
          />
        </>
      )}
      {!parsedPattern.isValidPattern && <span className="text-red-500">Invalid pattern</span>}
    </div>
  );
};
