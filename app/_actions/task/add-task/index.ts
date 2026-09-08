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

  await db.task.create({
    data: { ...task, user_id: userId }
  });

  revalidatePath("/tasks")
}
