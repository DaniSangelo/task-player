import { auth } from "@/app/_lib/auth";
import { db } from "@/app/_lib/prisma";
import type { Task } from "@/app/generated/prisma/client";

//TODO: extrair o type para outro arquivo
export type TaskTableRow = Omit<Task, "time_spent"> & {
  time_spent: number;
};

export const getTasks = async (day: string): Promise<TaskTableRow[]> => {
  return await db.$queryRaw<TaskTableRow[]>`
    SELECT
      task.id,
      task.title,
      task.description,
      COALESCE((
        SELECT SUM(EXTRACT(EPOCH FROM (
          LEAST(history.finished_at, ${day}::date + INTERVAL '1 day')
          - GREATEST(history.started_at, ${day}::date)
        )))
        FROM task_progress_history AS history
        WHERE history.task_id = task.id
          AND history.started_at < ${day}::date + INTERVAL '1 day'
          AND history.finished_at > ${day}::date
      ), 0)::double precision AS time_spent,
      task.started_at,
      task.finished_at,
      task.created_at,
      task.updated_at,
      task.user_id,
      task.status
    FROM tasks AS task
    WHERE (
      task.created_at >= ${day}::date
      AND task.created_at < ${day}::date + INTERVAL '1 day'
    )
    OR EXISTS (
      SELECT 1
      FROM task_progress_history AS history
      WHERE history.task_id = task.id
        AND history.started_at < ${day}::date + INTERVAL '1 day'
        AND history.finished_at > ${day}::date
    )
    ORDER BY
      CASE WHEN status = 'DONE' THEN 99
        WHEN status = 'RUNNING' THEN 0
        ELSE 1
        END,
      updated_at DESC`;
}

/**
 * Sums only the portion of each progress session that belongs to the day.
 *
 * A session that crosses midnight is sliced by the SQL expression below:
 * `GREATEST(started_at, startOfDay)` selects the effective start and
 * `LEAST(finished_at, endOfDay)` selects the effective finish. The difference
 * between those two timestamps is therefore the slice assigned to this day.
 * The current running session is included because it is not written to the
 * progress history until the task is paused or completed.
 */
export const getDailyWorkedSeconds = async (
  day = new Date(),
): Promise<number> => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("Unauthorized user");

  const startOfDay = new Date(day);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const result = await db.$queryRaw<{ total_seconds: number | null }[]>`
    WITH progress_history AS (
      SELECT history.task_id, history.started_at, history.finished_at
      FROM task_progress_history AS history
      INNER JOIN tasks AS task ON task.id = history.task_id
      WHERE task.user_id = ${userId}::uuid

      UNION ALL

      SELECT task.id, task.started_at, CURRENT_TIMESTAMP
      FROM tasks AS task
      WHERE task.user_id = ${userId}::uuid
        AND task.status = 'RUNNING'
        AND task.started_at IS NOT NULL
    )
    SELECT COALESCE(
      SUM(EXTRACT(EPOCH FROM (
        LEAST(history.finished_at, ${endOfDay})
        - GREATEST(history.started_at, ${startOfDay})
      ))),
      0
    )::double precision AS total_seconds
    FROM progress_history AS history
    WHERE history.started_at < ${endOfDay}
      AND history.finished_at > ${startOfDay}
  `;

  return result[0]?.total_seconds ?? 0;
};

export type MonthlyWorkedHours = {
  month: string;
  total_hours: number;
};

export const getMonthlyWorkedHours = async (
  startMonth: number,
  endMonth: number,
  year: number,
  userId = "591f1101-7fc0-42d6-babf-5dfc2fc4a605",
): Promise<MonthlyWorkedHours[]> => {
  return await db.$queryRaw<MonthlyWorkedHours[]>`
    WITH months AS (
      SELECT generate_series(
        make_date(${year}, ${startMonth}, 1),
        make_date(${year}, ${endMonth}, 1),
        INTERVAL '1 month'
      ) AS month_start
    ), progress_history AS (
      SELECT history.started_at, history.finished_at
      FROM task_progress_history AS history
      INNER JOIN tasks AS task ON task.id = history.task_id
      WHERE task.user_id = ${userId}::uuid

      UNION ALL

      SELECT task.started_at, CURRENT_TIMESTAMP
      FROM tasks AS task
      WHERE task.user_id = ${userId}::uuid
        AND task.status = 'RUNNING'
        AND task.started_at IS NOT NULL
    ) 
    SELECT
      to_char(months.month_start, 'YYYY-MM') AS month,
      COALESCE(
        SUM(EXTRACT(EPOCH FROM (
          LEAST(history.finished_at, months.month_start + INTERVAL '1 month')
          - GREATEST(history.started_at, months.month_start)
        ))) / 3600,
        0
      )::double precision AS total_hours
    FROM months
    INNER JOIN progress_history AS history
      ON history.started_at < months.month_start + INTERVAL '1 month'
      AND history.finished_at > months.month_start
    GROUP BY months.month_start
    ORDER BY months.month_start
  `;
};
