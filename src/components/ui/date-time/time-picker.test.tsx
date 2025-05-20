import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TimePicker } from "./time-picker";

// Mock dayjs
vi.mock("dayjs", async () => {
  const actual = await vi.importActual<any>("dayjs");
  return {
    ...actual,
    default: () => ({
      hour: () => 10,
      minute: () => 15,
    }),
    hour: () => 10,
    minute: () => 15,
  };
});

const openTimePicker = () => {
  act(() => {
    fireEvent.click(screen.getByRole("button", { name: "calendar.chooseTime" }));
  });
};

describe("TimePicker", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it("renders TimeInput and clock button", () => {
    render(<TimePicker value="12:34" onChange={() => {}} />);
    expect(screen.getByDisplayValue("12:34")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "calendar.chooseTime" })).toBeInTheDocument();
  });

  it("opens time picker on clock button click", () => {
    render(<TimePicker value="12:34" onChange={() => {}} />);
    openTimePicker();
    expect(screen.getByRole("region", { name: "calendar.chooseTime" })).toBeInTheDocument();
    expect(screen.getByText("calendar.hour")).toBeInTheDocument();
    expect(screen.getByText("calendar.minute")).toBeInTheDocument();
  });

  it("selects hour and minute and calls onChange on OK", () => {
    const onChange = vi.fn();
    render(<TimePicker value="12:34" onChange={onChange} />);
    openTimePicker();

    // Select hour
    fireEvent.click(screen.getByRole("button", { name: "calendar.hour: 08" }));
    // Select minute
    fireEvent.click(screen.getByRole("button", { name: "calendar.minute: 45" }));

    // Click OK
    fireEvent.click(screen.getByRole("button", { name: "common.ok" }));

    // onChange should be called with previous selectedTime (12:34)
    expect(onChange).toHaveBeenCalledWith("12:34");
  });

  it("closes time picker on cancel", async () => {
    render(<TimePicker value="12:34" onChange={() => {}} />);
    openTimePicker();

    act(() => {
      fireEvent.click(screen.getByRole("button", { name: "common.cancel" }));
      // Fast-forward timer and wait for DOM update
      vi.runAllTimers();
    });
    expect(screen.queryByRole("region", { name: "calendar.chooseTime" })).not.toBeInTheDocument();
  });

  it("disables clock button and time picker when disabled", () => {
    render(<TimePicker value="12:34" onChange={() => {}} disabled />);
    expect(screen.queryByRole("button", { name: "calendar.chooseTime" })).not.toBeInTheDocument();
    expect(screen.getByDisplayValue("12:34")).toBeDisabled();
  });

  it("shows selected hour and minute as selected", () => {
    render(<TimePicker value="05:20" onChange={() => {}} />);
    openTimePicker();
    expect(screen.getByRole("button", { name: "calendar.hour: 05" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("button", { name: "calendar.minute: 20" })).toHaveAttribute("aria-selected", "true");
  });

  it("keyboard navigation: ArrowDown/ArrowUp changes hour", () => {
    render(<TimePicker value="10:15" onChange={() => {}} />);
    openTimePicker();

    const hourBtn = screen.getByRole("button", { name: "calendar.hour: 10" });
    hourBtn.focus();

    fireEvent.keyDown(screen.getByRole("region", { name: "calendar.chooseTime" }), { key: "ArrowDown" });
    expect(document.activeElement).toHaveTextContent("11");

    fireEvent.keyDown(screen.getByRole("region", { name: "calendar.chooseTime" }), { key: "ArrowUp" });
    expect(document.activeElement).toHaveTextContent("10");
  });

  it("keyboard navigation: Home/End jumps to first/last hour", () => {
    render(<TimePicker value="10:15" onChange={() => {}} />);
    openTimePicker();

    const hourBtn = screen.getByRole("button", { name: "calendar.hour: 10" });
    hourBtn.focus();

    fireEvent.keyDown(screen.getByRole("region", { name: "calendar.chooseTime" }), { key: "Home" });
    expect(document.activeElement).toHaveTextContent("00");

    fireEvent.keyDown(screen.getByRole("region", { name: "calendar.chooseTime" }), { key: "End" });
    expect(document.activeElement).toHaveTextContent("23");
  });

  it("closes time picker on Escape key", () => {
    render(<TimePicker value="10:15" onChange={() => {}} />);
    openTimePicker();
    act(() => {
      fireEvent.keyDown(screen.getByRole("region", { name: "calendar.chooseTime" }), { key: "Escape" });
      vi.runAllTimers();
    });
    expect(screen.queryByRole("region", { name: "calendar.chooseTime" })).not.toBeInTheDocument();
  });

  it("does not call onChange if time is not valid", () => {
    const onChange = vi.fn();
    render(<TimePicker value="HH:mm" onChange={onChange} />);
    openTimePicker();
    fireEvent.click(screen.getByRole("button", { name: "common.ok" }));
    expect(onChange).not.toHaveBeenCalled();
  });
});
