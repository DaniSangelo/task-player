'use server';

import { db } from "@/app/_lib/prisma"
import { revalidatePath } from "next/cache";
import { DeleteTaskSchema } from "./schema";

export const deleteTask = async (task: DeleteTaskSchema) => {
  await db.task.delete({
    where: {
      id: task.id,
      user_id: task.user_id,
    },
  });

  revalidatePath("/tasks");
}
