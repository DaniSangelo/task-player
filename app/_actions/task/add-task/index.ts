"use server"

import { db } from "@/app/_lib/prisma"
import { auth } from "@/app/_lib/auth"
import { revalidatePath } from "next/cache"
import { addTaskSchema, AddTaskSchema } from "./schema"

export const addTask = async (data: AddTaskSchema) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized user");
  }

  const task = addTaskSchema.parse(data);
  const restOfData = { ...task };
  delete restOfData.created_at;
  await db.$transaction(async (transaction) => {
    const createdTask = await transaction.task.create({
      data: { ...restOfData, user_id: userId },
      select: { id: true },
    });

    await transaction.taskProgressHistory.create({
      data: {
        task_id: createdTask.id,
        time_spent_seconds: 0,
      },
    });
  });

  revalidatePath("/tasks")
}
