import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DateTimeNumberInput, DateTimeNumberInputProps } from "./date-time-number-input";

const defaultProps: DateTimeNumberInputProps = {
  min: 1,
  max: 31,
  pattern: "DD",
};

describe("DateTimeNumberInput", () => {
  it("renders with default props", () => {
    const { getByRole } = render(<DateTimeNumberInput {...defaultProps} />);
    const input = getByRole("textbox") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe("DD");
  });

  it("renders with a value", () => {
    const { getByRole } = render(<DateTimeNumberInput {...defaultProps} value={5} />);
    const input = getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe("05");
  });

  it("calls onChange with correct value on valid input", () => {
    const onChange = vi.fn();
    const { getByRole } = render(<DateTimeNumberInput {...defaultProps} onChange={onChange} />);
    const input = getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "12" } });
    expect(onChange).toHaveBeenCalledWith(12);
  });

  it("does not call onChange if input is less than min", () => {
    const onChange = vi.fn();
    const { getByRole } = render(<DateTimeNumberInput {...defaultProps} value={10} onChange={onChange} />);
    const input = getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "00" } });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("calls onChange with mod number if input is more than max", () => {
    const onChange = vi.fn();
    const { getByRole } = render(<DateTimeNumberInput {...defaultProps} value={10} onChange={onChange} />);
    const input = getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "99" } });
    expect(onChange).toHaveBeenCalledWith(9);
  });

  it("calls onChange with undefined on invalid input", () => {
    const onChange = vi.fn();
    const { getByRole } = render(<DateTimeNumberInput {...defaultProps} value={12} onChange={onChange} />);
    const input = getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "ab" } });
    expect(onChange).toHaveBeenCalledWith(undefined);
  });

  it("handles ArrowUp and ArrowDown keys", () => {
    const onChange = vi.fn();
    const { getByRole } = render(<DateTimeNumberInput {...defaultProps} value={10} onChange={onChange} />);
    const input = getByRole("textbox") as HTMLInputElement;
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(onChange).toHaveBeenCalledWith(11);
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(onChange).toHaveBeenCalledWith(9);
  });

  it("does not increment above max or decrement below min", () => {
    const onChange = vi.fn();
    const { getByRole, rerender } = render(<DateTimeNumberInput {...defaultProps} value={31} onChange={onChange} />);
    const input = getByRole("textbox") as HTMLInputElement;
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(onChange).not.toHaveBeenCalledWith(32);

    rerender(<DateTimeNumberInput {...defaultProps} value={1} onChange={onChange} />);
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(onChange).not.toHaveBeenCalledWith(0);
  });

  it("calls onChange with undefined on Backspace/Delete", () => {
    const onChange = vi.fn();
    const { getByRole } = render(<DateTimeNumberInput {...defaultProps} value={10} onChange={onChange} />);
    const input = getByRole("textbox") as HTMLInputElement;
    fireEvent.keyDown(input, { key: "Backspace" });
    expect(onChange).toHaveBeenCalledWith(undefined);
    fireEvent.keyDown(input, { key: "Delete" });
    expect(onChange).toHaveBeenCalledWith(undefined);
  });

  it("disables input when disabled prop is true", () => {
    const { getByRole } = render(<DateTimeNumberInput {...defaultProps} disabled />);
    const input = getByRole("textbox") as HTMLInputElement;
    expect(input).toBeDisabled();
  });

  it("calls onFocus and onBlur handlers", () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    const { getByRole } = render(<DateTimeNumberInput {...defaultProps} onFocus={onFocus} onBlur={onBlur} />);
    const input = getByRole("textbox") as HTMLInputElement;
    fireEvent.focus(input);
    expect(onFocus).toHaveBeenCalled();
    fireEvent.blur(input);
    expect(onBlur).toHaveBeenCalled();
  });

  it("applies aria attributes", () => {
    const { getByRole } = render(
      <DateTimeNumberInput {...defaultProps} value={15} textValue="fifteen" label="Day" disabled />,
    );
    const input = getByRole("textbox") as HTMLInputElement;
    expect(input).toHaveAttribute("aria-valuemin", "1");
    expect(input).toHaveAttribute("aria-valuemax", "31");
    expect(input).toHaveAttribute("aria-valuenow", "15");
    expect(input).toHaveAttribute("aria-valuetext", "fifteen");
    expect(input).toHaveAttribute("aria-label", "Day");
    expect(input).toHaveAttribute("aria-disabled", "true");
  });
});
