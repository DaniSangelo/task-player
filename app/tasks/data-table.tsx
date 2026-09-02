"use client";

import {
  ColumnDef,
  flexRender,
  RowData,
  useTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableRow } from "../_components/ui/table";
import { features, type DataTableFeatures } from "./data-table-features";
import { Button } from "../_components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    initialState: {
      pagination: {
        pageSize: 15,
        pageIndex: 0,
      },
    },
  });

  return (
    <div className="w-full min-w-0">
      <Table>
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
                className={`${(row.original as TData & { status?: string }).status === "DONE" ? "bg-secondary/25 text-accent-200" : ""} border-none`}
                key={row.id}
              >
                {row.getAllCells().map((cell) => {
                  const isResponsive = [
                    "index",
                    "description",
                    "check",
                  ].includes(cell.column.id);

                  return (
                    <TableCell
                      className={`${isResponsive ? "hidden md:table-cell" : ""} min-h-23 px-3 py-3 sm:px-6`}
                      key={cell.id}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  );
                })}
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
          className="rounded-full p-2"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft strokeWidth={3} />
        </Button>
        <Button
          variant="outline"
          className="rounded-full p-2"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight strokeWidth={3} />
        </Button>
      </div>
    </div>
  );
}
