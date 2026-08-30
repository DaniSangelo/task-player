"use client";

import {
  ColumnDef,
  flexRender,
  RowData,
  useTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell, TableRow
} from "./table";
import { features } from "../table-columns";
import { Circle } from "lucide-react";

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<typeof features, TData>[];
  data: TData[];
}

export function DataTable<TData extends RowData>({
  columns,
  data,
}: DataTableProps<TData>) {
  const table = useTable({
    key: "tasks-table",
    features,
    columns,
    data,
  });

  return (
    <div className="flex flex-col border border-accent-100/50 rounded-md">
      <div className="flex px-5 py-5 items-center gap-2 border-b border-accent-100/50">
        <Circle size={10} className="fill-accent-500 text-accent-500" />
        <p className="text-sm">Tarefas de hoje</p>
        <p className="text-[10px] text-secondary-500 bg-accent-50 rounded-full py-1 px-2">
          5
        </p>
      </div>
      <Table className="bg-primary-50/10 rounded-md">
        {/* <TableHeader className="border-b-accent-400">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow className="border-none" key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id}>
                  {" "}
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader> */}
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                className={`${row.original.status === "DONE" ? "bg-secondary/25 text-accent-200" : ""} border-none`}
                key={row.id}
              >
                {row.getAllCells().map((cell) => (
                  <TableCell className="py-3 px-6 min-h-23" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Não há tarefas nesse dia
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
