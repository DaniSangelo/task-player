import { db } from "@/app/_lib/prisma";
import type { Task } from "@/app/generated/prisma/client";

//TODO: extrair o type para outro arquivo
export type TaskTableRow = Omit<Task, "time_spent"> & {
  time_spent: number;
};

export const getTasks = async (): Promise<TaskTableRow[]> => {
  return await db.$queryRaw<TaskTableRow[]>`
    SELECT
      id,
      title,
      description,
      EXTRACT(EPOCH FROM time_spent)::double precision AS time_spent,
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

/**
 * Sums only the portion of each progress session that belongs to the day.
 *
 * A session that crosses midnight is sliced by the SQL expression below:
 * `GREATEST(started_at, startOfDay)` selects the effective start and
 * `LEAST(finished_at, endOfDay)` selects the effective finish. The difference
 * between those two timestamps is therefore the slice assigned to this day.
 */
export const getDailyWorkedSeconds = async (
  userId = "591f1101-7fc0-42d6-babf-5dfc2fc4a605",
  day = new Date(),
): Promise<number> => {
  const startOfDay = new Date(day);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const result = await db.$queryRaw<{ total_seconds: number | null }[]>`
    SELECT COALESCE(
      SUM(EXTRACT(EPOCH FROM (
        LEAST(history.finished_at, ${endOfDay})
        - GREATEST(history.started_at, ${startOfDay})
      ))),
      0
    )::double precision AS total_seconds
    FROM task_progress_history AS history
    INNER JOIN tasks AS task ON task.id = history.task_id
    WHERE task.user_id = ${userId}::uuid
      AND history.started_at < ${endOfDay}
      AND history.finished_at > ${startOfDay}
  `;

  return result[0]?.total_seconds ?? 0;
};