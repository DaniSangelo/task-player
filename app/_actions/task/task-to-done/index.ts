'use server';

import { db } from "@/app/_lib/prisma"
import { doneTaskSchema, DoneTaskSchema } from "./schema"
import { TaskStatusEnum } from "@/app/_lib/enums/task.enum"
import { revalidatePath } from "next/cache"
import { closeTaskProgress } from "@/app/_lib/task-progress"

export const updateTaskStatusToDoneOrUndone = async (task: DoneTaskSchema) => {
  const data = doneTaskSchema.parse(task);

  await db.$transaction(async (transaction) => {
    await transaction.$executeRaw`
      SELECT pg_advisory_xact_lock(hashtextextended(${data.user_id}::text, 0))
    `;

    const currentTasks = await transaction.$queryRaw<{
      id: string;
      status: string;
    }[]>`
      SELECT id, status
      FROM tasks
      WHERE id = ${data.id}::uuid
        AND user_id = ${data.user_id}::uuid
      FOR UPDATE
    `;

    const currentTask = currentTasks[0];
    if (!currentTask) {
      throw new Error("Task not found");
    }

    if (task.status === TaskStatusEnum.DONE && currentTask.status === TaskStatusEnum.RUNNING) {
      await closeTaskProgress(transaction, data.id, data.user_id);
    }

    await transaction.$executeRaw`
      UPDATE tasks
      SET
        status = ${task.status}::"TaskStatus",
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${data.id}::uuid
        AND user_id = ${data.user_id}::uuid
    `;
  })

  revalidatePath('/tasks');
}