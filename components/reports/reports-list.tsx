import { PageHeaderSection } from "@/components/page-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, dateFormatter } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getServerReportsAll } from "@/lib/fetcher";
import {
  reportOverallResultText,
  reportOverallResultVariants,
  reportStatusText,
  reportStatusVariants,
} from "@/lib/corearrays";
import { Badge } from "@/components/ui/badge";
import { Buyer } from "@prisma/client";

export const ReportsList = async () => {
  const reports = await getServerReportsAll();

  return (
    <>
      <PageHeaderSection
        title={"List of reports"}
        subtitle={`Total: ${reports?.length ?? 0}`}
      >
        <Link href={"/reports/create"} className={cn(buttonVariants())}>
          Create Report
        </Link>
      </PageHeaderSection>

      {/* table */}
      <Table className="max-w-7xl mx-auto">
        <TableHeader>
          <TableRow>
            {/* <TableHead>ID</TableHead> */}
            <TableHead>Report ID</TableHead>
            <TableHead>Buyer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Result</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {reports?.map((report) => {
            return (
              <TableRow key={report.id}>
                {/* <TableCell className="font-medium">{report.id}</TableCell> */}
                <TableCell className="font-medium">
                  {report.report_id}
                </TableCell>
                <TableCell className="font-medium">
                  {(report.buyer as Buyer)?.title}
                </TableCell>
                <TableCell className="font-medium">
                  {!report.status ? (
                    "N/A"
                  ) : (
                    <Badge variant={reportStatusVariants[report.status]}>
                      {reportStatusText[report.status]}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="font-medium">
                  <Badge variant={reportOverallResultVariants[report.result]}>
                    {reportOverallResultText[report.result]}
                  </Badge>
                </TableCell>
                <TableCell>
                  {dateFormatter(report.createdAt, "dd MMM yyyy")}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Link
                    href={`/reports/${report.id}`}
                    className={cn(
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
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};
