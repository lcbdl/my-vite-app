import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { isValidElement, ReactElement, useState } from "react";

interface DropdownMenuProps {
  trigger: string | ReactElement | (() => ReactElement);
  children: ReactElement;
}

interface DropdownMenuContentProps {
  expanded: boolean;
  children: ReactElement;
}

export interface MenuItemType {
  label: string;
  href: string;
}

export const DropdownMenu = ({ trigger, children }: DropdownMenuProps) => {
  let triggerElem: ReactElement;

  if (typeof trigger === "string") {
    triggerElem = <span>{trigger}</span>;
  } else if (typeof trigger === "function") {
    triggerElem = trigger();
  } else if (isValidElement(trigger)) {
    triggerElem = trigger;
  } else {
    throw new Error("Invalid trigger type");
  }
  const [expanded, setExpanded] = useState(false);
  const handleMouseLeave = () => {
    setExpanded(false);
  };
  return (
    <div className="dropdown-menu relative" onMouseLeave={handleMouseLeave}>
      <DropdownMenuTrigger expanded={expanded} setExpanded={setExpanded}>
        {triggerElem}
      </DropdownMenuTrigger>
      <DropdownMenuContent expanded={expanded}>{children}</DropdownMenuContent>
    </div>
  );
};

const DropdownMenuTrigger = ({
  expanded,
  setExpanded,
  children,
}: {
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  children: ReactElement;
}) => {
  const handleClick = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <div
      onClick={handleClick}
      className="flex cursor-pointer items-end py-3 text-xs hover:text-blue-500 hover:underline"
    >
      <span className="flex font-semibold select-none">{children}</span>
      <button aria-expanded={expanded} className="ml-1">
        <ChevronDown
          size={16}
          className={cn("cursor-pointer transition-transform duration-300", {
            "rotate-180": expanded,
          })}
        />
      </button>
    </div>
  );
};

const DropdownMenuContent = ({ expanded, children }: DropdownMenuContentProps) => {
  return (
    <div
      className={cn(
        "absolute right-[-25px] z-50 block rounded-md border border-solid border-gray-400 bg-white px-4 text-sm whitespace-nowrap transition-all duration-500 before:absolute before:top-[-9px] before:right-[1.5rem] before:h-[16px] before:w-[16px] before:rotate-45 before:transform before:border-t-1 before:border-l-1 before:border-solid before:border-gray-400 before:bg-white before:content-['']",
        expanded ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      {children}
    </div>
  );
};
