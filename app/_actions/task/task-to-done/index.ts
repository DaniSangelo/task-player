'use server';

import { db } from "@/app/_lib/prisma"
import { doneTaskSchema, DoneTaskSchema } from "./schema"
import { TaskStatusEnum } from "@/app/_lib/enums/task.enum"
import { revalidatePath } from "next/cache"

export const updateTaskStatusToDoneOrUndone = async (task: DoneTaskSchema) => {
  const data = doneTaskSchema.parse(task);

  await db.task.update({
    where: {
      id: data.id,
      user_id: data.user_id,
    },
    data: {
      status: task.status,
      updated_at: new Date(),
      finished_at: task.status === TaskStatusEnum.DONE ? new Date() : null,
    }
  })

  revalidatePath('/tasks');
}