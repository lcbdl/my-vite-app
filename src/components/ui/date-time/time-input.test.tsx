import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TimeInput, isValidTime } from "./time-input";

describe("isValidTime", () => {
  it("returns true for valid times", () => {
    expect(isValidTime("00:00")).toBe(true);
    expect(isValidTime("09:15")).toBe(true);
    expect(isValidTime("23:59")).toBe(true);
    expect(isValidTime("12:34")).toBe(true);
  });

  it("returns false for invalid times", () => {
    expect(isValidTime("24:00")).toBe(false);
    expect(isValidTime("12:60")).toBe(false);
    expect(isValidTime("99:99")).toBe(false);
    expect(isValidTime("ab:cd")).toBe(false);
    expect(isValidTime("12:")).toBe(false);
    expect(isValidTime(":34")).toBe(false);
    expect(isValidTime("")).toBe(false);
  });
});

describe("<TimeInput />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with default props", () => {
    render(<TimeInput />);
    expect(screen.getByTestId("time-input-container")).toBeInTheDocument();
    expect(screen.getByTestId("time-input")).toBeInTheDocument();
  });

  it("shows the correct value when value prop is provided", () => {
    render(<TimeInput value="13:45" />);
    const input = screen.getByTestId("time-input") as HTMLInputElement;
    expect(input.value).toBe("13:45");
  });

  it("shows placeholders when value is undefined", () => {
    render(<TimeInput />);
    const input = screen.getByTestId("time-input") as HTMLInputElement;
    expect(input.value).toBe("");
  });

  it("calls onChange when hour changes", () => {
    const handleChange = vi.fn();
    render(<TimeInput onChange={handleChange} />);
    // Find the hour input by label text (i18n.t("calendar.hour") is not mocked, so fallback to role)
    const hourInput = screen.getAllByRole("textbox")[0];
    fireEvent.change(hourInput, { target: { value: "10" } });
    fireEvent.blur(hourInput);
    expect(handleChange).toHaveBeenCalled();
  });

  it("calls onChange when minute changes", () => {
    const handleChange = vi.fn();
    render(<TimeInput onChange={handleChange} />);
    const minuteInput = screen.getAllByRole("textbox")[1];
    fireEvent.change(minuteInput, { target: { value: "30" } });
    fireEvent.blur(minuteInput);
    expect(handleChange).toHaveBeenCalled();
  });

  it("disables inputs when disabled prop is true", () => {
    render(<TimeInput disabled />);
    const hourInput = screen.getAllByRole("textbox")[0];
    const minuteInput = screen.getAllByRole("textbox")[1];
    expect(hourInput).toBeDisabled();
    expect(minuteInput).toBeDisabled();
  });

  it("sets aria attributes correctly", () => {
    render(<TimeInput required invalid readonly disabled />);
    const input = screen.getByTestId("time-input");
    expect(input).toHaveAttribute("aria-required", "true");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-readonly", "true");
    expect(input).toHaveAttribute("aria-disabled", "true");
  });

  it("calls onInput when input event is fired", () => {
    const handleInput = vi.fn();
    render(<TimeInput onInput={handleInput} />);
    const input = screen.getByTestId("time-input");
    fireEvent.input(input);
    expect(handleInput).toHaveBeenCalled();
  });

  it("calls onFocus when input is focused", () => {
    const handleFocus = vi.fn();
    render(<TimeInput onFocus={handleFocus} />);
    const hourInput = screen.getAllByRole("textbox")[0];
    fireEvent.focus(hourInput);
    expect(handleFocus).toHaveBeenCalled();
  });

  it("handles keyboard navigation between hour and minute", () => {
    render(<TimeInput />);
    const [hourInput, minuteInput] = screen.getAllByRole("textbox");
    hourInput.focus();
    fireEvent.keyDown(hourInput, { key: "ArrowRight" });
    // Focus should move to minute input
    expect(document.activeElement === minuteInput).toBe(true);
    fireEvent.keyDown(minuteInput, { key: "ArrowLeft" });
    expect(document.activeElement === hourInput).toBe(true);
  });
});
