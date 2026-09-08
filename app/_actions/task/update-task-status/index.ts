"use server";

import { db } from "@/app/_lib/prisma";
import { UpdateTaskStatusSchema } from "./schema";
import { revalidatePath } from "next/cache";
import { updateTaskStatusSchema } from "./schema";
import { closeTaskProgress } from "@/app/_lib/task-progress";
import auth from "@/middleware";

export const updateTaskStatus = async (task: UpdateTaskStatusSchema) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized user");
  }
  const data = updateTaskStatusSchema.parse(task);
  const stoppedTaskIds: string[] = [];

  const updatedTask = await db.$transaction(async (transaction) => {
    await transaction.$executeRaw`
      SELECT pg_advisory_xact_lock(hashtextextended(${userId}::text, 0))
    `;

    const currentTasks = await transaction.$queryRaw<{
      id: string;
      status: string;
      started_at: Date | null;
    }[]>`
      SELECT id, status, started_at
      FROM tasks
      WHERE id = ${data.id}::uuid
        AND user_id = ${userId}::uuid
      FOR UPDATE
    `;

    const currentTask = currentTasks[0];
    if (!currentTask) {
      throw new Error("Task not found");
    }

    if (currentTask.status === "RUNNING") {
      await closeTaskProgress(transaction, data.id, userId);
    } else if (currentTask.status === "PENDING" || currentTask.status === "PAUSED") {
      const runningTasks = await transaction.$queryRaw<{ id: string }[]>`
        SELECT id
        FROM tasks
        WHERE user_id = ${userId}::uuid
          AND status = 'RUNNING'
        FOR UPDATE
      `;

      for (const runningTask of runningTasks) {
        stoppedTaskIds.push(runningTask.id);
        await closeTaskProgress(transaction, runningTask.id, userId);
      }

      await transaction.$executeRaw`
        UPDATE tasks
        SET status = 'RUNNING', started_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${data.id}::uuid
          AND user_id = ${userId}::uuid
      `;
    } else if (currentTask.status === "DONE") {
      await transaction.$executeRaw`
        UPDATE tasks
        SET status = 'PAUSED', updated_at = CURRENT_TIMESTAMP
        WHERE id = ${data.id}::uuid
          AND user_id = ${userId}::uuid
      `;
    }

    const updatedTasks = await transaction.$queryRaw<{
      status: string;
      time_spent: number;
      started_at: Date | null;
    }[]>`
      SELECT
        status,
        EXTRACT(EPOCH FROM time_spent)::double precision AS time_spent,
        started_at
      FROM tasks
      WHERE id = ${data.id}::uuid
        AND user_id = ${userId}::uuid
    `;

    return { ...updatedTasks[0], stoppedTaskIds };
  });

  revalidatePath("/tasks");
  return updatedTask;
}