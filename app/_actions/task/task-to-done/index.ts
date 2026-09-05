'use server';

import { db } from "@/app/_lib/prisma"
import { doneTaskSchema, DoneTaskSchema } from "./schema"
import { TaskStatusEnum } from "@/app/_lib/enums/task.enum"
import { revalidatePath } from "next/cache"

export const updateTaskStatusToDone = async (task: DoneTaskSchema) => {
  const data = doneTaskSchema.parse(task);

  await db.task.update({
    where: {
      id: data.id,
      user_id: data.user_id,
    },
    data: {
      status: TaskStatusEnum.DONE,
      updated_at: new Date(),
      finished_at: new Date(),
    }
  })

  revalidatePath('/tasks');
}