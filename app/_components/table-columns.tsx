"use client";

import { ColumnDef, tableFeatures } from "@tanstack/react-table";
import { Task } from "@/app/generated/prisma/client";

export const features = tableFeatures({});
export const tasksTableColumns: ColumnDef<typeof features, Task>[] = [
  {
    accessorKey: "index",
    header: "#",
    cell: ({ row }) => {
      return <span> {(row.index + 1).toString().padStart(2, "0")} </span>;
    },
  },
  {
    accessorKey: "title",
    header: "Tarefa",
  },
  {
    accessorKey: "description",
    header: "Descrição",
  },
  {
    accessorKey: "time_spent",
    header: "Tempo",
  },
];
