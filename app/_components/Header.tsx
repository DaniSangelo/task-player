"use client";

import { Settings, TimerResetIcon } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathName = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white px-6 py-4 shadow-sm border-b border-secondary-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* logo */}
        <div className="flex p-1">
          <Link href="/" className="flex gap-1">
            <TimerResetIcon size={25} className="text-accent-600" />
            <h1 className="text-xl font-semibold">
              task<span className="text-accent-600 font-extrabold">player</span>
            </h1>
          </Link>
        </div>

        {/* menus */}

        <nav className="hidden md:flex w-1/3 justify-center">
          <ul className="flex items-center gap-8">
            <li>
              <Link
                className={`${pathName === "/" ? "relative pb-2 font-semibold text-accent-600 border-b-2 border-accent-600 " : ""}`}
                href="/"
              >
                {" "}
                Home{" "}
              </Link>
            </li>
            <li>
              <Link
                className={`${pathName === "/tasks" ? "relative pb-2 font-semibold text-accent-600 border-b-2 border-accent-600 " : ""}`}
                href="/tasks"
              >
                {" "}
                Tasks{" "}
              </Link>
            </li>
          </ul>
        </nav>

        {/* perfil */}
        <div>
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer rounded-full"
          >
            <Settings size={18} className="text-accent-600" />
          </Button>
        </div>
        {/* todo: dropdown menu for settings */}
      </div>
    </header>
  );
};

export default Header;
