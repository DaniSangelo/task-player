import {
  createPaginatedRowModel,
  rowPaginationFeature,
  tableFeatures,
} from "@tanstack/react-table"

export const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
})

export type DataTableFeatures = typeof features