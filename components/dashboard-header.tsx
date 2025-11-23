"use client";

import React from "react";
import { Button } from "./ui/button";
import { Camera, RefreshCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { periodOptions } from "@/lib/corearrays";

export const DashboardHeader: React.FC<{
  title: React.ReactNode;
  isLoading: boolean;
  refetch: () => void;
  selectedPeriod: string;
  setSelectedPeriod: (val: string) => void;
  onCapture?: () => void;
}> = ({
  title,
  isLoading,
  refetch,
  selectedPeriod,
  setSelectedPeriod,
  onCapture,
}) => {
  return (
    <>
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <h2 className="text-lg font-semibold md:text-xl flex items-center gap-2 flex-wrap">
          {title}
        </h2>

        <div className="flex">
          <Button
            variant="outline"
            size="icon"
            className="mr-2"
            onClick={() => refetch()}
            disabled={isLoading}
            aria-label="refetch"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          {onCapture && (
            <Button
              variant="outline"
              size="icon"
              className="mr-2"
              onClick={onCapture}
              disabled={isLoading}
              aria-label="capture dom"
            >
              <Camera className="h-4 w-4" />
            </Button>
          )}

          <Select
            value={selectedPeriod}
            onValueChange={(val) => setSelectedPeriod(val)}
          >
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
      </div>
    </>
  );
};
