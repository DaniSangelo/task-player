CREATE TABLE "task_progress_history" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "task_id" UUID NOT NULL,
    "time_spent_seconds" INTEGER NOT NULL,
    "started_at" TIMESTAMP(6) NOT NULL,
    "finished_at" TIMESTAMP(6) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "task_progress_history_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "task_progress_history_task_id_started_at_finished_at_idx"
ON "task_progress_history"("task_id", "started_at", "finished_at");

ALTER TABLE "task_progress_history"
ADD CONSTRAINT "task_progress_history_task_id_fkey"
FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE "task_progress_history"
ADD CONSTRAINT "task_progress_history_time_spent_seconds_check"
CHECK ("time_spent_seconds" >= 0 AND "finished_at" >= "started_at");