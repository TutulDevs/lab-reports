"use client";

import { LogWithUser, LogWithUserForList, PartialUser } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { logEventText, periodOptions } from "@/lib/corearrays";
import { dateFormatter } from "@/lib/utils";
import { DataTable } from "../data-table/data-table";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";
import { DataTableToolbar } from "../data-table/data-table-toolbar";
import { DataTablePaginationBar } from "../data-table/data-table-pagination-bar";

export const LogsList: React.FC<{ me?: null | PartialUser; users?: any[] }> = ({
  me,
  users,
}) => {
  const [from, setFrom] = useState(periodOptions[0].value);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"asc" | "dsc">("dsc");
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const toggleSort = () => {
    setSort((prev) => (prev === "asc" ? "dsc" : "asc"));
    setOffset(0);
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setOffset(0);
  };

  const { isLoading, error, data } = useQuery<LogWithUserForList, Error>({
    queryKey: ["logs_query", { from, query, sort, limit, offset }],
    queryFn: async () => {
      const q = new URLSearchParams();
      if (from) q.append("from", from);
      if (query) q.append("query", query);
      if (sort) q.append("sort", sort);
      if (limit) q.append("limit", limit.toString());
      if (offset) q.append("offset", offset.toString());
      const endpoint = `/api/logs?${q.toString()}`;

      // console.log('endpoint:',endpoint)

      const res = await fetch(endpoint);
      if (res?.status == 401) window.location.href = "/login";
      if (!res.ok) throw new Error("Failed to fetch logs");
      return res.json();
    },
  });

  const list: LogWithUser[] = data?.data ?? [];
  const totalCount = data?.total ?? 0;

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
      cell: ({ row }) => {
        const username = row.original.user?.username;
        const isMe = row.original.userId == me?.id;

        return `${username}${isMe ? " (me)" : ""}`;
      },
    },
    {
      accessorKey: "ip_address",
      header: "IP Address",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
  ];

  return (
    <>
      <DataTableToolbar
        query={query}
        sort={sort}
        onQueryChange={handleQueryChange}
        onSortToggle={toggleSort}
        from={from}
        onFromChange={setFrom}
      />

      <DataTable data={list} columns={columns} isLoading={isLoading} />

      <DataTablePaginationBar
        total={totalCount}
        limit={limit}
        offset={offset}
        onLimitChange={setLimit}
        onOffsetChange={setOffset}
      />
    </>
  );
};
