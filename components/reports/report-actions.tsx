"use client";

import React, { useState } from "react";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ReportProps = {
  id: string;
  report_id: string;
};

export const ReportDeleteAction: React.FC<{ report: ReportProps }> = ({
  report,
}) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const deleteReport = async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/report/${report.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const status = res.status;
      const data = await res.json();

      // console.log("res:", status, res);
      // console.log("data:", data);

      if (data?.success) {
        toast.success(data?.message || `Report deleted successfully"}`);
        router.push("/reports");
        router.refresh();
      } else {
        toast.error(data?.error || `Failed to delete report`);
        if (status == 401) window.location.href = "/login";
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to delete report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger
          className={cn(buttonVariants({ variant: "destructive" }))}
        >
          Delete
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              report <strong>{report.report_id}</strong> and remove your data
              from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={cn(buttonVariants({ variant: "destructive" }))}
              onClick={deleteReport}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
