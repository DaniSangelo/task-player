import z from "zod";

export const updateTaskStatusSchema = z.object({
  id: z.string(),
  user_id: z.string().default('591f1101-7fc0-42d6-babf-5dfc2fc4a605')
})

export type UpdateTaskStatusSchema = z.infer<typeof updateTaskStatusSchema>;