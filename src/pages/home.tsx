import { Button } from "@/components/ui/button";
import { DateInput } from "@/components/ui/date-time/date-input";
import { DatePicker } from "@/components/ui/date-time/date-picker";
import { TimeInput } from "@/components/ui/date-time/time-input";
import { TimePicker } from "@/components/ui/date-time/time-picker";
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
      <div className="w-full p-5">
        <div className="grid w-full grid-cols-1 gap-6">
          <div>
            <h2 className="mb-3">Button</h2>
            <div className="my-3 grid items-center gap-4 rounded-lg border border-solid border-gray-500 p-5 shadow-lg shadow-gray-500/25 sm:flex">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
            <div className="my-3 grid items-center gap-4 rounded-lg border border-solid border-gray-500 p-5 shadow-lg shadow-gray-500/25 sm:flex">
              <Button variant="primary" size="lg">
                Primary Large
              </Button>
              <Button variant="primary" size="md">
                Secondary Middium
              </Button>
              <Button variant="primary" size="sm">
                Danger Small
              </Button>
            </div>
          </div>
        </div>
        <div className="grid w-full grid-cols-1 gap-6">
          <div>
            <h2 className="mb-3">Disabled Button</h2>
            <div className="my-3 grid items-center gap-4 rounded-lg border border-solid border-gray-500 p-5 shadow-lg shadow-gray-500/25 sm:flex">
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
          </div>
        </div>
        <div className="grid w-full grid-cols-1 gap-6">
          <div>
            <h2 className="mb-3">Date input</h2>
            <div className="my-3 grid grid-cols-3 items-center gap-4 rounded-lg border border-solid border-gray-500 p-5 shadow-lg shadow-gray-500/25">
              <div>
                <h3>Normal</h3>
                <DateInput name="DOB" />
              </div>
              <div>
                <h3>With initial value</h3>
                <DateInput name="DOB" value="2025-04-23" />
              </div>
              <div>
                <h3>Disabled</h3>
                <DateInput name="DOB" value="2025-04-23" disabled />
              </div>
            </div>
          </div>
        </div>
        <div className="grid w-full grid-cols-1 gap-6">
          <div>
            <h2 className="mb-3">Date Picker</h2>
            <div className="my-3 grid grid-cols-3 items-center gap-4 rounded-lg border border-solid border-gray-500 p-5 shadow-lg shadow-gray-500/25">
              <div>
                <h3>Normal</h3>
                <DatePicker name="DOB" />
              </div>
              <div>
                <h3>With initial value</h3>
                <DatePicker name="DOB" value="2025-04-23" />
              </div>
              <div>
                <h3>Disabled</h3>
                <DatePicker name="DOB" value="2025-04-23" disabled />
              </div>
            </div>
          </div>
        </div>
        <div className="grid w-full grid-cols-1 gap-6">
          <div>
            <h2 className="mb-3">Time input</h2>
            <div className="my-3 grid grid-cols-3 items-center gap-4 rounded-lg border border-solid border-gray-500 p-5 shadow-lg shadow-gray-500/25">
              <div>
                <h3>Normal</h3>
                <TimeInput name="workTime" />
              </div>
              <div>
                <h3>With initial value</h3>
                <TimeInput name="workTime" value="23:21" />
              </div>
              <div>
                <h3>Disabled</h3>
                <TimeInput name="workTime" value="04:23" disabled />
              </div>
            </div>
          </div>
        </div>
        <div className="grid w-full grid-cols-1 gap-6">
          <div>
            <h2 className="mb-3">Time Pikcer</h2>
            <div className="my-3 grid grid-cols-3 items-center gap-4 rounded-lg border border-solid border-gray-500 p-5 shadow-lg shadow-gray-500/25">
              <div>
                <h3>Normal</h3>
                <TimePicker name="workTime" />
              </div>
              <div>
                <h3>With initial value</h3>
                <TimePicker name="workTime" value="23:21" />
              </div>
              <div>
                <h3>Disabled</h3>
                <TimePicker name="workTime" value="04:23" disabled />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
