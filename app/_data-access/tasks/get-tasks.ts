import { db } from "@/app/_lib/prisma";
import { Task } from "@/app/generated/prisma/client";

export const getTasks = async (): Promise<Task[]> => {
  return (await db.task.findMany({ orderBy: { updated_at: 'desc' } }));
}