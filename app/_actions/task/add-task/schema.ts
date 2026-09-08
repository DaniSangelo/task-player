import { TaskStatus } from '@/app/generated/prisma/enums';
import z from 'zod';

export const addTaskSchema = z.object({
  title: z.string().trim().min(1, { message: 'Task title is mandatory' }),
  description: z.string().optional(),
  status: z.enum(TaskStatus).default(TaskStatus.PENDING),
});

export type AddTaskSchema = z.input<typeof addTaskSchema>;
