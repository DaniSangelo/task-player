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
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../_components/ui/card";
import { TaskDescriptionEnum, TaskStatusEnum } from "../_lib/enums/task.enum";
import ActionButton from "../_components/Action-Button";
import type { ComponentProps } from "react";
import TaskTime from "../_components/Task-Time";
import { Badge } from "../_components/ui/badge";

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
    getRowId: (row) => (row as TData & { id: string }).id,
    initialState: {
      pagination: {
        pageSize: 15,
        pageIndex: 0,
      },
    },
  });

  return (
    <div className="w-full min-w-0">
      <Table className="hidden md:table">
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
                There are no tasks for the picked day.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="md:hidden">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const status = (row.original as TData & { status?: string }).status;
            const statusLabel = status
              ? (TaskDescriptionEnum[
                  status as keyof typeof TaskDescriptionEnum
                ] ?? "")
              : "";

            return (
              <Card
                className={`md:hidden shadow-sm m-2 ${status == TaskStatusEnum.DONE ? "bg-secondary/25 text-accent-200" : ""}`}
                key={row.id}
              >
                <CardHeader className="">
                  <CardTitle
                    className={`text-sm ${status == TaskStatusEnum.DONE ? "line-through" : ""}`}
                  >
                    {" "}
                    {row.getValue("title")}{" "}
                  </CardTitle>
                  <CardDescription>
                    {row.getValue("description")}
                  </CardDescription>
                  <CardAction>
                    <ActionButton
                      task={
                        row.original as ComponentProps<
                          typeof ActionButton
                        >["task"]
                      }
                    />
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <p>
                    <TaskTime
                      task={
                        row.original as ComponentProps<typeof TaskTime>["task"]
                      }
                    />
                  </p>
                </CardContent>
                <CardFooter>
                  <Badge
                    className={`
                      rounded-full p-1
                      ${
                        status === TaskStatusEnum.RUNNING
                          ? "text-accent-300 fill-accent-300 bg-accent-700"
                          : status === TaskStatusEnum.DONE
                            ? "outline-1 outline-accent-400 text-accent-300"
                            : "bg-secondary/25 text-accent-700"
                      }
                    `}
                    variant="outline"
                  >
                    {statusLabel}
                  </Badge>
                </CardFooter>
              </Card>
            );
          })
        ) : (
          <p className="h-12 text-sm text-center">
            There are no tasks for the picked day.
          </p>
        )}
      </div>
      {table.getRowModel().rows?.length ? (
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
      ) : (
        <></>
      )}
    </div>
  );
}
