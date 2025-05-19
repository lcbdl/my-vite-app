import i18n from "@/i18n/i18n.ts";
import { cn, getFocusableElements } from "@/lib/utils";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/fr";
import { Calendar as ChevronCalendar, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { KeyboardEventHandler, useEffect, useRef, useState } from "react";
import { DateInput, DateInputProps } from "./date-input";

export interface CalendarDay {
  day: number;
  date: Dayjs;
  isOtherMonth: boolean;
}

export type DatePickerProps = DateInputProps & {
  displayFormat?: string;
};

export const DatePicker = ({
  pattern = "YYYY-MM-DD",
  required = false,
  disabled = false,
  invalid = false,
  value,
  displayFormat,
  onChange,
  ...inputProps
}: DatePickerProps) => {
  const lang = i18n.language;
  const TODAY = dayjs();

  const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"].map((day) => ({
    label: i18n.t(`calendar.weekday.${day}.shortLabel`),
    value: i18n.t(`calendar.weekday.${day}.value`),
  }));

  const dateFormat = displayFormat ?? (i18n.language === "en" ? "MMMM D, YYYY" : "D MMMM YYYY");

  const isValidDate = (strData: string, pattern: string) => {
    const date = dayjs(strData, pattern);
    return date && date.isValid() && strData === date.format(pattern);
  };

  // Refs
  const yearDivRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const dateCellRefs = useRef<Map<string, HTMLButtonElement | null>>(new Map<string, HTMLButtonElement>());

  ////////////// State ///////////////////
  const [focusedYear, setFocusedYear] = useState<number | undefined>();
  const [focusedDate, setFocusedDate] = useState<Dayjs | undefined>();
  const [selectedDate, setSelectedDate] = useState<string | undefined>(value);
  const [showYears, setShowYears] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  // for navigation
  const [currentDate, setCurrentDate] = useState<string>(value ?? TODAY.format(pattern));
  const [weeks, setWeeks] = useState<CalendarDay[][]>([]);
  const [isHiding, setIsHiding] = useState(false);

  ////////////// Effects ///////////////////
  //Watch for focusedDate, showCalendar, and showYear changes, and call .focus() when it updates
  useEffect(() => {
    if (focusedDate && showCalendar && !showYears) {
      setTimeout(() => {
        const el = dateCellRefs.current.get(focusedDate.format("YYYY-MM-DD"));
        el?.focus();
      }, 10);
    } else {
      if (yearDivRef.current) {
        const allYears = Array.from(yearDivRef.current.querySelectorAll("button"));
        setTimeout(() => {
          if (focusedYear) {
            allYears.find((b) => b.textContent === focusedYear?.toString())?.focus();
          } else {
            allYears.find((b) => b.textContent === focusedYear?.toString())?.focus();
          }
          // Scroll to the year when show year selection
          scrollToRow();
        }, 10);
      }
    }
  }, [focusedDate, focusedYear, showCalendar, showYears]);

  // Click outside handler
  useEffect(() => {
    if (showCalendar) {
      const handleClickOutside = (event: MouseEvent) => {
        if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
          hideCalendar();
          setShowYears(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showCalendar, calendarRef.current]);

  // update days of the calendar when navigate through months
  useEffect(() => {
    updateDays(dayjs(currentDate, pattern));
  }, [currentDate, pattern]);

  // call onChange if the selectedDate changes
  useEffect(() => {
    if (selectedDate !== undefined) {
      onChange?.(selectedDate);
    }
  });

  const hideCalendar = () => {
    if (showCalendar) {
      setIsHiding(true);
      setTimeout(() => {
        setShowCalendar(false);
        setIsHiding(false);
      }, 200);
    }
  };

  // Generate years array to selecting year.
  const years = Array.from({ length: 50 }, (_, i) => Array.from({ length: 4 }, (_, j) => 1900 + i * 4 + j));

  // Updates the calendar grid
  const updateDays = (date: Dayjs = dayjs(currentDate, pattern)) => {
    // get the first day of the month and the last day of the month
    const startOfMonth = date.startOf("month");
    const endOfMonth = date.endOf("month");
    // get the weekday of the first day of the month
    const startWeekday = startOfMonth.day(); // 0 = Sunday, 6 = Saturday

    const prevMonth = date.subtract(1, "month");
    const prevMonthNumOfDays = prevMonth.daysInMonth();

    let daysArray: CalendarDay[] = [];

    // Fill previous month's days
    for (let i = startWeekday - 1; i >= 0; i--) {
      const thisDate = prevMonth.date(prevMonthNumOfDays - i);
      daysArray.push({
        day: prevMonthNumOfDays - i,
        date: thisDate,
        isOtherMonth: true,
      });
    }

    // Fill current month's days
    for (let i = 1; i <= endOfMonth.date(); i++) {
      const thisDate = date.date(i);
      daysArray.push({ day: i, date: thisDate, isOtherMonth: false });
    }

    // Fill next month's days to complete the last row
    const remainingDays = (7 - (daysArray.length % 7)) % 7;
    for (let i = 1; i <= remainingDays; i++) {
      const thisDate = date.add(1, "month").date(i);
      daysArray.push({ day: i, date: thisDate, isOtherMonth: true });
    }

    // Group into weeks (chunks of 7)
    const weeksArray: CalendarDay[][] = [];
    for (let i = 0; i < daysArray.length; i += 7) {
      weeksArray.push(daysArray.slice(i, i + 7));
    }
    setWeeks(weeksArray);
  };

  // Navigating between months
  const prevMonth = () => {
    const currentDayjs = dayjs(currentDate, pattern);
    const newDate = currentDayjs.subtract(1, "month");
    setCurrentDate(newDate.format(pattern));
    const selectedDayjs = dayjs(selectedDate, pattern);
    if (newDate.isSame(selectedDayjs, "month")) {
      setFocusedDate(selectedDayjs);
    } else {
      setFocusedDate(newDate);
    }
  };

  const nextMonth = () => {
    const currentDayjs = dayjs(currentDate, pattern);
    const newDate = currentDayjs.add(1, "month");
    setCurrentDate(newDate.format(pattern));
    const selectedDayjs = dayjs(selectedDate, pattern);
    if (newDate.isSame(selectedDayjs, "month")) {
      setFocusedDate(selectedDayjs);
    } else {
      setFocusedDate(newDate);
    }
  };

  const scrollToRow = () => {
    if (yearDivRef.current) {
      const scrollContainer = yearDivRef.current;
      const row = scrollContainer.querySelector(".selected") || scrollContainer.querySelector(".current");
      if (row) {
        const containerTop = scrollContainer.getBoundingClientRect().top;
        const rowTop = (row as HTMLElement).getBoundingClientRect().top;
        scrollContainer.scrollTop +=
          rowTop - containerTop - scrollContainer.clientHeight / 2 + (row as HTMLElement).offsetHeight / 2;
      }
    }
  };

  const handleSelectYear = (year: number) => {
    const newValue = dayjs(currentDate, pattern).set("year", year);
    setCurrentDate(newValue.format(pattern));
    setShowYears(false);
  };

  const handleSelectDate = (date: Dayjs) => {
    setSelectedDate(date.format(pattern));
    hideCalendar();
  };

  const toggleShowCalendar = () => {
    const newValue = !showCalendar;
    setShowCalendar(newValue);
    if (newValue) {
      // Set initial focus date when calendar opens
      if (selectedDate && isValidDate(selectedDate!, pattern)) {
        const dateToFocus = dayjs(selectedDate, pattern);
        setFocusedDate(dateToFocus);
        setFocusedYear(dateToFocus.year());
        setCurrentDate(selectedDate);
      } else {
        const dateToFocus = dayjs(currentDate, pattern);
        setFocusedDate(dateToFocus);
        setFocusedYear(dateToFocus.year());
      }
    }
    if (!newValue) {
      setShowYears(false);
    }
  };

  const selectedYear = selectedDate === undefined ? undefined : dayjs(selectedDate, pattern).year();

  const handleCalendarKeyDown: KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (!focusedDate || !calendarRef.current) return;

    const current = focusedDate!;
    const activeEl = document.activeElement as HTMLElement;
    const isCalendarCell = activeEl?.closest("[data-calendar-cell]");
    const isYearCell = activeEl?.closest("[data-year-cell]");
    const currentDayjs = dayjs(currentDate, pattern);
    switch (e.key) {
      case "Tab": {
        const focusables = getFocusableElements(calendarRef.current);
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

      case "ArrowLeft":
        if (isCalendarCell) {
          e.preventDefault();
          const newDate = current.subtract(1, "day");
          if (newDate.isSame(currentDayjs, "year") && newDate.isSame(currentDayjs, "month")) {
            setFocusedDate(newDate);
          }
        } else if (isYearCell) {
          let prevYear = (focusedYear ?? currentDayjs.year()) - 1;
          if (prevYear < 1900) {
            prevYear = 1900;
          }
          setFocusedYear(prevYear);
        }
        break;

      case "ArrowRight":
        if (isCalendarCell) {
          e.preventDefault();
          const newDate = current.add(1, "day");
          if (newDate.isSame(currentDayjs, "year") && newDate.isSame(currentDayjs, "month")) {
            setFocusedDate(newDate);
          }
        } else if (isYearCell) {
          let prevYear = (focusedYear ?? currentDayjs.year()) + 1;
          if (prevYear > 2099) {
            prevYear = 2099;
          }
          setFocusedYear(prevYear);
        }
        break;

      case "ArrowUp":
        if (isCalendarCell) {
          e.preventDefault();
          const newDate = current.subtract(1, "week");
          if (newDate.isSame(currentDayjs, "year") && newDate.isSame(currentDayjs, "month")) {
            setFocusedDate(newDate);
          }
        } else if (isYearCell) {
          let prevYear = (focusedYear ?? currentDayjs.year()) - 4;
          if (prevYear < 1900) {
            prevYear = 1900;
          }
          setFocusedYear(prevYear);
        }
        break;

      case "ArrowDown":
        if (isCalendarCell) {
          e.preventDefault();
          const newDate = current.add(1, "week");
          if (newDate.isSame(currentDayjs, "year") && newDate.isSame(currentDayjs, "month")) {
            setFocusedDate(newDate);
          }
        } else if (isYearCell) {
          let prevYear = (focusedYear ?? currentDayjs.year()) + 4;
          if (prevYear > 2099) {
            prevYear = 2099;
          }
          setFocusedYear(prevYear);
        }
        break;

      case "Enter":
      case " ":
        if (isCalendarCell) {
          e.preventDefault();
          handleSelectDate(current);
        }
        break;

      case "Escape":
        hideCalendar();
        break;
    }
  };

  return (
    <>
      <div className="relative">
        <DateInput
          className="w-full"
          {...inputProps}
          disabled={disabled}
          invalid={invalid}
          value={selectedDate}
          onChange={(value) => {
            setSelectedDate(value);
          }}
          onFocus={() => hideCalendar()}
        />
        {!disabled && (
          <button
            className="absolute top-2 right-2"
            type="button"
            aria-label={i18n.t("calendar.chooseDate")}
            onClick={() => toggleShowCalendar()}
          >
            <ChevronCalendar size={"20px"} className="text-gray-700" />
          </button>
        )}

        {(showCalendar || isHiding) && (
          <div
            ref={calendarRef}
            tabIndex={0}
            onKeyDown={handleCalendarKeyDown}
            className={cn(
              "absolute z-50 mx-auto mt-0.5 w-[250px] rounded-sm border border-gray-300 bg-white p-3 text-xs shadow-xl",
              isHiding ? "animate-slideUp" : "animate-slideDown",
            )}
            role="region"
            aria-labelledby="calendar-label"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <p id="calendar-label" className="font-semibold">
                  {dayjs(currentDate, pattern).locale(lang).format("MMMM YYYY")}
                </p>
                <button
                  type="button"
                  aria-label={i18n.t("calendar.showYears")}
                  className="cursor-pointer rounded-full p-1 hover:bg-slate-200"
                  onClick={() => setShowYears((prev) => !prev)}
                >
                  <ChevronDown size="18px" />
                </button>
              </div>
              <div className="flex items-center gap-1">
                {!showYears && (
                  <>
                    <button
                      type="button"
                      className="cursor-pointer rounded-full p-1 hover:bg-slate-200"
                      onClick={prevMonth}
                      aria-label={i18n.t("calendar.prevMonth")}
                    >
                      <ChevronLeft size="18px" />
                    </button>
                    <button
                      type="button"
                      className="cursor-pointer rounded-full p-1 hover:bg-slate-200"
                      onClick={nextMonth}
                      aria-label={i18n.t("calendar.nextMonth")}
                    >
                      <ChevronRight size="18px" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {showYears && (
              <div
                className="max-h-[200px] w-full overflow-y-auto"
                role="grid"
                data-testid="select-year-container"
                ref={yearDivRef}
              >
                <div role="rowgroup">
                  {years.map((row, rowIndex) => (
                    <div className="grid grid-cols-4" role="row" key={rowIndex}>
                      {row.map((year) => {
                        const isSelectedYear = year === selectedYear;
                        const isCurrentYear = year === TODAY.year();
                        return (
                          <button
                            key={year}
                            type="button"
                            className={cn(
                              "m-1 cursor-pointer rounded-2xl p-1 focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-white focus:outline-none",
                              {
                                "bg-sky-800": isSelectedYear,
                                "text-white": isSelectedYear,
                                "hover:bg-slate-200": !isSelectedYear,
                                "opacity-90": isSelectedYear,
                                "border border-slate-400": isCurrentYear,
                                selected: isSelectedYear,
                                current: isCurrentYear,
                              },
                            )}
                            data-year-cell
                            onClick={() => handleSelectYear(year)}
                          >
                            {year}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {!showYears && (
              <div className="w-full" role="grid" data-testid="select-date-container">
                <div role="rowgroup">
                  <div className="grid grid-cols-7" role="row">
                    {weekdays.map((day) => (
                      <div
                        key={day.value}
                        role="columnheader"
                        className="flex-1 py-2 text-center font-semibold text-gray-700"
                        aria-label={day.value}
                      >
                        {day.label}
                      </div>
                    ))}
                  </div>
                </div>

                <div role="rowgroup">
                  {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="grid grid-cols-7" role="row">
                      {week.map((cell, cellIndex) => {
                        const isSelectedDate = cell.date.format(pattern) === selectedDate;
                        const isCurrentDate = cell.date.isSame(TODAY, "date");
                        return (
                          <button
                            key={cellIndex}
                            ref={(el) => {
                              dateCellRefs.current.set(cell.date.format("YYYY-MM-DD"), el);
                            }}
                            type="button"
                            aria-disabled={disabled || cell.isOtherMonth}
                            data-calendar-cell
                            aria-label={`${isCurrentDate ? i18n.t("calendar.today") + ", " : ""}${cell.date.locale(lang).format(dateFormat)}`}
                            aria-current={isCurrentDate ? "date" : undefined}
                            aria-selected={isSelectedDate ? "true" : undefined}
                            className={cn(
                              "m-1 w-[25px] flex-1 rounded-full bg-white p-1 text-center text-gray-900",
                              {
                                "bg-sky-800": isSelectedDate,
                                "text-white": isSelectedDate,
                                "hover:bg-slate-200": !cell.isOtherMonth && !isSelectedDate,
                                "hover:opacity-90": !cell.isOtherMonth && isSelectedDate,
                                "border border-slate-400": isCurrentDate,
                                selected: isSelectedDate,
                                current: isCurrentDate,
                              },
                              cell.isOtherMonth
                                ? ""
                                : "cursor-pointer focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-white focus:outline-none",
                            )}
                            tabIndex={cell.date.isSame(focusedDate, "date") ? 0 : -1}
                            onClick={() => handleSelectDate(cell.date)}
                          >
                            {cell.isOtherMonth ? "" : cell.day}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
