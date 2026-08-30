"use client";

import { Check, Pause, Play } from "lucide-react";
import { Task, TaskStatus } from "../generated/prisma/browser";
import ControlPlayerButton from "./ui/control-player.button";

interface ActionButtonProps {
  task: Task;
}
const ActionButton = ({ task }: ActionButtonProps) => {
  switch (task.status) {
    case TaskStatus.PENDING:
    case TaskStatus.PAUSED:
      return (
        <ControlPlayerButton
          icon={Play}
          iconProps={{ size: 16, fill: "currentColor" }}
        />
      );
    case TaskStatus.DONE:
      return (
        <ControlPlayerButton
          icon={Check}
          iconProps={{ size: 16, strokeWidth: 3 }}
        />
      );
    case TaskStatus.RUNNING:
      return (
        <ControlPlayerButton
          icon={Pause}
          className="bg-accent-700"
          iconProps={{ size: 16, className: "text-accent-300 fill-accent-300" }}
        />
      );
    default:
      return (
        <ControlPlayerButton
          icon={Play}
          iconProps={{ size: 16, fill: "currentColor" }}
        />
      );
  }
};

export default ActionButton;
