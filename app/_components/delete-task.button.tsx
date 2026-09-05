"use client";

import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteTask } from "../_actions/task/delete-task";
import type { TaskTableRow } from "../_data-access/tasks/get-tasks";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent, AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "./ui/alert-dialog";

interface DeleteTaskButtonProps {
  task: Pick<TaskTableRow, "id" | "user_id">;
}

const DeleteTaskButton = ({ task }: DeleteTaskButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await deleteTask({ id: task.id, user_id: task.user_id });
      setIsOpen(false);
      router.refresh();
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger
        render={
          <Button
            type="button"
            variant="none"
            size="sm"
            className="cursor-pointer text-accent-600 hover:scale-[1.08]"
            aria-label="Excluir tarefa"
            title="Excluir tarefa"
            disabled={isPending}
          >
            <Trash2Icon size={14} />
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Do you really want to delete this task?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
          <AlertDialogAction className="rounded-full" onClick={handleDelete}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTaskButton;
