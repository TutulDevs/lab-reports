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
import { Buyer } from "@prisma/client";

export const BuyerDeleteAction: React.FC<{ buyer: Buyer }> = ({ buyer }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const deleteBuyer = async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/buyer/${buyer.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const status = res.status;
      const data = await res.json();

      // console.log("res:", status, res);
      // console.log("data:", data);

      if (data?.success) {
        toast.success(data?.message || `Buyer deleted successfully"}`);
        router.push("/buyers");
        router.refresh();
      } else {
        toast.error(data?.error || `Failed to delete buyer`);
        if (status == 401) window.location.href = "/login";
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to delete buyer");
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
              buyer <strong>{buyer.title}</strong> and remove your data from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={cn(buttonVariants({ variant: "destructive" }))}
              onClick={deleteBuyer}
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
