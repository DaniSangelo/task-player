import { ButtonHTMLAttributes, ComponentType } from "react";
import { Task } from "../generated/prisma/client";
import { Button } from "./ui/button";
import { updateTaskStatusToDone } from "../_actions/task/task-to-done";

interface IconProps {
  size?: string | number;
  strokeWidth?: string | number;
  className?: string;
  fill?: string;
  [key: string]: any;
}

interface DoneTaskButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  task: Task;
  icon?: ComponentType<IconProps>;
  iconProps?: IconProps;
}

const DoneTaskButton = ({
  task,
  icon: IconComponent,
  iconProps = {},
  ...rest
}: DoneTaskButtonProps) => {
  const handleDoneTaskClick = async () => {
    try {
      await updateTaskStatusToDone({
        id: task.id,
        user_id: task.user_id,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button
      type="button"
      variant="none"
      className="cursor-pointer"
      size="sm"
      onClick={handleDoneTaskClick}
      {...rest}
    >
      {IconComponent && <IconComponent size={14} {...iconProps} />}
    </Button>
  );
};

export default DoneTaskButton;
