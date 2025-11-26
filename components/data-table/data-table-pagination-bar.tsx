"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { DEFAULT_TABLE_LIMITS } from "@/lib/corearrays";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export const DataTablePaginationBar: React.FC<{
  total: number;
  limit: number;
  offset: number;
  onLimitChange: (value: number) => void;
  onOffsetChange: (value: number) => void;
}> = ({ total, limit, offset, onLimitChange, onOffsetChange }) => {
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const goToFirst = () => onOffsetChange(0);
  const goToPrev = () => onOffsetChange(Math.max(0, offset - limit));
  const goToNext = () =>
    onOffsetChange(Math.min((totalPages - 1) * limit, offset + limit));
  const goToLast = () => onOffsetChange((totalPages - 1) * limit);

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 md:gap-6 py-4 text-sm">
      {/* Rows per page */}
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground hidden md:block">
          Rows per page
        </span>

        <Select
          value={String(limit)}
          onValueChange={(v) => {
            onLimitChange(Number(v));
            onOffsetChange(0);
          }}
        >
          <SelectTrigger className="h-8 w-18">
            <SelectValue />
          </SelectTrigger>
          <SelectContent side="top">
            {DEFAULT_TABLE_LIMITS.map((num) => (
              <SelectItem key={num} value={String(num)}>
                {num}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Page info */}
      <div className="text-muted-foreground text-center">
        Page {currentPage} of {totalPages}
      </div>

      {/* Pagination buttons */}
      <div className="flex items-center justify-end gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={goToFirst}
          disabled={currentPage === 1}
        >
          <ChevronsLeft size={16} />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={goToPrev}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={16} />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={goToNext}
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={16} />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={goToLast}
          disabled={currentPage === totalPages}
        >
          <ChevronsRight size={16} />
        </Button>
      </div>
    </div>
  );
};
