import { cn } from "@/lib/utils";
import React, { MouseEventHandler, useRef } from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
};

const baseClasses =
  "inline-flex items-center justify-center font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none relative overflow-hidden shadow-lg tracking-wider select-none";

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-blue-700 text-white hover:bg-blue-800 focus-visible:ring-blue-500",
  secondary:
    "bg-gray-300 text-gray-900 hover:bg-gray-400 focus-visible:ring-gray-500",
  danger: "bg-red-700 text-white hover:bg-red-800 focus-visible:ring-red-500",
  ghost:
    "bg-transparent text-gray-800 hover:bg-gray-200 focus-visible:ring-gray-400",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-5 py-3 text-lg",
};

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "primary",
  size = "md",
  disabled,
  onClick,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    const button = buttonRef.current;
    if (!button) return;

    const ripple = document.createElement("span");
    const rect = button.getBoundingClientRect();
    const size = Math.max(button.clientWidth, button.clientHeight);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.position = "absolute";
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.className =
      "pointer-events-none bg-white/60 opacity-75 rounded-full animate-ripple";
    button.appendChild(ripple);
    ripple.addEventListener("animationend", () => {
      ripple.remove();
    });
    onClick?.(e);
  };

  const classes = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  return (
    <button
      ref={buttonRef}
      className={classes}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};
