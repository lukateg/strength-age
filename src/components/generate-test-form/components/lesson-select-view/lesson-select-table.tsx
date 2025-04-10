import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

import { type ControllerRenderProps } from "react-hook-form";
import { type TestFormValues } from "@/components/generate-test-form/generate-test-form";
import { type LessonsType } from "@/types/types";

export type Lesson = {
  _id: string;
  title: string;
};

export default function LessonSelectTable({
  lessons,
  field,
}: {
  lessons: LessonsType[] | undefined;
  field: ControllerRenderProps<TestFormValues, "lessons">;
}) {
  const columns: ColumnDef<Lesson>[] = [
    {
      id: "_id",
      accessorKey: "_id",
      header: () => (
        <div className="flex justify-center w-[20px]">
          <Checkbox
            checked={lessons?.every((lesson) =>
              field.value.includes(lesson._id)
            )}
            onCheckedChange={(value) =>
              field.onChange(value ? lessons?.map((lesson) => lesson._id) : [])
            }
            aria-label="Select all"
            className="h-4 w-4"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center w-[20px]">
          <Checkbox
            checked={field.value.includes(row.getValue("_id"))}
            onCheckedChange={(checked) =>
              field.onChange(
                checked
                  ? [...field.value, row.getValue("_id")]
                  : field.value.filter((id) => id !== row.getValue("_id"))
              )
            }
            aria-label="Select row"
            className="h-4 w-4"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      size: 5, // Tanstack's size units (not exact px, used proportionally)
    },
    {
      accessorKey: "title",
      header: "Lesson title",
      cell: ({ row }) => (
        <div className="w-full capitalize">{row.getValue("title")}</div>
      ),
    },
  ];

  const table = useReactTable({
    data: lessons ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });
  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{
                        minWidth: header.column.columnDef.size,
                        maxWidth: header.column.columnDef.size,
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="h-[300px]">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        minWidth: cell.column.columnDef.size,
                        maxWidth: cell.column.columnDef.size,
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {field.value.length} of {lessons?.length} row(s) selected.
        </div>
      </div>
    </div>
  );
}
