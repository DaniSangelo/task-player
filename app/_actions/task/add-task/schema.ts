import { TaskStatusEnum } from '@/app/_lib/enums/task.enum';
import z from 'zod';

export const addTaskSchema = z.object({
  title: z.string().trim().min(1, { message: 'Task title is mandatory' }),
  description: z.string().optional(),
  status: z.string().default(TaskStatusEnum.PENDING),
  user_id: z.string({ message: 'Task must belong to an user' }).default('591f1101-7fc0-42d6-babf-5dfc2fc4a605')
});

export type AddTaskSchema = z.input<typeof addTaskSchema>;