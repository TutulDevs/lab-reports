import { cn } from "@/lib/utils";
import React from "react";

export const Loader: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        "flex justify-center flex-row gap-2 px-2 py-4 my-4",
        className,
      )}
    >
      <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
      <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.3s]"></div>
      <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
    </div>
  );
};
