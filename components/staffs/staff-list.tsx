"use client";

import {
  CreateOrUpdateStaffButton,
  StaffItemActions,
} from "@/components/staffs/staff-item-actions";
import { Badge } from "@/components/ui/badge";
import {
  roleList,
  roleText,
  roleVariants,
  userStatusList,
  userStatusText,
  userStatusVariants,
} from "@/lib/corearrays";
import { PartialUser, StaffsDataPaginated } from "@/lib/types";
import { dateFormatter } from "@/lib/utils";
import { useTableFilters } from "@/hooks/use-table-filters";
import { DataTableToolbar } from "../data-table/data-table-toolbar";
import { DataTablePaginationBar } from "../data-table/data-table-pagination-bar";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../data-table/data-table";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Role } from "@/lib/coreconstants";
import { toast } from "sonner";
import { useExport } from "@/hooks/use-export";
import { PageHeaderSection } from "../page-header";

export const StaffList: React.FC<{ me: PartialUser | null }> = ({ me }) => {
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

  const [role, setRole] = useState<string>("ALL");
  const [status, setStatus] = useState<string>("ALL");

  const { isLoading, error, data, refetch } = useQuery<
    StaffsDataPaginated,
    Error
  >({
    queryKey: [
      `/api/staff?${new URLSearchParams({
        from,
        query: debouncedQuery || "",
        sort,
        limit: limit.toString(),
        offset: offset.toString(),
        role: role !== "ALL" ? role : "",
        status: status !== "ALL" ? status : "",
      })}`,
    ],
  });

  const list: PartialUser[] = data?.data ?? [];
  const totalCount = data?.total ?? 0;

  const columns: ColumnDef<PartialUser>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <div className="relative pl-1">
          {row.original.id == me?.id && (
            <div className="bg-success w-1 h-8 rounded absolute -left-1 top-1/2 -translate-y-1/2" />
          )}

          {row.original.id}
        </div>
      ),
    },
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.username}</span>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <Badge variant={roleVariants[row.original.role]}>
          {roleText[row.original.role]}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const value = row.original.status;

        if (value == null || value == undefined) return "N/A";

        return (
          <Badge variant={userStatusVariants[value]}>
            {userStatusText[value]}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => dateFormatter(row.original.createdAt, "dd MMM yyyy"),
    },
    {
      accessorKey: "",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original;

        const canEdit = me?.id == user.id || me?.role == Role.ADMIN;
        const canDelete = me?.role == Role.ADMIN && user.role == Role.STAFF;

        return (
          <StaffItemActions
            user={user}
            canEdit={canEdit}
            canDelete={canDelete}
            refetch={() => {
              setOffset(0);
              refetch();
            }}
          />
        );
      },
    },
  ];

  const { handleExport, isDownloading, setIsDownloading } = useExport();

  const handleDownlaod = async () => {
    try {
      setIsDownloading(true);

      const q = new URLSearchParams();
      q.append("isDownload", "1");

      const res = await fetch(`/api/staff?${q.toString()}`);

      if (!res.ok) {
        toast.error("Failed to download");
        return;
      }

      const data = await res.json();
      const logs: PartialUser[] = data?.data ?? [];
      const formattedLogs = logs.map((x) => ({
        ID: x.id,
        Username: x.username,
        Role: roleText[x.role],
        Status: userStatusText[x.status],
        Time: dateFormatter(x.createdAt, "dd MMM yyyy hh:mm:ss a"),
        "Full Name": x?.fullname,
        Designation: x?.designation,
        "Phone Number": x?.phone,
        Email: x?.email,
      }));

      await handleExport(
        formattedLogs,
        [
          "ID",
          "Username",
          "Role",
          "Status",
          "Time",
          "Full Name",
          "Designation",
          "Phone Number",
          "Email",
        ],
        "staffs",
      );

      toast.success("Downloaded Successfully");
    } catch (error: any) {
      toast.error(error?.message ?? "Failed to download");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <PageHeaderSection title={"Staffs"} subtitle={`Total: ${totalCount}`}>
        <CreateOrUpdateStaffButton
          canEdit={me?.role == Role.ADMIN}
          onSuccess={refetch}
        />
      </PageHeaderSection>

      <div className="max-w-7xl mx-auto">
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
          {/* role */}
          <div className="">
            <Label className="mb-2">Role</Label>
            <Select value={role} onValueChange={(val) => setRole(val)}>
              <SelectTrigger className="w-34">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={"ALL"}>All</SelectItem>

                {roleList?.map((ev) => (
                  <SelectItem key={ev.value} value={ev.value.toString()}>
                    {ev.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* status */}
          <div className="">
            <Label className="mb-2">Status</Label>
            <Select value={status} onValueChange={(val) => setStatus(val)}>
              <SelectTrigger className="w-34">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={"ALL"}>All</SelectItem>

                {userStatusList?.map((ev) => (
                  <SelectItem key={ev.value} value={ev.value.toString()}>
                    {ev.label}
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
      </div>
    </>
  );
};
