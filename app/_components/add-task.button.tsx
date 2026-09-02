"use client";

import { useState } from "react";
import { Button } from "../_components/ui/button";
import { PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TaskStatus } from "../generated/prisma/enums";
import { Controller, useForm } from "react-hook-form";

const taskFormSchema = z.object({
  title: z
    .string({ message: "Title is required" })
    .min(5, { message: "Task title must have at least 5 characters" }),
  description: z.string().default(""),
  user_id: z.string().default("591f1101-7fc0-42d6-babf-5dfc2fc4a605"),
  status: z
    .enum([
      TaskStatus.PENDING,
      TaskStatus.RUNNING,
      TaskStatus.PAUSED,
      TaskStatus.DONE,
    ])
    .default(TaskStatus.PENDING),
});

type TaskFormSchemaType = z.input<typeof taskFormSchema>;

const AddTaskButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<TaskFormSchemaType>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      status: TaskStatus.PENDING,
      user_id: "",
    },
    mode: "onSubmit",
    shouldUnregister: true, //clean all previously filled inputs
  });

  const onSubmit = async (data: TaskFormSchemaType) => {
    // Promise.resolve(() => setInterval(() => 1 + 1, 1000));
    console.log(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={
          <Button className="w-full rounded-3xl text-white hover:translate-y-0.5 px-5 py-5 items-center md:w-auto">
            <PlusIcon className="text-white" />
            Add task
          </Button>
        }
      />
      <DialogContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader className="mb-3">
            <DialogTitle>Add a new task</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-title">Title</FieldLabel>
                  <Input
                    {...field}
                    id="form-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter task title"
                    max={60}
                    required
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-description">
                    Description
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-description"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter task description"
                    max={60}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <DialogFooter className="mt-6">
            <DialogClose
              render={
                <Button variant="outline" className="rounded-full">
                  Cancel
                </Button>
              }
            />
            <Button type="submit" className="rounded-full">
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskButton;
