"use client";

import { PageHeaderSection } from "@/components/page-header";
import { cn, dateFormatter } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  reportBuyerCommonFieldsText,
  reportDryProcessText,
  reportOverallResultText,
  reportOverallResultVariants,
  reportSampleStageText,
  reportSampleTypeText,
  reportStatusText,
  reportStatusVariants,
} from "@/lib/corearrays";
import { Badge } from "@/components/ui/badge";
import { Buyer } from "@prisma/client";
import { useTableFilters } from "@/hooks/use-table-filters";
import { useQuery } from "@tanstack/react-query";
import {
  ReportForList,
  ReportsDataPaginated,
  ReportWithUser,
} from "@/lib/types";
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
import { DataTableToolbar } from "../data-table/data-table-toolbar";
import { DataTablePaginationBar } from "../data-table/data-table-pagination-bar";
import { useExport } from "@/hooks/use-export";
import { toast } from "sonner";

export const ReportsList = () => {
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

  // filters: status, sample type, sample stage, buyer, user,result,

  const { isLoading, error, data, refetch } = useQuery<
    ReportsDataPaginated,
    Error
  >({
    queryKey: [
      `/api/report?${new URLSearchParams({
        from,
        query: debouncedQuery || "",
        sort,
        limit: limit.toString(),
        offset: offset.toString(),
      })}`,
    ],
  });

  const list: ReportForList[] = data?.data ?? [];
  const totalCount = data?.total ?? 0;

  const columns: ColumnDef<ReportForList>[] = [
    {
      accessorKey: "report_id",
      header: "ID",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.report_id}</span>
      ),
    },
    {
      accessorKey: "buyerId",
      header: "Buyer",
      cell: ({ row }) => (
        <span className="font-medium">
          {(row.original.buyer as Buyer)?.title}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;

        return !status ? (
          "N/A"
        ) : (
          <Badge variant={reportStatusVariants[status]}>
            {reportStatusText[status]}
          </Badge>
        );
      },
    },
    {
      accessorKey: "result",
      header: "Result",
      cell: ({ row }) => {
        const result = row.original.result;

        return !result ? (
          "N/A"
        ) : (
          <Badge variant={reportOverallResultVariants[result]}>
            {reportOverallResultText[result]}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => dateFormatter(row.original.createdAt, "dd MMM yyyy"),
    },
    {
      accessorKey: "userId",
      header: "Actions",
      cell: ({ row }) => {
        const report = row.original;

        return (
          <>
            {" "}
            <Link
              href={`/reports/${report.id}`}
              className={cn(
                "mr-2",
                buttonVariants({ size: "sm", variant: "outline" }),
              )}
            >
              Details
            </Link>
            <Link
              href={"/reports/edit/" + report.id}
              className={cn(buttonVariants({ size: "sm" }))}
            >
              Edit
            </Link>
          </>
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

      const res = await fetch(`/api/report?${q.toString()}`);

      if (!res.ok) {
        toast.error("Failed to download");
        return;
      }

      const data = await res.json();
      const reports: ReportWithUser[] = data?.data ?? [];
      const formattedReports = reports.map((x) => {
        const { buyer, ...report } = x;
        const {
          id,
          createdAt,
          updatedAt,
          buyerId,
          sample_receive_date,
          report_id,
          status,
          sample_type,
          sample_stage,
          dry_process,
          order_number,
          batch_number,
          color,
          fabric_type,
          roll_number,
          result,
          fail_portions,
          remarks,
          lastUpdatedBy,
          userId,
          ...restReport
        } = report;

        const fails = (fail_portions ?? "")
          .split(",")
          .map((f) => reportBuyerCommonFieldsText[f] ?? f)
          .join(", ");

        const remappedRest = Object.entries(restReport).reduce(
          (acc, [key, value]) => {
            const label = reportBuyerCommonFieldsText[key] || key; // fallback to original key
            acc[label] = value;
            return acc;
          },
          {} as Record<string, any>,
        );

        // console.log('remappedRest', remappedRest)

        return {
          ID: id,
          "Sample Received At": dateFormatter(
            sample_receive_date,
            "dd MMM yyyy hh:mm:ss a",
          ),
          "Created At": dateFormatter(createdAt, "dd MMM yyyy hh:mm:ss a"),
          "Updated At": dateFormatter(updatedAt, "dd MMM yyyy hh:mm:ss a"),
          Buyer: `${(buyer as Buyer)?.title ?? ""} (${buyerId})`,
          "Last Modified By": `${lastUpdatedBy?.username ?? ""} (${userId})`,
          "Report No": report_id,
          "Present Status": !status ? "" : reportStatusText[status],
          "Sample Type": !sample_type ? "" : reportSampleTypeText[sample_type],
          "Sample Stage": !sample_stage
            ? ""
            : reportSampleStageText[sample_stage],
          "Dry Process": !dry_process ? "" : reportDryProcessText[dry_process],
          "Roll Number": roll_number,
          "Order Number": order_number,
          "Batch Number": batch_number,
          Color: color,
          "Fabric Type": fabric_type,
          "Overall Result": !result ? "" : reportOverallResultText[result],
          "Fail Portions": fails,
          Remarks: remarks,
          ...remappedRest,
        };
      });

      await handleExport(
        formattedReports,
        [
          "ID",
          "Sample Received At",
          "Created At",
          "Updated At",
          "Buyer",
          "Last Modified By",
          "Report No",
          "Present Status",
          "Sample Type",
          "Sample Stage",
          "Order Number",
          "Batch Number",
          "Color",
          "Fabric Type",
          "Roll Number",
          "Dry Process",
          "Overall Result",
          "Fail Portions",
          "Remarks",
          // ...Object.keys(remappedRest),
        ],
        "reports",
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
      <PageHeaderSection
        title={"List of reports"}
        subtitle={`Total: ${totalCount}`}
      >
        <Link href={"/reports/create"} className={cn(buttonVariants())}>
          Create Report
        </Link>
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
        ></DataTableToolbar>

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
