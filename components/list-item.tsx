import { cn } from "@/lib/utils";
import React from "react";

export const ListItem: React.FC<{
  title?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}> = ({ title, children, className }) => {
  return (
    <p className={cn(className)}>
      <strong>{title}:</strong> <span>{children}</span>
    </p>
  );
};
