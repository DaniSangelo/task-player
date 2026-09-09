"use client";

import { TimerResetIcon } from "lucide-react";
import Link from "next/link";
import Navigation from "./navigation";
import DropdownMenuProfile from "./dropdown-menu-profile";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white px-6 py-4 shadow-sm border-b border-secondary-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* logo */}
        <div className="flex p-1">
          <Link href="/home" className="flex gap-1">
            <TimerResetIcon size={25} className="text-accent-600" />
            <h1 className="text-xl font-semibold">
              task<span className="text-accent-600 font-extrabold">player</span>
            </h1>
          </Link>
        </div>

        {/* menus */}
        <Navigation />

        {/* perfil */}
        <DropdownMenuProfile />
      </div>
    </header>
  );
};

export default Header;
