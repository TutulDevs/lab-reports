"use client";

import { LogWithUser, LogWithUserForList, PartialUser } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { logEventList, logEventText } from "@/lib/corearrays";
import { dateFormatter } from "@/lib/utils";
import { DataTable } from "../data-table/data-table";
import { DataTableToolbar } from "../data-table/data-table-toolbar";
import { DataTablePaginationBar } from "../data-table/data-table-pagination-bar";
import { useTableFilters } from "@/hooks/use-table-filters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState } from "react";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { addDays } from "date-fns";
import * as XLSX from "xlsx";

export const LogsList: React.FC<{ me?: null | PartialUser; users?: any[] }> = ({
  me,
  users,
}) => {
  const {
    from,
    handleFromChange,
    query,
    debouncedQuery,
    sort,
    limit,
    setLimit,
    offset,
    setOffset,
    onSortChange,
    handleQueryChange,
  } = useTableFilters();

  const [event, setEvent] = useState<string>("ALL");
  const [userId, setUserId] = useState<string>("ALL");

  const { isLoading, error, data } = useQuery<LogWithUserForList, Error>({
    // queryKey: [
    //   "logs_query",
    //   { from, debouncedQuery, sort, limit, offset, userId },
    // ],
    // queryFn: async () => {
    //   const q = new URLSearchParams();
    //   if (from) q.append("from", from);
    //   if (debouncedQuery) q.append("query", debouncedQuery);
    //   if (sort) q.append("sort", sort);
    //   if (limit) q.append("limit", limit.toString());
    //   if (offset) q.append("offset", offset.toString());
    //   if (userId && userId !== "ALL") q.append("userId", userId);

    //   const res = await fetch(`/api/logs?${q.toString()}`);
    //   // if (res?.status == 401) window.location.href = "/login";
    //   if (!res.ok) throw new Error("Failed to fetch logs");
    //   return res.json();
    // },
    queryKey: [
      `/api/logs?${new URLSearchParams({
        from,
        query: debouncedQuery || "",
        sort,
        limit: limit.toString(),
        offset: offset.toString(),
        userId: userId !== "ALL" ? userId : "",
        event: event !== "ALL" ? event : "",
      })}`,
    ],
  });

  const list: LogWithUser[] = data?.data ?? [];
  const totalCount = data?.total ?? 0;

  const columns: ColumnDef<LogWithUser>[] = [
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) =>
        dateFormatter(row.original.createdAt, "dd MMM yyyy hh:mm:ss a"),
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
        const username = row.original.user?.username ?? "N/A";
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

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownlaod = async (from: string, to?: string) => {
    try {
      setIsDownloading(true);

      const fromDate =
        from == "ALL" ? null : dateFormatter(new Date(from), "yyyy-MM-dd");
      const toDate = dateFormatter(
        addDays(!to || to == "ALL" ? new Date() : new Date(to), 1),
        "yyyy-MM-dd",
      );

      const q = new URLSearchParams();
      if (fromDate) q.append("from", fromDate);
      if (toDate) q.append("to", toDate);
      q.append("isDownload", "1");

      const res = await fetch(`/api/logs?${q.toString()}`);

      if (!res.ok) {
        toast.error("Failed to download");
        return;
      }

      const data = await res.json();
      const logs: LogWithUser[] = data?.data ?? [];
      const formattedLogs = logs.map((x) => ({
        ID: x.id,
        Time: dateFormatter(x.createdAt, "dd MMM yyyy hh:mm:ss a"),
        Event: logEventText[x.event],
        "User ID": x.userId,
        "User Name": x.user?.username ?? "N/A",
        Description: x.description,
        "IP Address": x?.ip_address ?? "",
      }));

      // convert list to worksheet
      const worksheet = XLSX.utils.json_to_sheet(formattedLogs);

      // create new workbook & append to worksheet
      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");

      // write the workbook & trigger download
      XLSX.writeFile(workbook, `logs-download-${fromDate}-${toDate}.xlsx`);

      // console.log(formattedLogs);

      toast.success("Downloaded Successfully");
      // toast.success(`downlaoded ${logs.length} logs from ${fromDate} to ${toDate}`,);
    } catch (error: any) {
      toast.error(error?.message ?? "Failed to download");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <DataTableToolbar
        query={query}
        sort={sort}
        onQueryChange={handleQueryChange}
        onSortChange={onSortChange}
        from={from}
        onFromChange={handleFromChange}
        onDownload={handleDownlaod}
        isDownloading={isDownloading}
      >
        {/* events */}
        <div className="">
          <Label className="mb-2">Event</Label>
          <Select value={event} onValueChange={(val) => setEvent(val)}>
            <SelectTrigger className="w-34">
              <SelectValue placeholder="Select Event" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"ALL"}>All</SelectItem>

              {logEventList?.map((ev) => (
                <SelectItem key={ev.value} value={ev.value.toString()}>
                  {ev.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>{" "}
        </div>

        {/* select user */}
        <div className="">
          <Label className="mb-2">User</Label>
          <Select value={userId} onValueChange={(val) => setUserId(val)}>
            <SelectTrigger className="w-34">
              <SelectValue placeholder="Select User" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"ALL"}>All</SelectItem>

              {users?.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.username}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </DataTableToolbar>

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
