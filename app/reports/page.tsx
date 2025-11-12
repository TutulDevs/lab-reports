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

export default async function ReportsPage() {
  const reports = await getServerReportsAll();

  return (
    <>
      <div className="p-6 md:p-10">
        <PageHeaderSection
          title={"List of reports"}
          subtitle={`Total: ${reports?.length ?? 0}`}
        >
          <Link href={"/reports/create"} className={cn(buttonVariants())}>
            Create Report
          </Link>
        </PageHeaderSection>

        {/* table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {reports?.map((report) => {
              return (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.id}</TableCell>
                  <TableCell>
                    {dateFormatter(report.createdAt, "dd MMM yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/reports/${report.id}`}
                      className={cn(buttonVariants({}))}
                    >
                      details
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
