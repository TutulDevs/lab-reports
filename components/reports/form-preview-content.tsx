import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Buyer, Report } from "@prisma/client";
import { Button, buttonVariants } from "../ui/button";
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
import { ListItem } from "../list-item";
import { ReportOverallResult } from "@/lib/coreconstants";
import Link from "next/link";

export const FormPreviewContent: React.FC<{
  report?: Report;
  formData: ReportFormType;
  buyer: Buyer;
  failPortions: (keyof Buyer)[];
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
    ...restFormData
  } = formData;

  return (
    <>
      <DialogHeader>
        <DialogTitle>Preview</DialogTitle>
      </DialogHeader>

      <DialogDescription asChild>
        <div className="mt-4 flex gap-6">
          <div className="flex-1">
            <div className="font-medium text-xl border-b mb-2 pb-1">
              <span>{buyer.title}</span> (
              <Link
                href={`/buyers/${buyerId}`}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "link" }), "p-0")}
              >
                Details
              </Link>
              )
            </div>
            <ListItem title={"Sample Receive Date"}>
              {dateFormatter(sample_receive_date ?? new Date())}
            </ListItem>
            <ListItem title={"Report ID"}>{report_id}</ListItem>

            <ListItem title={"Status"}>{status}</ListItem>
            <ListItem title={"sample_type"}>{sample_type}</ListItem>
            <ListItem title={"sample_stage"}>{sample_stage}</ListItem>
            <ListItem title={"order_number"}>{order_number}</ListItem>
            <ListItem title={"batch_number"}>{batch_number}</ListItem>
            <ListItem title={"color"}>{color}</ListItem>
            <ListItem title={"fabric_type"}>{fabric_type}</ListItem>
            <ListItem title={"roll_number"}>{roll_number}</ListItem>
            <ListItem title={"remarks"}>{remarks}</ListItem>
          </div>

          <div className="">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Field</TableHead>
                  <TableHead>Form Value</TableHead>
                  <TableHead>Buyer Requirement</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {Object.keys(restFormData)?.map((x) => {
                  return (
                    <TableRow
                      key={x}
                      className={cn({
                        ["text-red-500"]: failPortions.includes(
                          x as keyof Buyer,
                        ),
                      })}
                    >
                      <TableCell className="p-0">{x}</TableCell>
                      <TableCell className="p-0 text-end">
                        {String(formData[x as keyof ReportFormType] ?? "")}
                      </TableCell>
                      <TableCell className="p-0 pr-3 text-end">
                        {String(buyer[x as keyof Buyer] ?? "")}
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
        {!report && (
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

{
  /* <div className={cn("grid grid-cols-4 border-b")}>
              <span className="col-span-2">Field</span>
              <span className="">Form Value</span>

              <span className="">Buyer Requirement</span>
            </div>

            {Object.keys(restFormData).map((x) => (
              <div
                key={x}
                className={cn("grid grid-cols-4 border-b", {
                  ["text-red-500"]: failPortions.includes(x as keyof Buyer),
                })}
              >
                <span className="col-span-2">{x}</span>
                <span className="">
                  {String(formData[x as keyof ReportFormType] ?? "")}
                </span>

                <span className="">
                  {String(buyer[x as keyof Buyer] ?? "")}
                </span>
              </div>
            ))} */
}
