"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

import { useState } from "react";

import { type Doc, type Id } from "convex/_generated/dataModel";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import ItemsScrollArea from "@/components/items-scroll-area";
import AlertDialogModal from "@/components/alert-dialog";
import { Upload, Trash, FileText } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { useMaterialsMutations } from "@/hooks/use-materials-mutations";

type Material = Doc<"materials">;

export default function MaterialsByClassCard({
  classId,
  canUploadMaterials,
  materials,
}: {
  classId: string;
  canUploadMaterials: boolean;
  materials: Material[];
}) {
  const { deleteMaterial, isPending } = useMaterialsMutations();

  const [rowSelection, setRowSelection] = useState({});

  const columns: ColumnDef<Material>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex justify-center w-[20px]">
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
            aria-label="Select all"
            className="h-4 w-4"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center w-[20px]">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="h-4 w-4"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
      minSize: 40,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div
          className={cn(
            "flex items-center gap-2 cursor-pointer text-primary hover:underline overflow-hidden",
            "truncate",
            "max-w-[240px]"
          )}
          onClick={() => {
            const fileUrl = row.original.fileUrl;
            if (fileUrl) window.open(fileUrl, "_blank");
          }}
        >
          <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="truncate">{row.original.name}</span>
        </div>
      ),
      size: 240,
      minSize: 200,
    },
    {
      accessorKey: "size",
      header: "Size (MB)",
      cell: ({ getValue }) => {
        const sizeInMb = (Number(getValue() as number) / 1048576).toFixed(2);
        return <div>{sizeInMb}</div>;
      },
      size: 90,
      minSize: 80,
    },
    {
      accessorKey: "fileType",
      header: "Type",
      cell: ({ getValue }) => (
        <div className="uppercase">{getValue() as string}</div>
      ),
      size: 70,
      minSize: 60,
    },
    {
      id: "actions",
      header: "",
      size: 50,
      minSize: 40,
      cell: ({ row }) => (
        <div className="flex justify-center items-center">
          <AlertDialogModal
            onConfirm={async () => {
              await deleteMaterial(row.original._id as Id<"materials">);
            }}
            title="Delete Material"
            description="Are you sure you want to delete this material?"
            variant="destructive"
            alertTrigger={
              <Button
                variant="ghost"
                size="sm"
                disabled={isPending}
                className="text-red-500 hover:bg-transparent"
              >
                <Trash className="h-4 w-4 mr-2" />
              </Button>
            }
          />
        </div>
      ),
      enableSorting: false,
    },
  ];

  const table = useReactTable({
    data: materials ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
  });

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row justify-between gap-2">
        <div className="space-y-2">
          <CardTitle>Course Materials</CardTitle>
          <CardDescription>PDF and TXT documents</CardDescription>
        </div>
        <Button disabled={!canUploadMaterials} variant="default">
          <Link
            href={`/app/classes/${classId}/file-upload`}
            className="flex items-center justify-center"
          >
            <Upload className="h-4 w-4 mr-2" />
            {canUploadMaterials ? "Upload Materials" : "Limit Reached"}
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <ItemsScrollArea className="h-[400px] md:h-[600px]">
          <div className="overflow-x-auto overflow-y-visible">
            <Table className="min-w-[490px] w-full">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        style={{
                          minWidth: header.column.columnDef.size,
                          maxWidth: header.column.columnDef.size,
                          width: header.column.columnDef.size,
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
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
                            width: cell.column.columnDef.size,
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
                      No materials uploaded.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </ItemsScrollArea>
      </CardContent>{" "}
    </Card>
  );
}
