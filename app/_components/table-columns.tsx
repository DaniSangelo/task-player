"use client";

import { ColumnDef, tableFeatures } from "@tanstack/react-table";
import { Task } from "@/app/generated/prisma/client";
import { Clock, Square } from "lucide-react";
import ActionButton from "./Action-Button";
import { TaskDescriptionEnum, TaskStatusEnum } from "../_lib/enums/task.enum";

export const features = tableFeatures({});
export const tasksTableColumns: ColumnDef<typeof features, Task>[] = [
  {
    accessorKey: "index",
    header: "",
    cell: ({ row }) => {
      return (
        <span className="opacity-40">
          {" "}
          {(row.index + 1).toString().padStart(2, "0")}{" "}
        </span>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Tarefa",
    cell: ({ row }) => {
      return (
        <div className="flex gap-8 items-center">
          <ActionButton task={row.original} />
          <div className="flex flex-col space-y-4">
            <span
              className={`${row.original.status === TaskStatusEnum.DONE ? "line-through" : ""} font-bold text-md`}
            >
              {row.original.title}
            </span>
            <p
              className={`text-xs ${TaskStatusEnum.RUNNING === row.original.status ? "text-accent-700" : ""}`}
            >
              {" "}
              {TaskDescriptionEnum[row.original.status]}{" "}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Descrição",
    cell: ({ row }) => {
      return (
        <div className="min-w-0">
          <label
            className="block font-heading text-[10px] mb-1 text-accent-900 tracking-widest"
            htmlFor={`details-${row.original.id}`}
          >
            DETALHES
          </label>
          <input
            id={`details-${row.original.id}`}
            className="w-full outline-0 pt-0.75 pb-1.5 text-[11px] border-b border-b-accent-50 focus:border-b-accent-500"
            defaultValue={row.original.description || ""}
            placeholder="Adicionar uma descrição..."
          />
        </div>
      );
    },
  },
  {
    accessorKey: "time_spent",
    header: "Tempo",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2 items-center">
          <Clock size={16} className="text-accent-950/50" />
          <span className="font-bold">
            {row.original.time_spent || "00:00:00"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "check",
    header: "",
    cell: ({ row }) => {
      return <Square size={14} />;
    },
  },
];
