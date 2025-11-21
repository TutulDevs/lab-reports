import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Buyer, Report } from "@prisma/client";
import { Button } from "../ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { ReportFormType } from "./create-edit-report-from";
import { useRouter } from "next/navigation";
import { cn, dateFormatter } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ListItem, ListItemProps } from "../list-item";
import { BuyerWithUser, ReportOverallResult } from "@/lib/coreconstants";
import Link from "next/link";
import { Badge } from "../ui/badge";
import {
  getBuyerValue,
  reportBuyerCommonFieldsText,
  reportOverallResultText,
  reportOverallResultVariants,
  reportSampleStageText,
  reportSampleTypeText,
  reportStatusText,
  reportStatusVariants,
} from "@/lib/corearrays";

export const FormPreviewContent: React.FC<{
  report?: Report;
  formData: ReportFormType;
  buyer: BuyerWithUser;
  failPortions: (keyof Report)[];
}> = ({ report, formData, buyer, failPortions }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [loadingPending, setLoadingPending] = useState(false);

  const btnText = {
    default: report ? "Update" : "Create",
    loading: report ? "Updating..." : "Creating...",
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const dataToSend: ReportFormType = {
        ...formData,
        buyer: buyer,
        fail_portions: failPortions.join(","),
        result:
          failPortions.length > 0
            ? ReportOverallResult.FAIL
            : ReportOverallResult.PASS,
      };

      // console.table(data);

      const res = await fetch("/api/report", {
        method: report ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
      const status = res.status;
      const data = await res.json();
      const reportData = data.report;

      // console.log("res:", status, res);
      // console.log("data:", reportData);

      if (data?.success) {
        toast.success(
          data?.message || `Successfully ${buyer ? "updated" : "created"}`,
        );

        router.push(`/reports/${reportData.id}`);
        router.refresh();
      } else {
        toast.error(data?.error || `Failed to ${buyer ? "update" : "create"}`);
        if (status == 401) window.location.href = "/login";
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsPending = async () => {
    try {
      setLoadingPending(true);

      const dataToSend: ReportFormType = {
        ...formData,
        buyer: buyer,
        fail_portions: failPortions.join(","),
        result: ReportOverallResult.PENDING,
      };

      // console.table(dataToSend);

      const res = await fetch("/api/report", {
        method: report ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
      const status = res.status;
      const data = await res.json();
      const reportData = data.report;

      // console.log("res:", status, res);
      // console.log("data:", reportData);

      if (data?.success) {
        toast.success(
          data?.message || `Successfully ${buyer ? "updated" : "created"}`,
        );

        router.push(`/reports/${reportData.id}`);
        router.refresh();
      } else {
        toast.error(data?.error || `Failed to ${buyer ? "update" : "create"}`);
        if (status == 401) window.location.href = "/login";
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to update");
    } finally {
      setLoadingPending(false);
    }
  };

  const {
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
    remarks,
    result,
    fail_portions,
    ...restFormData
  } = formData;

  const listItemsData: ListItemProps[] = [
    {
      title: "Sample Receive Date",
      children: dateFormatter(sample_receive_date ?? new Date()),
    },
    ...(!report
      ? []
      : [
          {
            title: "Created At",
            children: dateFormatter(report.createdAt ?? new Date()),
          },
          {
            title: "Updated At",
            children: dateFormatter(report.updatedAt ?? new Date()),
          },
          {
            title: "ID",
            children: report.id,
          },
          {
            title: "Report ID",
            children: report.report_id,
          },
        ]),
    {
      title: "Status",
      children: !status ? (
        "N/A"
      ) : (
        <Badge variant={reportStatusVariants[status]}>
          {reportStatusText[status]}
        </Badge>
      ),
    },
    {
      title: "Result",
      children: !result ? (
        "N/A"
      ) : (
        <Badge variant={reportOverallResultVariants[result]}>
          {reportOverallResultText[result]}
        </Badge>
      ),
    },
    {
      title: "Sample Type",
      children: !sample_type ? "N/A" : reportSampleTypeText[sample_type],
    },
    {
      title: "Sample Stage",
      children: !sample_stage ? "N/A" : reportSampleStageText[sample_stage],
    },
    {
      title: "Order Number",
      children: order_number,
    },
    {
      title: "Batch Number",
      children: batch_number,
    },
    {
      title: "Roll Number",
      children: roll_number,
    },
    {
      title: "Color",
      children: color,
    },
    {
      title: "Fabric Type",
      children: fabric_type,
    },
    {
      title: "Remarks",
      children: remarks,
      className: cn("flex flex-col whitespace-pre-line"),
    },
  ];

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          Preview
          {report && ` of ${report.report_id}`}
        </DialogTitle>
      </DialogHeader>

      <DialogDescription asChild>
        <div className="mt-4 flex flex-col md:flex-row gap-10">
          <div className="flex-1">
            <div className="font-medium text-xl border-b mb-2 pb-1">
              <span>{buyer.title}</span> (
              <Link
                href={`/buyers/${buyerId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary"
              >
                Details
              </Link>
              )
            </div>

            {listItemsData.map((item, idx) => (
              <ListItem
                key={item.title?.toString() || idx}
                {...item}
                className={cn(item?.className, "mt-1")}
              />
            ))}
          </div>

          <div className="">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Field</TableHead>
                  <TableHead className="text-end">Value</TableHead>
                  <TableHead className="text-end">Requirement</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {Object.keys(restFormData)?.map((x) => {
                  return (
                    <TableRow
                      key={x}
                      className={cn({
                        ["text-destructive"]: failPortions.includes(
                          x as keyof Report,
                        ),
                      })}
                      hidden={x == "id"}
                    >
                      <TableCell className="p-0">
                        {reportBuyerCommonFieldsText[x] ?? x}
                      </TableCell>
                      <TableCell className="p-0 text-end">
                        {String(formData[x as keyof ReportFormType] ?? "")}
                      </TableCell>
                      <TableCell className="p-0 pr-3 text-end">
                        {getBuyerValue(
                          x as keyof Report,
                          buyer,
                          false,
                          restFormData?.gsm,
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogDescription>

      <DialogFooter>
        {(!report || report?.result == ReportOverallResult.PENDING) && (
          <Button
            type="button"
            variant={"outline"}
            disabled={loadingPending || loading}
            onClick={handleSaveAsPending}
          >
            {loadingPending ? "Saving..." : "Save as pending"}
          </Button>
        )}

        <Button
          type="button"
          disabled={loading || loadingPending}
          onClick={handleSubmit}
        >
          {loading ? btnText.loading : btnText.default}
        </Button>
      </DialogFooter>
    </>
  );
};
