import { cn, zeroPad } from "@/lib/utils";
import React, { ChangeEvent, FocusEvent, useEffect, useMemo, useRef, useState } from "react";

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
  onFocus?: (e: FocusEvent<HTMLInputElement, Element>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement, Element>) => void;
  disabled?: boolean;
};

export const DateTimeNumberInput = ({
  min,
  max,
  pattern,
  label,
  value,
  textValue,
  tabIndex = -1,
  onChange,
  className,
  onFocus,
  onBlur,
  disabled = false,
}: DateTimeNumberInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  const [internalValue, setInternalValue] = useState(value);
  const displayValue = useMemo(
    () => (internalValue === undefined ? pattern : zeroPad(internalValue, pattern.length)),
    [internalValue, pattern],
  );
  const regx = new RegExp(`^(?:${pattern})?(\\d+)$`);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    if (inputRef.current && spanRef.current) {
      spanRef.current.textContent = displayValue;
      inputRef.current.style.width = `${spanRef.current.offsetWidth + 2}px`;
    }
  }, [displayValue]);

  const updateValue = (v?: number) => {
    if (disabled) return;
    if (!(internalValue === v)) {
      setInternalValue(v);
      onChange?.(v);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const digitsValue = inputValue.replace(/\D/g, "");

    if (digitsValue === null) {
      updateValue(undefined);
      return;
    }

    const currentValue = value;
    if (currentValue === undefined) {
      const newValue = digitsValue;
      const numeric = parseInt(newValue, 10);
      if (!isNaN(numeric) && numeric >= min && numeric <= max) {
        updateValue(numeric);
        return;
      }
    } else {
      const newText = digitsValue.slice(0 - pattern.length);
      const numeric = parseInt(newText, 10);
      if (!isNaN(numeric)) {
        if (numeric >= min && numeric <= max) {
          updateValue(numeric);
          return;
        } else if (numeric > max) {
          const newNum = numeric % 10;
          if (newNum >= min && newNum <= max) {
            updateValue(newNum);
            return;
          }
        }
      }
    }
    updateValue(currentValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    switch (e.key) {
      case "Backspace":
      case "Delete": {
        updateValue(undefined);
        e.preventDefault();
        break;
      }
      case "ArrowUp": {
        const next = (value ?? 0) + 1;
        if (next <= max) onChange?.(next);
        e.preventDefault();
        break;
      }
      case "ArrowDown": {
        const next = (value ?? 0) - 1;
        if (next >= min) onChange?.(next);
        e.preventDefault();
      }
    }
  };

  const handleOnFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (inputRef.current) {
      inputRef.current.select();
    }
    onFocus?.(e);
  };

  return (
    <div className="relative inline-block">
      <input
        ref={inputRef}
        type="text"
        pattern="\d*"
        tabIndex={disabled ? -1 : (tabIndex ?? 0)}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={textValue}
        aria-disabled={disabled}
        aria-label={label}
        disabled={disabled}
        value={displayValue}
        onFocus={handleOnFocus}
        onBlur={onBlur}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        size={pattern.length}
        className={cn(
          "border-none bg-white text-center focus:border-none focus:ring-0 focus:outline-none disabled:pointer-events-none disabled:opacity-70",
          {
            "pointer-events-none opacity-70": disabled,
          },
          className,
        )}
      />
      <span
        ref={spanRef}
        style={{
          position: "absolute",
          visibility: "hidden",
          whiteSpace: "pre",
          font: "inherit",
        }}
      >
        {displayValue}
      </span>
    </div>
  );
};
