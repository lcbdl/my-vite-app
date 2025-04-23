import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DropdownMenu } from "./dropdown-menu";

describe("DropdownMenu", () => {
  it("renders the trigger as a string", () => {
    render(
      <DropdownMenu trigger="Menu">
        <div>Menu Content</div>
      </DropdownMenu>
    );

    expect(screen.getByText("Menu")).toBeInTheDocument();
  });

  it("renders the trigger as a React element", () => {
    render(
      <DropdownMenu trigger={<button>Menu Button</button>}>
        <div>Menu Content</div>
      </DropdownMenu>
    );

    expect(screen.getByText("Menu Button")).toBeInTheDocument();
  });

  it("renders the trigger as a function", () => {
    render(
      <DropdownMenu trigger={() => <button>Menu Function</button>}>
        <div>Menu Content</div>
      </DropdownMenu>
    );

    expect(screen.getByText("Menu Function")).toBeInTheDocument();
  });

  it("toggles the dropdown content on trigger click", () => {
    render(
      <DropdownMenu trigger="Menu">
        <div>Menu Content</div>
      </DropdownMenu>
    );

    const trigger = screen.getByText("Menu");
    fireEvent.click(trigger);

    waitFor(
      () => {
        expect(screen.getByText("Menu Content")).toHaveClass("opacity-100");
      },
      { timeout: 300 }
    );

    fireEvent.click(trigger);
    waitFor(
      () => {
        expect(screen.getByText("Menu Content")).toHaveClass("opacity-0");
      },
      { timeout: 300 }
    );
  });

  it("hides the dropdown content on mouse leave", () => {
    render(
      <DropdownMenu trigger="Menu">
        <div>Menu Content</div>
      </DropdownMenu>
    );

    const dropdown = screen.getByText("Menu Content").parentElement;
    console.log("===================", dropdown);
    const trigger = screen.getByText("Menu");

    fireEvent.click(trigger);
    waitFor(
      () => {
        expect(dropdown).toHaveClass("opacity-100");
      },
      { timeout: 300 }
    );

    fireEvent.mouseLeave(dropdown!);
    expect(dropdown).toHaveClass("opacity-0");
  });

  it("throws an error for invalid trigger type", () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    expect(() =>
      render(
        <DropdownMenu trigger={123 as never}>
          <div>Menu Content</div>
        </DropdownMenu>
      )
    ).toThrow("Invalid trigger type");
    consoleErrorSpy.mockRestore();
  });
});
