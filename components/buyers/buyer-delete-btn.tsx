"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { buttonVariants } from "../ui/button";

export const BuyerDeleteBtn: React.FC<{ buyerId: string }> = ({ buyerId }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const deleteBuyer = async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/buyer/${buyerId}`, {
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
      <button
        type="button"
        className={cn(buttonVariants({ variant: "destructive" }))}
        onClick={deleteBuyer}
        disabled={loading}
      >
        {loading ? "Deleting..." : "Delete"}
      </button>
    </>
  );
};
