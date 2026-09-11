"use client";

import { Controller, useForm } from "react-hook-form";
import { Task } from "../generated/prisma/client";
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  editTaskFormSchema,
  EditTaskFormSchema,
} from "../_actions/task/edit-task/schema";
import { DatePickerInput } from "./ui/date-picker";
import { editTask } from "../_actions/task/edit-task";
import { Button } from "./ui/button";
import { LoaderCircle } from "lucide-react";
import { useTransition } from "react";

interface EditTaskFormProps {
  defaultValues: Task;
  onSaved?: () => void;
}

const EditTaskForm = ({ defaultValues, onSaved }: EditTaskFormProps) => {
  const [isPending, startTransition] = useTransition();
  const sanitizedDefaultValues: EditTaskFormSchema = {
    title: defaultValues.title,
    description: defaultValues.description || "",
    created_at: defaultValues.created_at
      ? `${defaultValues.created_at.getUTCFullYear()}-${String(defaultValues.created_at.getUTCMonth() + 1).padStart(2, "0")}-${String(defaultValues.created_at.getUTCDate()).padStart(2, "0")}`
      : "",
  };
  const form = useForm<EditTaskFormSchema>({
    resolver: zodResolver(editTaskFormSchema),
    defaultValues: sanitizedDefaultValues,
    mode: "onSubmit",
  });

  const onSubmit = (data: EditTaskFormSchema) => {
    startTransition(async () => {
      try {
        await editTask(defaultValues.id, data);
        onSaved?.();
      } catch (error) {
        form.setError("root", {
          message:
            error instanceof Error
              ? error.message
              : "Something went wrong while editing the task.",
        });
      }
    });
  };

  const formatLocalDate = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  return (
    <DialogContent className="rounded-lg">
      <DialogHeader>
        <DialogTitle className="text-sm">Edit task</DialogTitle>
      </DialogHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="form-title">Title</FieldLabel>
                <Input
                  {...field}
                  id="form-title"
                  aria-invalid={fieldState.invalid}
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
                <FieldLabel htmlFor="form-description">Description</FieldLabel>
                <Textarea
                  {...field}
                  id="form-description"
                  aria-invalid={fieldState.invalid}
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
                <FieldLabel htmlFor="form-date">Creation date</FieldLabel>
                <DatePickerInput
                  id="form-date"
                  selectedDay={field.value || new Date()}
                  onDateChange={(date) => field.onChange(formatLocalDate(date))}
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
              <Button
                type="button"
                variant="outline"
                className="rounded-full cursor-pointer"
              >
                Cancel
              </Button>
            }
          />
          <Button
            type="submit"
            disabled={isPending}
            aria-busy={isPending}
            className="rounded-full cursor-pointer"
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
  );
};

export default EditTaskForm;
