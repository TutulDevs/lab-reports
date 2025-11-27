"use client";

import { Input } from "@/components/ui/input";
import { Download, Loader, Search } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { IconFileExcel } from "@tabler/icons-react";

export const DataTableToolbar: React.FC<{
  query: string;
  sort: SortType;
  onQueryChange: (value: string) => void;
  onSortChange: (value: SortType) => void;
  from: string;
  onFromChange: (value: string) => void;
  onDownload?: (from: string, to?: string) => void;
  isDownloading?: boolean;
  children?: React.ReactNode;
}> = ({
  query,
  sort,
  onQueryChange,
  onSortChange,
  from,
  onFromChange,
  onDownload,
  isDownloading,
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

      <div className="flex flex-wrap items-end gap-3">
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

        {/* children */}
        {children}

        {/* download */}
        {onDownload && (
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                buttonVariants({ variant: "outline", size: "icon" }),
              )}
              aria-label="download data"
              disabled={isDownloading}
            >
              {isDownloading ? (
                <Loader className="animate-spin" />
              ) : (
                <IconFileExcel />
              )}
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {periodOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => onDownload(option.value)}
                >
                  {option.title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};
