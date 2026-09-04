"use server"

import { db } from "@/app/_lib/prisma"
import { revalidatePath } from "next/cache"
import { addTaskSchema, AddTaskSchema } from "./schema"

export const addTask = async (data: AddTaskSchema) => {
  addTaskSchema.parse(data)
  await db.task.create({
    data,
  });

  revalidatePath("/tasks")
}