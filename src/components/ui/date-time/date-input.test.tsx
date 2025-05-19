import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DateInput } from "./date-input";

describe("DateInput", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with default pattern and no value", () => {
    render(<DateInput />);
    expect(screen.getByTestId("date-input-container")).toBeInTheDocument();
    expect(screen.getByTestId("date-input")).toHaveValue("");
    expect(screen.queryByText("Invalid pattern")).not.toBeInTheDocument();
  });

  it("renders with a valid value and pattern", () => {
    render(<DateInput value="2023-05-12" pattern="YYYY-MM-DD" />);
    expect(screen.getByTestId("date-input")).toHaveValue("2023-05-12");
    expect(screen.queryByText("Invalid pattern")).not.toBeInTheDocument();
  });

  it("shows error for invalid pattern", () => {
    render(<DateInput pattern="YY-MM-DD" />);
    expect(screen.getByText("Invalid pattern")).toBeInTheDocument();
  });

  it("calls onChange when a date part changes", () => {
    const handleChange = vi.fn();
    render(<DateInput value="2023-05-12" onChange={handleChange} />);
    // Find the first input (year)
    const yearInput = screen.getAllByRole("textbox")[0];
    fireEvent.change(yearInput, { target: { value: "2024" } });
    fireEvent.blur(yearInput);
    expect(handleChange).toHaveBeenCalled();
    // The value should be updated to 2024-05-12
    expect(handleChange.mock.calls[0][0]).toBe("2024-05-12");
  });

  it("handles leap year for February", () => {
    render(<DateInput value="2024-02-29" />);
    const dayInput = screen.getAllByRole("textbox")[2];
    expect(dayInput).toHaveValue("29");
  });

  it("does not allow day greater than days in month", () => {
    const handleChange = vi.fn();
    render(<DateInput value="2023-01-31" onChange={handleChange} />);
    // Change month to February (should clamp day to 28)
    const monthInput = screen.getAllByRole("textbox")[1];
    fireEvent.change(monthInput, { target: { value: "2" } });
    fireEvent.blur(monthInput);
    expect(handleChange).toHaveBeenCalledWith("2023-02-28");
  });

  it("renders as disabled", () => {
    render(<DateInput disabled />);
    const container = screen.getByTestId("date-input-container");
    expect(container).toHaveClass("pointer-events-none");
    expect(container).toHaveClass("opacity-70");
    expect(screen.getByTestId("date-input")).toBeDisabled();
  });

  it("renders as readonly", () => {
    render(<DateInput readonly />);
    expect(screen.getByTestId("date-input")).toHaveAttribute("aria-readonly", "true");
  });

  it("renders as required", () => {
    render(<DateInput required />);
    expect(screen.getByTestId("date-input")).toHaveAttribute("aria-required", "true");
  });

  it("renders as invalid", () => {
    render(<DateInput invalid />);
    expect(screen.getByTestId("date-input")).toHaveAttribute("aria-invalid", "true");
  });

  it("calls onInput when input event occurs", () => {
    const handleInput = vi.fn();
    render(<DateInput onInput={handleInput} />);
    const input = screen.getByTestId("date-input");
    fireEvent.input(input);
    expect(handleInput).toHaveBeenCalled();
  });

  it("calls onFocus when a part is focused", () => {
    const handleFocus = vi.fn();
    render(<DateInput onFocus={handleFocus} />);
    const yearInput = screen.getAllByRole("textbox")[0];
    fireEvent.focus(yearInput);
    expect(handleFocus).toHaveBeenCalled();
  });

  it("keyboard navigation between parts works", () => {
    render(<DateInput />);
    const [yearInput, monthInput, dayInput] = screen.getAllByRole("textbox");
    yearInput.focus();
    fireEvent.keyDown(yearInput, { key: "ArrowRight" });
    expect(document.activeElement).toBe(monthInput);
    fireEvent.keyDown(monthInput, { key: "ArrowRight" });
    expect(document.activeElement).toBe(dayInput);
    fireEvent.keyDown(dayInput, { key: "ArrowLeft" });
    expect(document.activeElement).toBe(monthInput);
  });

  it("renders with custom id and name", () => {
    render(<DateInput id="custom-id" name="custom-name" />);
    expect(screen.getByTestId("date-input-container")).toHaveAttribute("id", "custom-id");
    expect(screen.getByTestId("date-input")).toHaveAttribute("name", "custom-name");
  });
});
