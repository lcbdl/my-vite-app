import { cn, zeroPad } from "@/lib/utils";
import i18next from "i18next";
import { FocusEvent, FormEventHandler, useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { DateTimeNumberInput } from "./date-time-number-input";

export const isValidTime = (value: string) => {
  const timeRgx = /^(([0|1]\d)|(2[0-3])):([0-5]\d)$/;
  return timeRgx.test(value);
};

export type TimeInputProps = {
  id?: string;
  name?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  invalid?: boolean;
  value?: string;
  className?: string;
  onChange?: (value: string) => void;
  onInput?: FormEventHandler<HTMLInputElement>;
  onFocus?: (e: FocusEvent<HTMLSpanElement, Element>) => void;
};

export const TimeInput = ({
  id: idProp,
  name,
  disabled = false,
  readonly = false,
  required = false,
  invalid = false,
  value,
  className,
  onChange,
  onInput,
  onFocus,
}: TimeInputProps) => {
  const id = uuid();

  ////////////// State ///////////////////
  const [hour, setHour] = useState<number | undefined>();
  const [minute, setMinute] = useState<number | undefined>();
  const [focused, setFocused] = useState(false);

  /////////// Refs /////////////////////
  let inputRef = useRef<HTMLInputElement>(null);

  ////////////// Effects ///////////////////
  // sync hour and minute when value property changes
  useEffect(() => {
    if (value) {
      const arr = value.split(":").map((str) => Number.parseInt(str));
      setHour(isNaN(arr[0]) ? undefined : arr[0]);
      setMinute(isNaN(arr[1]) ? undefined : arr[1]);
    } else {
      setHour(undefined);
      setMinute(undefined);
    }
  }, [value]);

  const timeStrValue = () =>
    hour === undefined && minute === undefined
      ? ""
      : `${hour === undefined ? "HH" : zeroPad(hour!, 2)}:${minute === undefined ? "mm" : zeroPad(minute!, 2)}`;

  const handleTimeChange = (type: "hour" | "minute", num: number) => {
    const newHour = type === "hour" ? num : hour;
    const newMinute = type === "minute" ? num : minute;
    setHour(newHour);
    setMinute(newMinute);
    if (inputRef.current) {
      inputRef.current.value = timeStrValue();
      inputRef.current.dispatchEvent(new InputEvent("input", { bubbles: true }));
      inputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
    }
    onChange?.(timeStrValue());
  };

  return (
    <div
      id={idProp}
      data-testid="time-input-container"
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
          disabled={disabled}
          tabIndex={0}
          className="after:content-[':']"
          min={0}
          max={23}
          label={i18next.t("calendar.hour")}
          value={hour}
          textValue={hour === undefined ? "HH" : zeroPad(hour!, 2)}
          pattern="HH"
          onChange={(num) => handleTimeChange("hour", num!)}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={() => setFocused(false)}
        />
        <DateTimeNumberInput
          disabled={disabled}
          min={0}
          max={59}
          label={i18next.t("calendar.minute")}
          value={minute}
          textValue={minute === undefined ? "mm" : zeroPad(minute!, 2)}
          pattern="mm"
          onChange={(num) => handleTimeChange("minute", num!)}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={() => setFocused(false)}
        />
      </span>
      <input
        style={{ display: "none" }}
        id={`${id}-input`}
        ref={inputRef}
        type="hidden"
        data-testid="time-input"
        tabIndex={-1}
        disabled={disabled}
        aria-hidden="true"
        aria-invalid={!!invalid}
        aria-disabled={!!disabled}
        aria-readonly={!!readonly}
        aria-required={!!required}
        name={name}
        value={timeStrValue()}
        onInput={onInput}
      />
    </div>
  );
};
