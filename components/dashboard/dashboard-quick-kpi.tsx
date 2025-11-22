"use client";

import React from "react";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  FileText,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { getDaysPassed, getSubDate } from "@/lib/utils";
import { Button } from "../ui/button";
import { useDashboardKpi } from "@/hooks/dashboards";
import { Loader } from "../loader";

const periodOptions = [
  { value: "ALL", title: "All Time" },
  { value: getSubDate(7), title: "Last 7 days" },
  { value: getSubDate(getDaysPassed("month")), title: "This Month" },
  { value: getSubDate(getDaysPassed("year")), title: "This Year" },
];

export const DashboardQuickKpi = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(periodOptions[0].value);

  const { data, isLoading, error, refetch } = useDashboardKpi(
    selectedPeriod == "ALL" ? undefined : selectedPeriod,
  );

  const kpiData = [
    {
      title: "Total Buyers",
      value: data?.buyersCount ?? "-",
      change: "+12% from last month",
      icon: Users,
    },
    {
      title: "Total Reports",
      value: data?.reportsCount ?? "-",
      change: "+180 from last month",
      icon: FileText,
    },
    {
      title: "Pass Rate",
      value: data?.passCount ?? "-",
      change: "+1.2% from last month",
      icon: CheckCircle2,
      iconColor: "text-success",
    },
    {
      title: "Fail Rate",
      value: data?.failCount ?? "-",
      change: "-1.2% from last month",
      icon: XCircle,
      iconColor: "text-destructive",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <h2 className="text-lg font-semibold md:text-xl">KPI Overview</h2>

        <div className="flex">
          <Button
            variant="outline"
            size="icon"
            className="mr-2"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          <Select
            value={selectedPeriod}
            onValueChange={(val) => setSelectedPeriod(val)}
          >
            <SelectTrigger className="w-[180px]">
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

      {isLoading ? (
        <Loader />
      ) : (
        <div className="@container/main">
          <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            {kpiData.map((kpi) => (
              <Card key={kpi.title} className="@container/card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl">
                    {kpi.title}
                  </CardTitle>

                  <kpi.icon
                    className={`h-4 w-4 ${kpi.iconColor || "text-muted-foreground"}`}
                  />
                </CardHeader>

                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                  <div className="line-clamp-1 flex gap-2 text-2xl font-bold">
                    {kpi.value}
                  </div>
                  {/* <div className="text-muted-foreground">{kpi.change}</div> */}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
