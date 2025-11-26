"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { periodOptions } from "@/lib/corearrays";
import { SortType } from "@/lib/types";
import { Label } from "../ui/label";

export const DataTableToolbar: React.FC<{
  query: string;
  sort: SortType;
  onQueryChange: (value: string) => void;
  onSortChange: (value: SortType) => void;
  from: string;
  onFromChange: (value: string) => void;
  children?: React.ReactNode;
}> = ({
  query,
  sort,
  onQueryChange,
  onSortChange,
  from,
  onFromChange,
  children,
}) => {
  return (
    <div className="flex items-center justify-between flex-wrap gap-4 w-full py-4">
      {/* Search */}
      <div className="w-full max-w-xs">
        <Label className="mb-2">Search</Label>
        <div className="relative">
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
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Sort toggle */}
        <div className="">
          <Label className="mb-2">Sort</Label>
          <Select
            value={sort}
            onValueChange={(v) => onSortChange(v as SortType)}
          >
            <SelectTrigger className="w-[150px] h-8">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>

            <SelectContent side="bottom">
              <SelectItem value="desc">Newest first</SelectItem>
              <SelectItem value="asc">Oldest first</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* from date */}
        <div className="">
          <Label className="mb-2">Time</Label>
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
        </div>

        {children}
      </div>
    </div>
  );
};
