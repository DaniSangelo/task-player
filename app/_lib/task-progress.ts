import { db } from "./prisma";

type SqlTransaction = Pick<typeof db, "$executeRaw">;

export const closeTaskProgress = async (
  transaction: SqlTransaction,
  taskId: string,
  userId: string,
) => {
  await transaction.$executeRaw`
    WITH target AS (
      SELECT id, started_at, CURRENT_TIMESTAMP AS finished_at
      FROM tasks
      WHERE id = ${taskId}::uuid
        AND user_id = ${userId}::uuid
        AND status = 'RUNNING'
        AND started_at IS NOT NULL
      FOR UPDATE
    ), updated AS (
      UPDATE tasks AS task
      SET
        time_spent = task.time_spent + GREATEST(
          (EXTRACT(EPOCH FROM (target.finished_at - target.started_at)))::integer,
          0
        ) * INTERVAL '1 second',
        started_at = NULL,
        status = 'PAUSED',
        updated_at = target.finished_at
      FROM target
      WHERE task.id = target.id
      RETURNING task.id
    )
    INSERT INTO task_progress_history (
      task_id,
      time_spent_seconds,
      started_at,
      finished_at,
      created_at,
      updated_at
    )
    SELECT
      target.id,
      GREATEST((EXTRACT(EPOCH FROM (target.finished_at - target.started_at)))::integer, 0),
      target.started_at,
      target.finished_at,
      target.finished_at,
      target.finished_at
    FROM target
    INNER JOIN updated ON updated.id = target.id
  `;
};