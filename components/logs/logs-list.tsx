"use client";

import { LogWithUser, PartialUser } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { logEventText } from "@/lib/corearrays";
import { dateFormatter } from "@/lib/utils";
import { DataTable } from "../data-table";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export const LogsList: React.FC<{ me?: null | PartialUser; users?: any[] }> = ({
  me,
  users,
}) => {
  const { isLoading, error, data } = useQuery<LogWithUser[], Error>({
    queryKey: ["logs_query"],
    queryFn: async () => {
      // const query = new URLSearchParams();
      // if (from) query.append("from", from);
      // if (to) query.append("to", to);
      // `/api/dashboard/reports-overall-result?${query.toString()}`,

      const res = await fetch("/api/logs");
      if (res?.status == 401) window.location.href = "/login";
      if (!res.ok) throw new Error("Failed to fetch logs");
      return res.json();
    },
  });

  const list: LogWithUser[] = data ?? [];

  const table = useReactTable({
    data: list,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <DataTable data={list} columns={columns} isLoading={isLoading} />
    </>
  );
};

const columns: ColumnDef<LogWithUser>[] = [
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      );
    },
    cell: ({ row }) => dateFormatter(new Date(row.original.createdAt)),
  },
  {
    accessorKey: "event",
    header: "Event",
    cell: ({ row }) => logEventText[row.original.event],
  },
  {
    accessorKey: "user.username",
    header: "User",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
];
