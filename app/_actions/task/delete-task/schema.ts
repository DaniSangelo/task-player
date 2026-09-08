import z from "zod";

export const deleteTaskSchema = z.object({
  id: z.string(),
})

export type DeleteTaskSchema = z.infer<typeof deleteTaskSchema>