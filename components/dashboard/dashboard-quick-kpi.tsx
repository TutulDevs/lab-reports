"use client";

import React from "react";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import { useDashboardKpi } from "@/hooks/dashboards";
import { Loader } from "../loader";
import { DashboardHeader } from "../dashboard-header";
import { periodOptions } from "@/lib/corearrays";

export const DashboardQuickKpi = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(periodOptions[0].value);

  const { data, isLoading, error, refetch } = useDashboardKpi({
    from: selectedPeriod == "ALL" ? undefined : selectedPeriod,
  });

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
      {/* header */}
      <DashboardHeader
        title="KPI Overview"
        isLoading={isLoading}
        refetch={refetch}
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
      />

      {/* items */}
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
