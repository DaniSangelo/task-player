import z from "zod";

export const doneTaskSchema = z.object({
  id: z.string(),
  user_id: z.string(),
})

export type DoneTaskSchema = z.infer<typeof doneTaskSchema>