import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";

describe("Button Component", () => {
  it("renders correctly with default props", () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-blue-700 text-white");
  });

  it("applies correct classes based on variant and size props", () => {
    render(
      <Button variant="danger" size="lg">
        Delete
      </Button>,
    );
    const button = screen.getByRole("button", { name: /delete/i });
    expect(button).toHaveClass("bg-red-700 text-white px-5 py-3 text-lg");
  });

  it("calls onClick handler when clicked", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when the disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole("button", { name: /disabled/i });
    expect(button).toBeDisabled();
  });

  it("creates and removes ripple on click", async () => {
    const { getByRole } = render(<Button>Click me</Button>);
    const button = getByRole("button");

    expect(button.querySelector("span")).toBeNull();

    fireEvent.click(button);

    const ripple = button.querySelector("span");
    expect(ripple).not.toBeNull();
    expect(ripple).toHaveClass("animate-ripple");
  });
});
