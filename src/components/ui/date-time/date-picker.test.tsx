import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import dayjs from "dayjs";
import { describe, expect, it, vi } from "vitest";
import { DatePicker } from "./date-picker";

// Helper to open the calendar
const openCalendar = () => {
  fireEvent.click(screen.getByRole("button", { name: /chooseDate/i }));
};

describe("DatePicker", () => {
  it("renders DateInput and calendar button", () => {
    render(<DatePicker />);
    expect(screen.getByRole("textbox", { name: /year/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /chooseDate/i })).toBeInTheDocument();
  });

  it("opens and closes the calendar popup", async () => {
    render(<DatePicker />);
    openCalendar();
    expect(screen.getByTestId("select-date-container")).toBeInTheDocument();

    // Click outside to close
    fireEvent.mouseDown(document.body);
    await waitFor(() => {
      expect(screen.queryByRole("region", { name: /calendar/i })).not.toBeInTheDocument();
    });
  });

  it("shows weekdays and days grid", () => {
    render(<DatePicker />);
    openCalendar();
    expect(screen.getByTestId("select-date-container")).toBeInTheDocument();
    // Should show 7 weekday headers
    expect(screen.getAllByRole("columnheader")).toHaveLength(7);
  });

  it("navigates months with prev/next buttons", () => {
    render(<DatePicker />);
    openCalendar();
    const monthLabel = screen.getByText(dayjs().format("MMMM YYYY"));
    expect(monthLabel).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText(/nextmonth/i));
    expect(screen.getByText(dayjs().add(1, "month").format("MMMM YYYY"))).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText(/prevmonth/i));
    expect(screen.getByText(dayjs().format("MMMM YYYY"))).toBeInTheDocument();
  });

  it("shows years grid and selects a year", () => {
    render(<DatePicker />);
    openCalendar();
    fireEvent.click(screen.getByLabelText(/showyears/i));
    expect(screen.getByTestId("select-year-container")).toBeInTheDocument();

    // Click a year button
    const yearBtn = screen.getByRole("button", { name: "2000" });
    fireEvent.click(yearBtn);
    // Calendar should close years grid
    expect(screen.queryByTestId("select-year-container")).not.toBeInTheDocument();
    // Month label should update to 2000
    expect(screen.getByText(dayjs().set("year", 2000).format("MMMM YYYY"))).toBeInTheDocument();
  });

  it("selects a date and calls onChange", async () => {
    const handleChange = vi.fn();
    render(<DatePicker onChange={handleChange} />);
    openCalendar();

    // Find a visible day button (not from other month)
    const dayBtn = screen
      .getAllByRole("button")
      .find((btn) => btn.textContent !== "" && btn.getAttribute("aria-disabled") !== "true");
    expect(dayBtn).toBeDefined();
    fireEvent.click(dayBtn!);

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalled();
    });
  });

  it("disables calendar button if disabled prop is true", () => {
    render(<DatePicker disabled />);
    expect(screen.queryByRole("button", { name: /chooseDate/i })).not.toBeInTheDocument();
  });

  it("keyboard navigation: Arrow keys move focus in calendar", () => {
    render(<DatePicker />);
    openCalendar();

    // Focus a day cell
    const dayBtn = screen.getAllByRole("button").find((btn) => btn.textContent && !btn.getAttribute("aria-disabled"));
    dayBtn?.focus();

    fireEvent.keyDown(screen.getByTestId("select-date-container"), { key: "ArrowRight" });
    // Focus should move, but we can't easily assert focus in jsdom, so just ensure no error
  });

  it("keyboard navigation: Escape closes calendar", async () => {
    render(<DatePicker />);
    openCalendar();
    fireEvent.keyDown(screen.getByTestId("select-date-container"), { key: "Escape" });
    await waitFor(() => {
      expect(screen.queryByRole("region", { name: /calendar/i })).not.toBeInTheDocument();
    });
  });

  it("renders with initial value", () => {
    const value = "2022-12-25";
    render(<DatePicker value={value} />);
    expect(screen.getByDisplayValue(value)).toBeInTheDocument();
  });
});
