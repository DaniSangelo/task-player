import z from "zod";

export const updateTaskStatusSchema = z.object({
  id: z.string(),
})

export type UpdateTaskStatusSchema = z.infer<typeof updateTaskStatusSchema>;