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
  await db.$transaction(async (transaction) => {
    const createdTask = await transaction.task.create({
      data: {
        title: task.title,
        description: task.description,
        status: task.status,
        user_id: userId,
        ...(task.created_at
          ? { created_at: new Date(`${task.created_at}T12:00:00.000Z`) }
          : {}),
      },
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
