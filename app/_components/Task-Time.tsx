"use client";

import { useEffect, useState } from "react";
import type { TaskTableRow } from "../_data-access/tasks/get-tasks";
import { TaskStatusEnum } from "../_lib/enums/task.enum";

interface TaskTimeProps {
  task: TaskTableRow;
}

const formatTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
};

const TaskTime = ({ task }: TaskTimeProps) => {
  const [now, setNow] = useState(0);
  const isRunning =
    task.status === TaskStatusEnum.RUNNING && task.started_at !== null;
  const startedAt =
    isRunning && task.started_at ? new Date(task.started_at).getTime() : 0;
  const elapsedSeconds = isRunning
    ? task.time_spent + Math.max(0, (now - startedAt) / 1000)
    : task.time_spent;

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const updateNow = () => setNow(Date.now());
    updateNow();
    const interval = setInterval(updateNow, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  return <span>{formatTime(elapsedSeconds)}</span>;
};

export default TaskTime;
