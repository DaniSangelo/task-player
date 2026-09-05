"use client";

import { Check, LoaderCircle, Pause, Play } from "lucide-react";
import { TaskStatus } from "../generated/prisma/browser";
import type { TaskTableRow } from "../_data-access/tasks/get-tasks";
import ControlPlayerButton from "./ui/control-player.button";
import { useState, useTransition } from "react";
import { updateTaskStatus } from "../_actions/task/update-task-status";
import { TaskStatusEnum } from "../_lib/enums/task.enum";
import { useRouter } from "next/navigation";

interface ActionButtonProps {
  task: TaskTableRow;
}
const ActionButton = ({ task }: ActionButtonProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optimisticState, setOptimisticState] = useState<{
    baseStatus: TaskStatusEnum;
    status: TaskStatusEnum;
  } | null>(null);
  const status =
    optimisticState?.baseStatus === task.status
      ? optimisticState.status
      : task.status;

  const handleTaskProgress = () => {
    if (isPending) return;

    const previousStatus = status;
    const optimisticStatus =
      status === TaskStatusEnum.RUNNING
        ? TaskStatusEnum.PAUSED
        : status === TaskStatusEnum.DONE
          ? TaskStatusEnum.PAUSED
          : TaskStatusEnum.RUNNING;

    setOptimisticState({
      baseStatus: task.status as TaskStatusEnum,
      status: optimisticStatus,
    });

    startTransition(async () => {
      try {
        const updatedTask = await updateTaskStatus({
          id: task.id,
          user_id: task.user_id,
        });
        setOptimisticState({
          baseStatus: task.status as TaskStatusEnum,
          status: updatedTask.status as TaskStatusEnum,
        });
        router.refresh();
      } catch {
        setOptimisticState({
          baseStatus: task.status as TaskStatusEnum,
          status: previousStatus as TaskStatusEnum,
        });
      }
    });
  };

  const controlProps = {
    onClick: handleTaskProgress,
    disabled: isPending,
    "aria-busy": isPending,
  };

  if (isPending) {
    return (
      <ControlPlayerButton
        {...controlProps}
        icon={LoaderCircle}
        iconProps={{ size: 16, className: "animate-spin" }}
      />
    );
  }

  switch (status) {
    case TaskStatus.PENDING:
    case TaskStatus.PAUSED:
      return (
        <ControlPlayerButton
          icon={Play}
          iconProps={{ size: 16, fill: "currentColor" }}
          {...controlProps}
        />
      );
    case TaskStatus.DONE:
      return (
        <ControlPlayerButton
          icon={Check}
          iconProps={{ size: 16, strokeWidth: 3 }}
          {...controlProps}
        />
      );
    case TaskStatus.RUNNING:
      return (
        <ControlPlayerButton
          icon={Pause}
          className="bg-accent-700"
          iconProps={{ size: 16, className: "text-accent-300 fill-accent-300" }}
          {...controlProps}
        />
      );
    default:
      return (
        <ControlPlayerButton
          icon={Play}
          iconProps={{ size: 16, fill: "currentColor" }}
          {...controlProps}
        />
      );
  }
};

export default ActionButton;
