import { ButtonHTMLAttributes, ComponentType } from "react";
import { Task } from "../generated/prisma/client";
import { Button } from "./ui/button";
import { updateTaskStatusToDoneOrUndone } from "../_actions/task/task-to-done";
import { TaskStatusEnum } from "../_lib/enums/task.enum";

interface IconProps {
  size?: string | number;
  strokeWidth?: string | number;
  className?: string;
  fill?: string;
  [key: string]: any;
}

interface DoneTaskButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  task: Task;
  status: TaskStatusEnum;
  icon?: ComponentType<IconProps>;
  iconProps?: IconProps;
}

const DoneUndoneTaskButton = ({
  task,
  status,
  icon: IconComponent,
  iconProps = {},
  ...rest
}: DoneTaskButtonProps) => {
  const handleDoneTaskClick = async () => {
    try {
      await updateTaskStatusToDoneOrUndone({
        id: task.id,
        user_id: task.user_id,
        status,
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

export default DoneUndoneTaskButton;
