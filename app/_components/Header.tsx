"use client";

import { Menu, TimerResetIcon, UserRound } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Avatar } from "./ui/avatar";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const path = usePathname()

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
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink className={`${navigationMenuTriggerStyle()} ${path === '/' ? 'relative font-semibold border-b-2 border-accent-700 text-primary-700' : ''}`}>
                <Link href="/">Home</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className={`${navigationMenuTriggerStyle()} ${path === '/tasks' ? 'relative font-semibold border-b-2 border-accent-700 text-primary-700' : ''}`}>
                <Link href="/tasks">Tasks</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="md:hidden flex ml-auto">
          <Sheet open={isOpen || false} onOpenChange={setIsOpen}>
            <SheetTrigger
              render={
                <Button variant="none" size="sm">
                  <Menu />
                </Button>
              }
            ></SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-4 mt-4 ml-4">
                <Link
                  href="/"
                  className="hover:bg-secondary hover:text-primary-700 p-2"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/tasks"
                  className="hover:bg-secondary hover:text-primary-700 p-2"
                  onClick={() => setIsOpen(false)}
                >
                  Tasks
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* perfil */}
        <div className="ml-6">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Avatar
                  className="flex justify-center items-center border-accent-900"
                  size="default"
                >
                  <UserRound className="text-accent-600" />
                </Avatar>
              }
            />
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuItem className="hover:bg-secondary hover:text-primary-700">Profile</DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-secondary hover:text-primary-700">Billing</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="hover:bg-secondary hover:text-primary-700">Team</DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-secondary hover:text-primary-700">Subscription</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
