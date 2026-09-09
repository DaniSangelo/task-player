"use server";

import { db } from "@/app/_lib/prisma";
import { UpdateTaskStatusSchema } from "./schema";
import { revalidatePath } from "next/cache";
import { updateTaskStatusSchema } from "./schema";
import { closeTaskProgress } from "@/app/_lib/task-progress";
import auth from "@/proxy";

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
    }[]>`
      SELECT id, status
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
        SET status = 'RUNNING', updated_at = CURRENT_TIMESTAMP
        WHERE id = ${data.id}::uuid
          AND user_id = ${userId}::uuid
      `;

      await transaction.$executeRaw`
        INSERT INTO task_progress_history (
          task_id,
          time_spent_seconds,
          started_at,
          finished_at,
          created_at,
          updated_at
        )
        VALUES (
          ${data.id}::uuid,
          0,
          CURRENT_TIMESTAMP,
          NULL,
          CURRENT_TIMESTAMP,
          CURRENT_TIMESTAMP
        )
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
    }[]>`
      SELECT
        status,
        COALESCE((
          SELECT SUM(
            CASE
              WHEN history.finished_at IS NULL
                THEN EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - history.started_at))
              ELSE history.time_spent_seconds
            END
          )
          FROM task_progress_history AS history
          WHERE history.task_id = tasks.id
            AND history.started_at IS NOT NULL
        ), 0)::double precision AS time_spent
      FROM tasks
      WHERE id = ${data.id}::uuid
        AND user_id = ${userId}::uuid
    `;

    return { ...updatedTasks[0], stoppedTaskIds };
  });

  revalidatePath("/tasks");
  return updatedTask;
}