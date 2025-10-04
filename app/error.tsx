"use client"; // Error boundaries must be Client Components

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[90vh] flex flex-col gap-4 items-center justify-center text-center">
      <h2 className="text-lg md:text-5xl">Something went wrong!</h2>
      <button
        className={cn(buttonVariants())}
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}
