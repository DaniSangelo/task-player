"use client";

import { createColumnHelper } from "@tanstack/react-table";

import { type DataTableFeatures } from "./data-table-features";
import ActionButton from "../_components/Action-Button";
import {
  TaskDescriptionEnum,
  TaskStatusEnum,
} from "@/app/_lib/enums/task.enum";
import type { TaskTableRow } from "@/app/_data-access/tasks/get-tasks";
import { Clock, SquareCheck, Square } from "lucide-react";
import TaskTime from "../_components/Task-Time";
import DeleteTaskButton from "../_components/delete-task.button";
import { Button } from "../_components/ui/button";
import DoneUndoneTaskButton from "../_components/done-undone-task.button";

const columnHelper = createColumnHelper<DataTableFeatures, TaskTableRow>();

export const columns = columnHelper.columns([
  columnHelper.display({
    id: "index",
    cell: ({ row }) => {
      return (
        <span className="opacity-40 text-xs">
          {" "}
          {(row.index + 1).toString().padStart(2, "0")}{" "}
        </span>
      );
    },
  }),
  columnHelper.accessor("title", {
    header: "Title",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3 sm:gap-8">
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
  }),
  columnHelper.accessor("description", {
    header: "Descrição",
    cell: ({ row }) => {
      return (
        <div className="min-w-0">
          <label
            className="block font-heading text-[10px] mb-1 text-accent-900 tracking-widest uppercase"
            htmlFor={`details-${row.original.id}`}
          >
            details
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
  }),
  columnHelper.accessor("time_spent", {
    header: "Tempo",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2 items-center">
          <Clock
            size={16}
            className={`${TaskStatusEnum.DONE !== row.original.status ? "text-accent-950/50" : ""}`}
          />
          <span className="font-bold">
            <TaskTime task={row.original} />
          </span>
        </div>
      );
    },
  }),
  columnHelper.display({
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center gap-1 p-0.5">
          <div className="">
            {row.original.status !== TaskStatusEnum.DONE ? (
              <DoneUndoneTaskButton task={row.original} icon={Square} status={TaskStatusEnum.DONE}/>
            ) : (
              <DoneUndoneTaskButton task={row.original} icon={SquareCheck} status={TaskStatusEnum.PENDING}/>
            )}
          </div>
          <div className="">
            <DeleteTaskButton task={row.original} />
          </div>
        </div>
      );
    },
  }),
]);
