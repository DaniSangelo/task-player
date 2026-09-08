"use client";

import { useState } from "react";
import { Button } from "./ui/button";
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

  const form = useForm<AddTaskSchema>({
    resolver: zodResolver(addTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: TaskStatus.PENDING,
      user_id: "",
      created_at: undefined,
    },
    mode: "onSubmit",
    shouldUnregister: true, //clean all previously filled inputs
  });

  const onSubmit = async (data: AddTaskSchema) => {
    try {
      await addTask(data);
    } catch (error) {
      console.log(`Something went wrong on add a new task: ${error?.message}`);
    } finally {
      setIsOpen(false);
    }
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
                    navigateOnSelect={false}
                    disabled
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
                <Button variant="outline" className="rounded-full cursor-pointer">
                  Cancel
                </Button>
              }
            />
            <Button type="submit" className="rounded-full cursor-pointer">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskForm;
