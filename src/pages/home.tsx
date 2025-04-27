import { Button } from "@/components/ui/button";
import { NumberInput } from "@/components/ui/date-time-input";
import { DropdownMenu, MenuItemType } from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { Link } from "react-router";

const HomePage = () => {
  const menuItems: MenuItemType[] = [
    { label: "Game", href: "/game" },
    { label: "About", href: "/about" },
  ];
  return (
    <div>
      <h1>Home page</h1>
      <div className="flex-col-3 flex gap-2">
        <DropdownMenu
          trigger={
            <>
              <Globe size={14} className="mr-2" />
              <span>English</span>
            </>
          }
        >
          <ul>
            {menuItems.map(({ label, href }, index) => (
              <li key={index} className="my-3">
                <Link
                  to={href}
                  className="cursor-pointer font-semibold select-none hover:text-blue-500 hover:underline"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </DropdownMenu>
      </div>
      <div>
        <h2>Button</h2>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
      <div>
        <h2>Disabled Button</h2>
        <Button variant="primary" disabled>
          Primary
        </Button>
        <Button variant="secondary" disabled>
          Secondary
        </Button>
        <Button variant="danger" disabled>
          Danger
        </Button>
        <Button variant="ghost" disabled>
          Ghost
        </Button>
      </div>
      <div>
        <h2>Number inputs</h2>
        <div className="flex gap-2">
          <NumberInput type="day" />
          <NumberInput type="month" />
          <NumberInput type="year" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
