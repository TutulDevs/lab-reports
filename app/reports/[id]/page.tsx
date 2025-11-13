import { PageHeaderSection } from "@/components/page-header";
import { cn, dateFormatter } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getServerReportsDetails } from "@/lib/fetcher";
import { notFound } from "next/navigation";
import { Buyer } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ListItem } from "@/components/list-item";
import { Badge } from "@/components/ui/badge";
import {
  reportOverallResultText,
  reportOverallResultVariants,
  reportSampleStageText,
  reportSampleTypeText,
  reportStatusText,
  reportStatusVariants,
} from "@/lib/corearrays";

export default async function ReportDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: reportId } = await params;
  const reportData = await getServerReportsDetails(reportId);

  if (!reportData) {
    notFound();
  }

  const { buyer, ...report } = reportData;
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
  const {
    id: idBuyer,
    title,
    userId: userIdBuyer,
    createdAt: createdAtBuyer,
    updatedAt: updatedAtBuyer,
    ...restBuyer
  } = buyer as Buyer;

  const itemClass = "border-b flex justify-between flex-wrap py-1";

  return (
    <>
      <div className="p-6 md:p-10">
        <PageHeaderSection title={report.report_id}>
          <div className="space-x-2">
            <Link
              href={"/reports/edit/" + report.id}
              className={cn(buttonVariants())}
            >
              Edit
            </Link>

            {/* <BuyerDeleteBtn buyerId={report.id} /> */}
          </div>
        </PageHeaderSection>

        {/* report & buyer info */}
        <div className="">
          <ListItem className={itemClass} title={"Buyer Title"}>
            {title}
          </ListItem>
          <ListItem className={itemClass} title={"Sample Receive Date"}>
            {dateFormatter(sample_receive_date ?? new Date())}
          </ListItem>
          <ListItem className={itemClass} title={"Created At"}>
            {dateFormatter(createdAt ?? new Date())}
          </ListItem>
          <ListItem className={itemClass} title={"Updated At"}>
            {dateFormatter(updatedAt ?? new Date())}
          </ListItem>
          <ListItem className={itemClass} title={"ID"}>
            {id}
          </ListItem>
          <ListItem className={itemClass} title={"Report ID"}>
            {report_id}
          </ListItem>
          <ListItem className={itemClass} title={"Status"}>
            {!status ? (
              "N/A"
            ) : (
              <Badge variant={reportStatusVariants[status]}>
                {reportStatusText[status]}
              </Badge>
            )}
          </ListItem>
          <ListItem className={itemClass} title={"Result"}>
            <Badge variant={reportOverallResultVariants[result]}>
              {reportOverallResultText[result]}
            </Badge>
          </ListItem>
          <ListItem className={itemClass} title={"sample_type"}>
            {!sample_type ? "N/A" : reportSampleTypeText[sample_type]}
          </ListItem>
          <ListItem className={itemClass} title={"sample_stage"}>
            {!sample_stage ? "N/A" : reportSampleStageText[sample_stage]}
          </ListItem>
          <ListItem className={itemClass} title={"order_number"}>
            {order_number}
          </ListItem>
          <ListItem className={itemClass} title={"batch_number"}>
            {batch_number}
          </ListItem>
          <ListItem className={itemClass} title={"roll_number"}>
            {roll_number}
          </ListItem>
          <ListItem className={itemClass} title={"color"}>
            {color}
          </ListItem>
          <ListItem className={itemClass} title={"fabric_type"}>
            {fabric_type}
          </ListItem>
          <ListItem className={itemClass} title={"remarks"}>
            {remarks}
          </ListItem>
          <ListItem className={itemClass} title={"Last Modified By"}>
            {lastUpdatedBy.username}
          </ListItem>
        </div>

        <hr className="my-8" />

        {/* compare */}
        <Table>
          <TableCaption>Report Comparison</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Field</TableHead>
              <TableHead className="text-end">Report Value</TableHead>
              <TableHead className="text-end">Buyer Requirement</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {Object.keys(restReport)?.map((x) => {
              return (
                <TableRow
                  key={x}
                  className={cn({
                    ["text-red-500"]: fail_portions?.includes(x),
                  })}
                >
                  <TableCell className="py-1">{x}</TableCell>
                  <TableCell className="py-1 text-end">
                    {/* @ts-expect-errors typecasting */}
                    {String(restReport[x] ?? "")}
                  </TableCell>
                  <TableCell className="py-1 text-end">
                    {/* @ts-expect-errors typecasting */}
                    {String(restBuyer[x] ?? "")}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* <div className="grid grid-cols-2">
          <pre className="text-wrap">{JSON.stringify(report, null, 2)}</pre>
          <pre className="text-wrap"> {JSON.stringify(buyer, null, 2)}</pre>
        </div> */}
      </div>
    </>
  );
}
