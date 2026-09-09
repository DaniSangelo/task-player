"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
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
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const path = usePathname();

  return (
    <>
      <NavigationMenu className="hidden md:flex">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              render={<Link href="/home">Home</Link>}
              className={`rounded-lg ${navigationMenuTriggerStyle()} ${path === "/home" ? "relative font-semibold border-b-2 border-accent-700 text-primary-700" : ""}`}
            />
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              render={<Link href="/tasks">Tasks</Link>}
              className={`rounded-lg ${navigationMenuTriggerStyle()} ${path === "/tasks" ? "relative font-semibold border-b-2 border-accent-700 text-primary-700" : ""}`}
            />
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              render={<Link href="/dashboard">Dashboard</Link>}
              className={`rounded-lg ${navigationMenuTriggerStyle()} ${path === "/dashboard" ? "relative font-semibold border-b-2 border-accent-700 text-primary-700" : ""}`}
            />
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
                href="/home"
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
              <Link
                href="/dashboard"
                className="hover:bg-secondary hover:text-primary-700 p-2"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default Navigation;
