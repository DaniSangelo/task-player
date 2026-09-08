"use client";

import { useState, useTransition } from "react";
import { Button } from "./ui/button";
import { LoaderCircle, PlusIcon } from "lucide-react";
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
import { TaskStatus } from "../generated/prisma/enums";
import { Controller, useForm } from "react-hook-form";
import { addTask } from "../_actions/task/add-task";
import { addTaskSchema, AddTaskSchema } from "../_actions/task/add-task/schema";
import { DatePickerInput } from "./ui/date-picker";

interface AddTaskFormProps {
  selectedDay: string | Date;
}

const AddTaskForm = ({ selectedDay }: AddTaskFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<AddTaskSchema>({
    resolver: zodResolver(addTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: TaskStatus.PENDING,
      created_at: "",
    },
    mode: "onSubmit",
    shouldUnregister: true, //clean all previously filled inputs
  });

  const onSubmit = (data: AddTaskSchema) => {
    startTransition(async () => {
      try {
        await addTask(data);
        form.reset();
        setIsOpen(false);
      } catch (error) {
        form.setError("root", {
          message:
            error instanceof Error
              ? error.message
              : "Something went wrong while adding the task.",
        });
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={
          <Button className="w-full rounded-3xl text-white hover:translate-y-0.5 px-5 py-5 items-center md:w-auto cursor-pointer">
            <PlusIcon className="text-white" size={14} />
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
            <Controller
              name="created_at"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-date">Due date</FieldLabel>
                  <DatePickerInput
                    id="form-date"
                    selectedDay={field.value || selectedDay}
                    onDateChange={field.onChange}
                    navigateOnSelect={false}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          {form.formState.errors.root && (
            <FieldError errors={[form.formState.errors.root]} className="mt-4" />
          )}
          <DialogFooter className="mt-6">
            <DialogClose
              render={
                <Button variant="outline" className="rounded-full cursor-pointer">
                  Cancel
                </Button>
              }
            />
            <Button
              type="submit"
              className="rounded-full cursor-pointer"
              disabled={isPending}
              aria-busy={isPending}
            >
              {isPending ? (
                <LoaderCircle size={14} className="animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskForm;
