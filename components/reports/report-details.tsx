import { cn, dateFormatter } from "@/lib/utils";
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
import { ListItem, ListItemProps } from "@/components/list-item";
import { Badge } from "@/components/ui/badge";
import {
  reportBuyerCommonFieldsText,
  reportOverallResultText,
  reportOverallResultVariants,
  reportSampleStageText,
  reportSampleTypeText,
  reportStatusText,
  reportStatusVariants,
} from "@/lib/corearrays";

export const ReportDetails: React.FC<{ reportId: string }> = async ({
  reportId,
}) => {
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

  const itemClass = "border-b flex justify-between flex-wrap py-1";

  const listItemsData: ListItemProps[] = [
    {
      title: "Buyer Title",
      children: (buyer as Buyer)?.title,
      className: cn(itemClass),
    },
    {
      title: "Sample Receive Date",
      children: dateFormatter(sample_receive_date ?? new Date()),
      className: cn(itemClass),
    },
    {
      title: "Created At",
      children: dateFormatter(createdAt ?? new Date()),
      className: cn(itemClass),
    },
    {
      title: "Updated At",
      children: dateFormatter(updatedAt ?? new Date()),
      className: cn(itemClass),
    },
    {
      title: "ID",
      children: id,
      className: cn(itemClass),
    },
    {
      title: "Report ID",
      children: report_id,
      className: cn(itemClass),
    },
    {
      title: "Status",
      children: !status ? (
        "N/A"
      ) : (
        <Badge variant={reportStatusVariants[status]}>
          {reportStatusText[status]}
        </Badge>
      ),
      className: cn(itemClass),
    },
    {
      title: "Result",
      children: (
        <Badge variant={reportOverallResultVariants[result]}>
          {reportOverallResultText[result]}
        </Badge>
      ),
      className: cn(itemClass),
    },
    {
      title: "Sample Type",
      children: !sample_type ? "N/A" : reportSampleTypeText[sample_type],
      className: cn(itemClass),
    },
    {
      title: "Sample Stage",
      children: !sample_stage ? "N/A" : reportSampleStageText[sample_stage],
      className: cn(itemClass),
    },
    {
      title: "Order Number",
      children: order_number,
      className: cn(itemClass),
    },
    {
      title: "Batch Number",
      children: batch_number,
      className: cn(itemClass),
    },
    {
      title: "Roll Number",
      children: roll_number,
      className: cn(itemClass),
    },
    {
      title: "Color",
      children: color,
      className: cn(itemClass),
    },
    {
      title: "Fabric Type",
      children: fabric_type,
      className: cn(itemClass),
    },
    {
      title: "Last Modified By",
      children: lastUpdatedBy.username,
      className: cn(itemClass),
    },
    {
      title: "Remarks",
      children: remarks,
      className: cn(itemClass, "flex-col whitespace-pre-line border-b-0"),
    },
  ];

  return (
    <>
      {/* report & buyer info */}
      <div className="">
        {listItemsData.map((item, index) => (
          <ListItem
            key={item.title?.toString() || index}
            hideColon={true}
            {...item}
          />
        ))}
      </div>

      {/* <hr className="my-8" /> */}

      {/* compare */}
      <div className="text-center text-2xl font-semibold mt-8 mb-2">
        Report Comparison
      </div>

      <Table>
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
                  ["text-destructive"]: fail_portions?.includes(x),
                })}
              >
                <TableCell className="py-1">
                  {reportBuyerCommonFieldsText[x]}
                </TableCell>
                <TableCell className="py-1 text-end">
                  {/* @ts-expect-errors typecasting */}
                  {String(restReport[x] ?? "")}
                </TableCell>
                <TableCell className="py-1 text-end">
                  {/* @ts-expect-errors typecasting */}
                  {String(buyer[x] ?? "")}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};
