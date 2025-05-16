import { cn, zeroPad } from "@/lib/utils";
import { FocusEvent, useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";

export type DateTimeFieldType = "month" | "day" | "year" | "hour" | "minute";

export type DateTimeNumberInputProps = {
  min: number;
  max: number;
  pattern: string;
  label?: string;
  value?: number;
  textValue?: string;
  tabIndex?: number;
  onChange?: (value?: number) => void;
  className?: string;
  onFocus?: (e: FocusEvent<HTMLSpanElement, Element>) => void;
  onBlur?: (e: FocusEvent<HTMLSpanElement, Element>) => void;
  disabled?: boolean;
};

export const DateTimeNumberInput = ({
  min,
  max,
  pattern,
  label,
  value: valueProp,
  textValue,
  tabIndex,
  onChange,
  className,
  onFocus,
  onBlur,
  disabled = false,
}: DateTimeNumberInputProps) => {
  const id = uuid();
  const [value, setValue] = useState(valueProp);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setValue(valueProp);
  }, [valueProp]);

  const updateValue = (v?: number) => {
    if (disabled) return;
    setValue(v);
    onChange?.(v);
  };

  const strValue = value === undefined ? pattern : zeroPad(value, pattern.length);

  return (
    <>
      <span
        id={id}
        ref={ref}
        aria-labelledby={id}
        aria-readonly={disabled}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuetext={textValue}
        aria-label={label}
        aria-disabled={disabled}
        aria-valuenow={value}
        tabIndex={disabled ? -1 : (tabIndex ?? -1)}
        contentEditable={!disabled}
        role="spinbutton"
        autoCapitalize="off"
        inputMode={disabled ? "none" : "numeric"}
        className={cn(
          "border-none bg-white focus:border-none focus:ring-0 focus:outline-none disabled:pointer-events-none disabled:opacity-70",
          {
            "pointer-events-none opacity-70": disabled,
          },
          className,
        )}
        onFocus={(e) => {
          if (disabled) return;
          if (ref.current) {
            const range = document.createRange();
            range.selectNodeContents(ref.current);
            const selection = window.getSelection();
            selection?.removeAllRanges();
            selection?.addRange(range);
          }
          onFocus?.(e);
        }}
        onBlur={(e) => !disabled && onBlur && onBlur?.(e)}
        onBeforeInput={(e) => {
          if (disabled) {
            e.preventDefault();
            return;
          }
          const input = (e.nativeEvent as InputEvent).data || "";
          if (!/^\d*$/.test(input)) {
            e.preventDefault();
            return;
          }
          if (input === "") {
            // Handle backspace or delete
            updateValue(undefined);
            e.preventDefault();
            return;
          }
          const currentValue = value;
          if (currentValue === undefined) {
            const newValue = input;
            const numeric = parseInt(newValue, 10);
            if (!isNaN(numeric) && numeric >= min && numeric <= max) {
              updateValue(numeric);
            }
          } else {
            const currentText = currentValue.toString();
            const newText = currentText + input;
            const numeric = parseInt(newText, 10);
            if (!isNaN(numeric) && numeric >= min && numeric <= max) {
              updateValue(numeric);
            } else {
              const numeric2 = parseInt(input, 10);
              if (!isNaN(numeric2) && numeric2 >= min && numeric2 <= max) {
                updateValue(numeric2);
              }
            }
          }
          e.preventDefault();
        }}
        onPaste={(e) => {
          if (disabled) {
            e.preventDefault();
            return;
          }
          // @ts-expect-error for older browsers
          const paste = (e.clipboardData || window.clipboardData).getData("text");
          const digitsOnly = paste.replace(/\D/g, "").substring(0, pattern.length);
          const currentValue = value;
          if (currentValue === undefined) {
            const numeric = parseInt(digitsOnly, 10);
            if (!isNaN(numeric) && numeric >= min && numeric <= max) {
              updateValue(numeric);
            }
          } else {
            const currentText = currentValue.toString();
            const newText = currentText + digitsOnly;
            const numeric = parseInt(newText, 10);
            if (!isNaN(numeric) && numeric >= min && numeric <= max) {
              updateValue(numeric);
            } else {
              const numeric2 = parseInt(digitsOnly, 10);
              if (!isNaN(numeric2) && numeric2 >= min && numeric2 <= max) {
                updateValue(numeric2);
              }
            }
          }
          e.preventDefault();
        }}
        onKeyDown={(e) => {
          if (disabled) {
            e.preventDefault();
            return;
          }
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
            updateValue(undefined);
            return;
          }
          if (e.key === "ArrowUp") {
            e.preventDefault();
            const newValue = (value || 0) + 1;
            if (newValue <= max) {
              updateValue(newValue);
            }
            return;
          }
          if (e.key === "ArrowDown") {
            e.preventDefault();
            const newValue = (value || 0) - 1;
            if (newValue >= min) {
              updateValue(newValue);
            }
            return;
          }
          // Allow only digits
          if (e.key.length === 1 && !/^\d$/.test(e.key)) {
            e.preventDefault();
          }
        }}
      >
        {strValue}
      </span>
    </>
  );
};
