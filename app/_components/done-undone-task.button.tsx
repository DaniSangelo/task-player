import { ButtonHTMLAttributes, ComponentType, useTransition } from "react";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Task } from "../generated/prisma/client";
import { Button } from "./ui/button";
import { updateTaskStatusToDoneOrUndone } from "../_actions/task/task-to-done";
import { TaskStatusEnum } from "../_lib/enums/task.enum";

interface IconProps {
  size?: string | number;
  strokeWidth?: string | number;
  className?: string;
  fill?: string;
  [key: string]: unknown;
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
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDoneTaskClick = () => {
    if (isPending) return;

    startTransition(async () => {
      try {
        await updateTaskStatusToDoneOrUndone({
          id: task.id,
          user_id: task.user_id,
          status,
        });
        router.refresh();
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <Button
      type="button"
      variant="none"
      className="cursor-pointer"
      size="sm"
      onClick={handleDoneTaskClick}
      disabled={isPending}
      aria-busy={isPending}
      {...rest}
    >
      {isPending ? (
        <LoaderCircle size={14} className="animate-spin" />
      ) : (
        IconComponent && <IconComponent size={14} {...iconProps} />
      )}
    </Button>
  );
};

export default DoneUndoneTaskButton;
