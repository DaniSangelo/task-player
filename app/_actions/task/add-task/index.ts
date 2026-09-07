"use server"

import { db } from "@/app/_lib/prisma"
import { revalidatePath } from "next/cache"
import { addTaskSchema, AddTaskSchema } from "./schema"

export const addTask = async (data: AddTaskSchema) => {
  addTaskSchema.parse(data)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { created_at, ...restOfData } = data;
  await db.task.create({
    data: { ...restOfData }
  });

  revalidatePath("/tasks")
}