"use server";

import { editTaskFormSchema, EditTaskFormSchema } from "./schema";
import { auth } from "@/app/_lib/auth";
import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";

export const editTask = async (taskId: string, formData: EditTaskFormSchema) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized user");
  }

  const data = editTaskFormSchema.parse(formData);

  await db.task.update({
    where: {
      id: taskId,
      user_id: userId,
    },
    data: {
      title: data.title,
      description: data.description || null,
      ...(data.created_at
        ? { created_at: new Date(`${data.created_at}T12:00:00.000Z`) }
        : {}),
    },
  });

  revalidatePath("/tasks");
};
