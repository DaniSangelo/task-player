import { auth } from "@/app/_lib/auth";
import { db } from "@/app/_lib/prisma";
import type { Task } from "@/app/generated/prisma/client";

//TODO: extrair o type para outro arquivo
export type TaskTableRow = Task & {
  time_spent: number;
  started_at: Date | null;
};

export const getTasks = async (day: string): Promise<TaskTableRow[]> => {
  return await db.$queryRaw<TaskTableRow[]>`
    SELECT
      task.id,
      task.title,
      task.description,
      COALESCE((
        SELECT SUM(
          CASE
            WHEN history.finished_at IS NULL
              THEN EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - history.started_at))
            ELSE history.time_spent_seconds
          END
        )
        FROM task_progress_history AS history
        WHERE history.task_id = task.id
          AND history.started_at IS NOT NULL
      ), 0)::double precision AS time_spent,
      (
        SELECT history.started_at
        FROM task_progress_history AS history
        WHERE history.task_id = task.id
          AND history.started_at IS NOT NULL
          AND history.finished_at IS NULL
      ) AS started_at,
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
        AND COALESCE(history.finished_at, CURRENT_TIMESTAMP) > ${day}::date
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
 * Stored seconds are distributed across calendar boundaries using session
 * timestamps. Open sessions use the current time as their provisional finish.
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
    WITH sessions AS (
      SELECT
        history.started_at,
        COALESCE(history.finished_at, CURRENT_TIMESTAMP) AS finished_at,
        CASE
          WHEN history.finished_at IS NULL
            THEN EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - history.started_at))
          ELSE history.time_spent_seconds
        END AS time_spent_seconds
      FROM task_progress_history AS history
      INNER JOIN tasks AS task ON task.id = history.task_id
      WHERE task.user_id = ${userId}::uuid
    )
    SELECT COALESCE(
      SUM(
        sessions.time_spent_seconds
        * EXTRACT(EPOCH FROM (
            LEAST(sessions.finished_at, ${endOfDay})
            - GREATEST(sessions.started_at, ${startOfDay})
          ))
        / NULLIF(EXTRACT(EPOCH FROM (sessions.finished_at - sessions.started_at)), 0)
      ),
      0
    )::double precision AS total_seconds
    FROM sessions
    WHERE sessions.started_at < ${endOfDay}
      AND sessions.finished_at > ${startOfDay}
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
): Promise<MonthlyWorkedHours[]> => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("Unauthorized user");

  return await db.$queryRaw<MonthlyWorkedHours[]>`
    WITH months AS (
      SELECT generate_series(
        make_date(${year}, ${startMonth}, 1),
        make_date(${year}, ${endMonth}, 1),
        INTERVAL '1 month'
      ) AS month_start
    ), sessions AS (
      SELECT
        history.started_at,
        COALESCE(history.finished_at, CURRENT_TIMESTAMP) AS finished_at,
        CASE
          WHEN history.finished_at IS NULL
            THEN EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - history.started_at))
          ELSE history.time_spent_seconds
        END AS time_spent_seconds
      FROM task_progress_history AS history
      INNER JOIN tasks AS task ON task.id = history.task_id
      WHERE task.user_id = ${userId}::uuid
    )
    SELECT
      to_char(months.month_start, 'YYYY-MM') AS month,
      COALESCE(
        SUM(
          sessions.time_spent_seconds
          * EXTRACT(EPOCH FROM (
              LEAST(sessions.finished_at, months.month_start + INTERVAL '1 month')
              - GREATEST(sessions.started_at, months.month_start)
            ))
          / NULLIF(EXTRACT(EPOCH FROM (sessions.finished_at - sessions.started_at)), 0)
        ) / 3600,
        0
      )::double precision AS total_hours
    FROM months
    LEFT JOIN sessions
      ON sessions.started_at < months.month_start + INTERVAL '1 month'
      AND sessions.finished_at > months.month_start
    GROUP BY months.month_start
    ORDER BY months.month_start
  `;
};

export type MonthlyWorkedHoursByStatus = {
  status: string;
  total_hours: number;
};

export const totalHoursMonthByStatus = async (
  startDate: Date,
  endDate: Date,
): Promise<MonthlyWorkedHoursByStatus[]> => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("Unauthorized user");

  return await db.$queryRaw<MonthlyWorkedHoursByStatus[]>`
    SELECT
      task.status,
      COALESCE(
        SUM(
          CASE
            WHEN history.finished_at IS NULL
              THEN EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - history.started_at))
            ELSE history.time_spent_seconds
          END
          * EXTRACT(EPOCH FROM (
              LEAST(
                COALESCE(history.finished_at, CURRENT_TIMESTAMP),
                ${endDate}
              ) - GREATEST(history.started_at, ${startDate})
            ))
          / NULLIF(
              EXTRACT(EPOCH FROM (
                COALESCE(history.finished_at, CURRENT_TIMESTAMP)
                - history.started_at
              )),
              0
            )
        ) / 3600,
        0
      )::double precision AS total_hours
    FROM task_progress_history AS history
    INNER JOIN tasks AS task
      ON task.id = history.task_id
    WHERE task.user_id = ${userId}::uuid
      AND history.started_at < ${endDate}
      AND COALESCE(history.finished_at, CURRENT_TIMESTAMP) > ${startDate}
    GROUP BY task.status
    ORDER BY task.status
    `;
}
