import z from "zod";

export const editTaskFormSchema = z.object({
  title: z.string().trim().min(1, { message: 'Task title is mandatory' }),
  description: z.string().optional(),
  created_at: z.string().optional(),
})

export type EditTaskFormSchema = z.input<typeof editTaskFormSchema>