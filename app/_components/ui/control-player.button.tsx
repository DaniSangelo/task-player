import React, { ButtonHTMLAttributes, ComponentType } from "react";
import { Button } from "./button";
import { cn } from "@/app/_lib/utils";

interface IconProps {
  size?: string | number;
  strokeWidth?: string | number;
  className?: string;
  fill?: string;
  [key: string]: any;
}

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ComponentType<IconProps>;
  iconProps?: IconProps;
}

const ControlPlayerButton: React.FC<CustomButtonProps> = ({
  icon: IconComponent,
  iconProps = {},
  className,
}) => {
  return (
    <Button
      type="button"
      variant="none"
      size="xs"
      className={cn("hover:cursor-pointer bg-accent-100 rounded-full transition-transform duration-200 hover:scale-[1.08] text-accent-500 p-2", className)}
    >
      {IconComponent && (
        <IconComponent
          size={18}
          strokeWidth={2}
          {...iconProps}
        />
      )}
    </Button>
  );
};

export default ControlPlayerButton;
