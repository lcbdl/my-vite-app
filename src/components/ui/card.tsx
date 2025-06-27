import { cn } from "@/lib/utils";
import React from "react";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: React.ReactNode;
  footer?: React.ReactNode;
};

export const Card: React.FC<CardProps> = ({ title, footer, children, className = "", ...props }) => {
  return (
    <div
      {...props}
      className={cn(
        "divide-y divide-gray-200 overflow-hidden rounded-2xl border border-gray-400 bg-white shadow-md",
        className,
      )}
    >
      {title && (
        <div className="bg-gray-100 px-4 py-3">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
      )}

      <div className="px-6 py-4 text-gray-700">{children}</div>

      {footer && <div className="bg-gray-100 px-6 py-3 text-sm text-gray-700">{footer}</div>}
    </div>
  );
};
