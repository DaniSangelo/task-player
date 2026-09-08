'use server';

import { db } from "@/app/_lib/prisma"
import { revalidatePath } from "next/cache";
import { DeleteTaskSchema } from "./schema";
import auth from "@/middleware";

export const deleteTask = async (task: DeleteTaskSchema) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized user");
  }

  await db.task.delete({
    where: {
      id: task.id,
      user_id: userId,
    },
  });

  revalidatePath("/tasks");
}
