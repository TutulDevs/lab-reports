"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { periodOptions } from "@/lib/corearrays";

export const DataTableToolbar: React.FC<{
  query: string;
  sort: "asc" | "dsc";
  onQueryChange: (value: string) => void;
  onSortToggle: () => void;
  from: string;
  onFromChange: (value: string) => void;
  children?: React.ReactNode;
}> = ({
  query,
  sort,
  onQueryChange,
  onSortToggle,
  from,
  onFromChange,
  children,
}) => {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3 w-full py-4">
      {/* Search */}
      <div className="relative w-full max-w-sm">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={16}
        />
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search..."
          className="pl-10"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Sort toggle */}
        <Button
          variant="outline"
          onClick={onSortToggle}
          className="flex items-center gap-2"
        >
          <ArrowUpDown size={16} />
          {sort.toUpperCase()}
        </Button>

        {/* from date */}
        <Select value={from} onValueChange={(val) => onFromChange(val)}>
          <SelectTrigger className="w-34">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            {periodOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {children}
      </div>
    </div>
  );
};
