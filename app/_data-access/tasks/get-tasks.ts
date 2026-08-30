import { db } from "@/app/_lib/prisma";
import type { Task } from "@/app/generated/prisma/client";

//TODO: extrair o type para outro arquivo
export type TaskTableRow = Omit<Task, "time_spent"> & {
  time_spent: string | null;
};

export const getTasks = async (): Promise<TaskTableRow[]> => {
  return await db.$queryRaw<TaskTableRow[]>`
    SELECT
      id,
      title,
      description,
      time_spent::text AS time_spent,
      started_at,
      finished_at,
      created_at,
      updated_at,
      user_id,
      status
    FROM
      tasks
    ORDER BY
      CASE WHEN status = 'DONE' THEN 99
        WHEN status = 'RUNNING' THEN 0
        ELSE 1
        END,
      updated_at DESC`
}