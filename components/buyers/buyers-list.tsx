"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn, dateFormatter } from "@/lib/utils";
import Link from "next/link";
import { PageHeaderSection } from "@/components/page-header";
import { useTableFilters } from "@/hooks/use-table-filters";
import { useQuery } from "@tanstack/react-query";
import { BuyersDataPaginated, BuyerWithUser } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { useExport } from "@/hooks/use-export";
import { toast } from "sonner";
import { DataTable } from "../data-table/data-table";
import { DataTableToolbar } from "../data-table/data-table-toolbar";
import { DataTablePaginationBar } from "../data-table/data-table-pagination-bar";
import { reportBuyerCommonFieldsText } from "@/lib/corearrays";

export const BuyersList = () => {
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

  const { isLoading, error, data, refetch } = useQuery<
    BuyersDataPaginated,
    Error
  >({
    queryKey: [
      `/api/buyer?${new URLSearchParams({
        from,
        query: debouncedQuery || "",
        sort,
        limit: limit.toString(),
        offset: offset.toString(),
      })}`,
    ],
  });

  const list: BuyerWithUser[] = data?.data ?? [];
  const totalCount = data?.total ?? 0;

  const columns: ColumnDef<BuyerWithUser>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.title}</span>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: "Last Modified",
      cell: ({ row }) => dateFormatter(row.original.updatedAt, "dd MMM yyyy"),
    },
    {
      accessorKey: "lastUpdatedBy.username",
      header: "Modified by",
    },
    {
      accessorKey: "userId",
      header: "Actions",
      cell: ({ row }) => {
        const buyer = row.original;

        return (
          <>
            <Link
              href={"/buyers/" + buyer.id}
              className={cn(
                "mr-2",
                buttonVariants({ variant: "outline", size: "sm" }),
              )}
            >
              Details
            </Link>

            <Link
              href={"/buyers/edit/" + buyer.id}
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

      const res = await fetch(`/api/buyer?${q.toString()}`);

      if (!res.ok) {
        toast.error("Failed to download");
        return;
      }

      const data = await res.json();
      const buyers: BuyerWithUser[] = data?.data ?? [];
      const formattedBuyers = buyers.map((x) => {
        const {
          createdAt,
          updatedAt,
          lastUpdatedBy,
          burstingRules,
          id,
          title,
          userId,
          ...rest
        } = x;

        const remappedRest = Object.entries(rest).reduce(
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
          Title: title,
          "Created At": dateFormatter(createdAt, "dd MMM yyyy hh:mm:ss a"),
          "Updated At": dateFormatter(updatedAt, "dd MMM yyyy hh:mm:ss a"),
          "Modified by": `${lastUpdatedBy.username} (${userId})`,
          ...remappedRest,
        };
      });

      await handleExport(
        formattedBuyers,
        [
          "ID",
          "Title",
          "Created At",
          "Updated At",
          "Modified By",
          // ...Object.keys(remappedRest),
        ],
        "buyers",
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
        title={"List of Buyers"}
        subtitle={`Total: ${totalCount}`}
      >
        <Link href={"/buyers/create"} className={cn(buttonVariants())}>
          Create Buyer
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
        />

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
