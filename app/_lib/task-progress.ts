import { db } from "./prisma";

type SqlTransaction = Pick<typeof db, "$executeRaw">;

export const closeTaskProgress = async (
  transaction: SqlTransaction,
  taskId: string,
  userId: string,
) => {
  await transaction.$executeRaw`
    WITH target AS (
      SELECT history.id, history.task_id, history.started_at,
        CURRENT_TIMESTAMP AS finished_at
      FROM task_progress_history AS history
      INNER JOIN tasks AS task ON task.id = history.task_id
      WHERE history.task_id = ${taskId}::uuid
        AND task.user_id = ${userId}::uuid
        AND task.status = 'RUNNING'
        AND history.started_at IS NOT NULL
        AND history.finished_at IS NULL
      FOR UPDATE
    ), closed AS (
      UPDATE task_progress_history AS history
      SET
        time_spent_seconds = GREATEST(
          EXTRACT(EPOCH FROM (target.finished_at - target.started_at))::integer,
          0
        ),
        finished_at = target.finished_at,
        updated_at = target.finished_at
      FROM target
      WHERE history.id = target.id
      RETURNING history.task_id
    )
    UPDATE tasks AS task
    SET status = 'PAUSED', updated_at = CURRENT_TIMESTAMP
    FROM closed
    WHERE task.id = closed.task_id
  `;
};