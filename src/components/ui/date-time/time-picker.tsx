import i18next from "@/i18n/i18n.ts";
import { cn, getFocusableElements, zeroPad } from "@/lib/utils";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { Clock } from "lucide-react";
import { KeyboardEventHandler, useEffect, useRef, useState } from "react";
import { Button } from "../button";
import { isValidTime, TimeInput, TimeInputProps } from "./time-input";

const hours = Array.from({ length: 24 }, (_, i) => zeroPad(i, 2));
const minutes = Array.from({ length: 60 }, (_, i) => zeroPad(i, 2));

export type TimePickerProps = TimeInputProps;

export const TimePicker = ({
  value,
  onChange,
  disabled = false,
  required = false,
  invalid = false,
  ...inputProps
}: TimePickerProps) => {
  // Refs
  const timePickerRef = useRef<HTMLDivElement>(null);
  const hourDivRef = useRef<HTMLDivElement>(null);
  const minuteDivRef = useRef<HTMLDivElement>(null);
  const hourCellRefs = useRef<Map<string, HTMLButtonElement | null>>(new Map<string, HTMLButtonElement>());
  const minuteCellRefs = useRef<Map<string, HTMLButtonElement | null>>(new Map<string, HTMLButtonElement>());

  ////////////// States ///////////////////
  const [selectedTime, setSelectedTime] = useState<string>("HH:mm");
  const [hour, setHour] = useState<string | undefined>();
  const [minute, setMinute] = useState<string | undefined>();
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [lastControlledValue, setLastControlledValue] = useState<string | undefined>();
  const [isHiding, setIsHiding] = useState(false);

  ////////////// Effects ///////////////////
  // Focus on hour when time-picker opens
  useEffect(() => {
    if (showTimePicker && hourDivRef.current) {
      const row = hourDivRef.current.querySelector(".selected") || hourDivRef.current.querySelector(".current");
      if (row) {
        const timer = setTimeout(() => {
          (row as HTMLElement).focus();
        }, 10);
        return () => {
          clearTimeout(timer);
        };
      }
    }
  }, [showTimePicker]);

  // Click outside handler
  useEffect(() => {
    if (showTimePicker) {
      const handleClickOutside = (event: MouseEvent) => {
        if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node)) {
          hideTimePicker();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  });

  // Set selectedTime if there is initial value
  useEffect(() => {
    if (value !== lastControlledValue) {
      if (value && isValidTime(value)) {
        setSelectedTime(value);
        const [h, m] = value.split(":");
        setHour(h);
        setMinute(m);
      }
    }
    setLastControlledValue(value);
  }, []);

  // Scroll hour and minute to the middle of the view
  useEffect(() => {
    if (showTimePicker) {
      if (hourDivRef.current) scrollToRow(hourDivRef.current);
      if (minuteDivRef.current) scrollToRow(minuteDivRef.current);
    }
  }, [showTimePicker]);

  const isCurrentHour = (h: string) => h === zeroPad(dayjs().hour(), 2);
  const isCurrentMinute = (m: string) => m === zeroPad(dayjs().minute(), 2);
  const isSelectedHour = (h: string) => h === hour;
  const isSelectedMinute = (m: string) => m === minute;

  const toggleTimePicker = () => setShowTimePicker((prev) => !prev);

  const hideTimePicker = () => {
    if (showTimePicker) {
      setIsHiding(true);
      setTimeout(() => {
        setShowTimePicker(false);
        setIsHiding(false);
      }, 200);
    }
  };

  const scrollToRow = (containerRef: HTMLDivElement) => {
    if (containerRef) {
      const scrollContainer = containerRef as HTMLDivElement;
      const row = scrollContainer.querySelector(".selected") || scrollContainer.querySelector(".current");
      if (row) {
        const containerTop = scrollContainer.getBoundingClientRect().top;
        const rowTop = (row as HTMLElement).getBoundingClientRect().top;
        scrollContainer.scrollTop +=
          rowTop - containerTop - scrollContainer.clientHeight / 2 + (row as HTMLElement).offsetHeight / 2;
      }
    }
  };

  const handleSelectTime = () => {
    const time = `${hour ?? "HH"}:${minute ?? "mm"}`;
    if (isValidTime(time) && selectedTime !== time) {
      setSelectedTime(time);
      onChange?.(selectedTime);
      hideTimePicker();
    }
  };

  const handleCancelClick = () => {
    hideTimePicker();
    if (isValidTime(selectedTime)) {
      const [h, m] = selectedTime.split(":");
      setHour(h);
      setMinute(m);
    } else {
      setHour(undefined);
      setMinute(undefined);
    }
  };

  const handleTimePickerKeyDown: KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (!timePickerRef.current) return;

    const activeEl = document.activeElement as HTMLElement;
    switch (e.key) {
      case "Tab": {
        const focusables = getFocusableElements(timePickerRef.current);
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const isShift = e.shiftKey;

        if (isShift && activeEl === first) {
          e.preventDefault();
          (last as HTMLElement).focus();
        } else if (!isShift && activeEl === last) {
          e.preventDefault();
          (first as HTMLElement).focus();
        }
        break;
      }

      case "ArrowUp":
        e.preventDefault();
        if (activeEl?.hasAttribute("data-hour-cell")) {
          const newHour = zeroPad((Number.parseInt(activeEl.textContent!) - 1 + 24) % 24, 2);
          setHour(newHour);
          hourCellRefs.current.get(newHour)?.focus();
        } else if (activeEl?.hasAttribute("data-minute-cell")) {
          const newMinute = zeroPad((Number.parseInt(activeEl.textContent!) - 1 + 60) % 60, 2);
          setMinute(newMinute);
          minuteCellRefs.current.get(newMinute)?.focus();
        }
        break;

      case "ArrowDown":
        e.preventDefault();
        if (activeEl?.hasAttribute("data-hour-cell")) {
          const newHour = zeroPad((Number.parseInt(activeEl.textContent!) + 1) % 24, 2);
          setHour(newHour);
          hourCellRefs.current.get(newHour)?.focus();
        } else if (activeEl?.hasAttribute("data-minute-cell")) {
          const newMinute = zeroPad((Number.parseInt(activeEl.textContent!) + 1) % 60, 2);
          setMinute(newMinute);
          minuteCellRefs.current.get(newMinute)?.focus();
        }
        break;
      case "Home":
        e.preventDefault();
        if (activeEl?.hasAttribute("data-hour-cell")) {
          setHour("00");
          hourCellRefs.current.get("00")?.focus();
        } else if (activeEl?.hasAttribute("data-minute-cell")) {
          setMinute("00");
          minuteCellRefs.current.get("00")?.focus();
        }
        break;
      case "End":
        e.preventDefault();
        if (activeEl?.hasAttribute("data-hour-cell")) {
          setHour("23");
          hourCellRefs.current.get("23")?.focus();
        } else if (activeEl?.hasAttribute("data-minute-cell")) {
          setMinute("59");
          minuteCellRefs.current.get("59")?.focus();
        }
        break;
      case "Enter":
        e.preventDefault();
        handleSelectTime();
        break;
      case " ":
        e.preventDefault();
        if (activeEl?.hasAttribute("data-hour-cell")) {
          const newHour = activeEl.textContent!;
          setHour(newHour);
        } else if (activeEl?.hasAttribute("data-minute-cell")) {
          const newMinute = activeEl.textContent!;
          setMinute(newMinute);
        }
        break;

      case "Escape":
        hideTimePicker();
        break;
    }
  };

  return (
    <>
      <div className="relative">
        <TimeInput
          className="w-full"
          disabled={disabled}
          invalid={invalid}
          {...inputProps}
          value={selectedTime}
          onChange={(value) => {
            const arr = value.split(":");
            setHour(arr[0]);
            setMinute(arr[1]);
            setSelectedTime(value);
          }}
          onFocus={() => hideTimePicker()}
        />
        {!disabled && (
          <button
            className="absolute top-2 right-2 cursor-pointer"
            type="button"
            aria-label={i18next.t("calendar.chooseTime")}
            onClick={() => toggleTimePicker()}
          >
            <Clock size={"20px"} className="text-gray-700" />
          </button>
        )}

        {(showTimePicker || isHiding) && (
          <div
            ref={timePickerRef}
            tabIndex={0}
            onKeyDown={handleTimePickerKeyDown}
            className={cn(
              "absolute z-50 mx-auto mt-0.5 w-[150px] rounded-sm border border-gray-300 bg-white p-3 text-xs shadow-xl",
              isHiding ? "animate-slideUp" : "animate-slideDown",
            )}
            role="region"
            aria-label={i18next.t("calendar.chooseTime")}
          >
            <div className="w-full">
              <div className="grid grid-cols-2">
                <div className="w-full">
                  <div
                    className="flex-1 py-2 text-center font-semibold text-gray-700 select-none"
                    aria-label={i18next.t("calendar.hour")}
                  >
                    {i18next.t("calendar.hour")}
                  </div>
                  <div ref={hourDivRef} className="grid max-h-[200px] grid-cols-1 overflow-y-scroll">
                    {hours.map((h) => (
                      <button
                        key={h}
                        ref={(el) => {
                          hourCellRefs.current.set(h, el);
                        }}
                        type="button"
                        aria-disabled={disabled}
                        data-hour-cell
                        aria-label={`${i18next.t("calendar.hour")}: ${h}`}
                        aria-selected={isSelectedHour(h)}
                        className={cn(
                          "m-1 w-[25px] flex-1 cursor-pointer rounded-full bg-white p-1 text-center text-gray-900 focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-white focus:outline-none",
                          {
                            "bg-sky-800": isSelectedHour(h),
                            "text-white": isSelectedHour(h),
                            "border border-slate-400": isCurrentHour(h),
                            selected: isSelectedHour(h),
                            current: isCurrentHour(h),
                          },
                          isSelectedHour(h) ? "hover:opacity-90" : "hover:bg-slate-200",
                        )}
                        tabIndex={isSelectedHour(h) ? 0 : hour === undefined && isCurrentHour(h) ? 0 : -1}
                        onClick={() => setHour(h)}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div
                    className="flex-1 py-2 text-center font-semibold text-gray-700 select-none"
                    aria-label={i18next.t("calendar.minute")}
                  >
                    {i18next.t("calendar.minute")}
                  </div>
                  <div ref={minuteDivRef} className="grid max-h-[200px] grid-cols-1 overflow-y-scroll">
                    {minutes.map((m) => (
                      <button
                        key={m}
                        ref={(el) => {
                          minuteCellRefs.current.set(m, el);
                        }}
                        type="button"
                        aria-disabled={disabled}
                        data-minute-cell
                        aria-label={`${i18next.t("calendar.minute")}: ${m}`}
                        aria-selected={isSelectedMinute(m)}
                        className={cn(
                          "m-1 w-[25px] flex-1 cursor-pointer rounded-full bg-white p-1 text-center text-gray-900 focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-white focus:outline-none",
                          {
                            "bg-sky-800": isSelectedMinute(m),
                            "text-white": isSelectedMinute(m),
                            "border border-slate-400": isCurrentMinute(m),
                            selected: isSelectedMinute(m),
                            current: isCurrentMinute(m),
                          },
                          isSelectedMinute(m) ? "hover:opacity-90" : "hover:bg-slate-200",
                        )}
                        tabIndex={isSelectedMinute(m) ? 0 : minute === undefined && isCurrentMinute(m) ? 0 : -1}
                        onClick={() => setMinute(m)}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="my-4 flex items-center justify-around">
              <Button size="sm" type="button" disabled={!hour || !minute} onClick={() => handleSelectTime()}>
                {i18next.t("common.ok")}
              </Button>
              <Button type="button" size="sm" variant="danger" onClick={() => handleCancelClick()}>
                {i18next.t("common.cancel")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
