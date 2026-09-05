import { TaskStatusEnum } from "@/app/_lib/enums/task.enum";
import z from "zod";

export const doneTaskSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  status: z.enum(TaskStatusEnum),
})

export type DoneTaskSchema = z.infer<typeof doneTaskSchema>