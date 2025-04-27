import { cn, daysInMonth, toOrdinal, zeroPad } from "@/lib/utils";
import { Dayjs } from "dayjs";
import { t } from "i18next";
import { FC, useMemo, useRef, useState } from "react";
import { v4 as uuid } from "uuid";

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

export type DateTimeField = "month" | "day" | "year" | "hour" | "minute" | "second";

type DateMetadataType = {
  type: DateTimeField;
  min: number;
  max: number;
  label: string;
  value?: number;
  textValue?: string;
  pattern: string;
};

const getDateMetadata = (type: DateTimeField, date?: Dayjs): DateMetadataType => {
  const day = date?.get("date");
  const month = date?.get("month");
  const year = date?.get("year");
  switch (type) {
    case "month":
      return {
        type,
        min: 1,
        max: 12,
        label: t("calendar.month"),
        value: month === undefined ? undefined : month + 1,
        textValue: month == undefined ? undefined : t(`calendar.months.${MONTHS[month]}.value`),
        pattern: "MM",
      };
    case "day":
      return {
        type,
        min: 1,
        max: daysInMonth(month, year),
        label: t("calendar.day"),
        value: day,
        textValue: toOrdinal(day),
        pattern: "DD",
      };
    case "year":
      return {
        type,
        min: 1,
        max: 2099,
        label: t("calendar.year"),
        value: year,
        textValue: year === undefined ? "" : `${year}`,
        pattern: "YYYY",
      };
    case "hour":
      return {
        type,
        min: 0,
        max: 23,
        label: t("calendar.hour"),
        value: date?.get("hour"),
        textValue: date?.format("h A"),
        pattern: "HH",
      };
    case "minute":
      return {
        type,
        min: 0,
        max: 59,
        label: t("calendar.minute"),
        value: date?.get("minute"),
        textValue: date?.format("mm"),
        pattern: "mm",
      };
    case "second":
      return {
        type,
        min: 0,
        max: 59,
        label: t("calendar.second"),
        value: date?.get("second"),
        textValue: date?.format("ss"),
        pattern: "ss",
      };
    default:
      return {
        type,
        min: 0,
        max: 0,
        label: "",
        value: undefined,
        textValue: "",
        pattern: "",
      };
  }
};

type NumberInputProps = {
  date?: Dayjs;
  type: DateTimeField;
  disabled?: boolean;
  readOnly?: boolean;
  tabIndex?: number;
  className?: string;
  onChange?: (value: number | undefined) => void;
};

export const NumberInput: FC<NumberInputProps> = ({
  date,
  type,
  tabIndex,
  className,
  disabled = false,
  readOnly = false,
}) => {
  const id = useMemo(() => uuid(), []);
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState<number | undefined>(date?.get(type));
  const meta = useMemo(() => getDateMetadata(type, date), [type, date]);
  const strValue = value === undefined ? meta.pattern : zeroPad(value, meta.pattern.length);

  return (
    <span
      id={id}
      ref={ref}
      aria-labelledby={id}
      aria-readonly={readOnly}
      aria-valuemin={meta.min}
      aria-valuemax={meta.max}
      aria-valuetext={meta.textValue}
      aria-label={meta.label}
      aria-disabled={disabled}
      aria-valuenow={meta.value}
      tabIndex={tabIndex}
      contentEditable={true}
      role="spinbutton"
      spellCheck={false}
      autoCapitalize="off"
      autoCorrect="off"
      inputMode="numeric"
      className={cn("bg-white text-gray-900", className)}
      onFocus={() => {
        const range = document.createRange();
        range.selectNodeContents(ref.current!);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }}
      onBeforeInput={(e) => {
        const input = (e.nativeEvent as InputEvent).data || "";
        if (!/^\d*$/.test(input)) {
          e.preventDefault();
          return;
        }

        if (input === "") {
          // Handle backspace or delete
          setValue(undefined);
          e.preventDefault();
          return;
        }
        const meta = getDateMetadata(type, date);

        if (value === undefined) {
          const newValue = input;
          const numeric = parseInt(newValue, 10);
          if (!isNaN(numeric) && numeric >= meta!.min && numeric <= meta!.max) {
            setValue(numeric);
          }
        } else {
          const currentText = value.toString();
          const newText = currentText + input;
          const numeric = parseInt(newText, 10);
          if (!isNaN(numeric) && numeric >= meta!.min && numeric <= meta!.max) {
            setValue(numeric);
          } else {
            const numeric2 = parseInt(input, 10);
            if (!isNaN(numeric2) && numeric2 >= meta!.min && numeric2 <= meta!.max) {
              setValue(numeric2);
            }
          }
        }
        e.preventDefault();
      }}
      onPaste={(e) => {
        // @ts-expect-error for older browsers
        const paste = (e.clipboardData || window.clipboardData).getData("text");
        const digitsOnly = paste.replace(/\D/g, "").substring(0, meta!.pattern.length);

        if (digitsOnly !== "") {
          if (value === undefined) {
            const numeric = parseInt(digitsOnly, 10);
            if (!isNaN(numeric) && numeric >= meta!.min && numeric <= meta!.max) {
              setValue(numeric);
            }
          } else {
            const currentText = value.toString();
            const newText = currentText + digitsOnly;
            const numeric = parseInt(newText, 10);
            if (!isNaN(numeric) && numeric >= meta!.min && numeric <= meta!.max) {
              setValue(numeric);
            } else {
              const numeric2 = parseInt(digitsOnly, 10);
              if (!isNaN(numeric2) && numeric2 >= meta!.min && numeric2 <= meta!.max) {
                setValue(numeric2);
              }
            }
          }
        }
        e.preventDefault();
      }}
      onKeyDown={(e) => {
        const allowedKeys = ["ArrowLeft", "ArrowRight", "Tab", "Home", "End"];
        if (
          allowedKeys.includes(e.key) ||
          e.ctrlKey ||
          e.metaKey // allow copy/paste/etc
        ) {
          return;
        }
        if (["Backspace", "Delete"].includes(e.key)) {
          e.preventDefault();
          setValue(undefined);
          return;
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          const newValue = value === undefined ? meta.min : value + 1;
          if (newValue <= meta.max) {
            setValue(newValue);
          }
          return;
        }
        if (e.key === "ArrowDown") {
          e.preventDefault();
          const newValue = value === undefined ? 0 : value - 1;
          if (newValue >= meta.min) {
            setValue(newValue);
          }
          return;
        }
        // Allow only digits, if the key is a single character
        if (e.key.length === 1 && !/^\d$/.test(e.key)) {
          e.preventDefault();
        }
      }}
    >
      {strValue}
    </span>
  );
};
