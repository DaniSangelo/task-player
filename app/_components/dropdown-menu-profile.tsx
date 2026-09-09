'use client';

import { LogOut, UserRound } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useState } from "react";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";

const DropdownMenuProfile = () => {

  const [isOpen, setIsOpen] = useState(false);
  const handleSignout = async () => {
    await signOut({ redirectTo: "/auth/login" });
  };

  return (
    <div className="ml-6">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="none" size="sm">
              <Avatar
                className="flex justify-center items-center border-accent-900"
                size="lg"
              >
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>
                  <UserRound size={24} className="text-accent-600" />
                </AvatarFallback>
              </Avatar>
            </Button>
          }
        />
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuItem className="hover:bg-secondary hover:text-primary-700 w-full">
              <Link
                href="/profile"
                // className="hover:bg-secondary hover:text-primary-700 p-2"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="hover:bg-secondary hover:text-primary-700 cursor-pointer"
              onClick={() => handleSignout()}
            >
              Log out
              <LogOut />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DropdownMenuProfile;
