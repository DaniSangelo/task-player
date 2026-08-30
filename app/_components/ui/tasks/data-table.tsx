"use client";

import {
  ColumnDef,
  flexRender,
  RowData,
  useTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableRow } from "../table";
import { features, type DataTableFeatures } from "./data-table-features";
import { Button } from "../button";

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<DataTableFeatures, TData>[];
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
    <div>
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
      <div className="flex items-center justify-center space-x-2 py-4">
        <Button
          variant="outline"
          className="rounded-full text-xs"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          className="rounded-full text-xs"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
