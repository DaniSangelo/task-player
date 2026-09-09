"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { cn } from "../_lib/utils";
import { Eye, EyeOff } from "lucide-react";

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  ref?: React.Ref<HTMLInputElement>;
}

const PasswordInput = ({ className, ref, ...props }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative flex items-center">
      <Input
        {...props}
        ref={ref}
        type={showPassword ? "text" : "password"}
        className={cn("pr-10", className)}
      />
      <button
        onClick={() => setShowPassword(!showPassword)}
        type="button"
        className="absolute right-3 cursor-pointer hover:text-secondary-600"
      >
        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  );
};

export default PasswordInput;
