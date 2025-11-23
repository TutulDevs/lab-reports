"use client";

import * as React from "react";
import { LineChart, Line, CartesianGrid, XAxis } from "recharts";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { periodOptions } from "@/lib/corearrays";
import { useDashboardReportsOvertime } from "@/hooks/dashboards";
import { DashboardHeader } from "../dashboard-header";
import { FileText } from "lucide-react";
import { Loader } from "../loader";
import { dateFormatter } from "@/lib/utils";

const chartConfig = {
  reports: {
    label: "Reports",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function ReportsOverTimeChart() {
  const [selectedPeriod, setSelectedPeriod] = React.useState(
    periodOptions[0].value,
  );

  const { data, isLoading, error, refetch } = useDashboardReportsOvertime({
    from: selectedPeriod == "ALL" ? undefined : selectedPeriod,
  });
  const reports = (data ?? []).map((x) => ({
    ...x,
    createdAt: dateFormatter(x.createdAt, "yyyy-MM-dd"),
  }));

  // ---- Process data to generate counts ----
  const chartData = React.useMemo(() => {
    let filtered = reports;

    if (selectedPeriod !== "ALL") {
      const start = new Date(selectedPeriod);
      filtered = reports.filter((r) => new Date(r.createdAt) >= start);
    }

    // Group by day for recent filters, month for ALL
    const groupByKey =
      selectedPeriod === "ALL"
        ? (d: string) => d.slice(0, 7)
        : (d: string) => d;

    const countsMap: Record<string, number> = {};
    filtered.forEach((r) => {
      const key = groupByKey(r.createdAt.toString());
      countsMap[key] = (countsMap[key] || 0) + 1;
    });

    // Convert to array for recharts
    return Object.entries(countsMap)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .map(([date, count]) => ({
        date: dateFormatter(date, "dd MMM ''yy"),
        count,
      }));
  }, [selectedPeriod, data]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <DashboardHeader
          title={
            <>
              <FileText className="h-4 w-4" /> Reports Created Over Time
            </>
          }
          isLoading={isLoading}
          refetch={refetch}
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
        />
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <Loader />
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <LineChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
              <Line
                type="monotone"
                dataKey="count"
                stroke="var(--color-reports)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

const DUMMY_REPORTS = [
  // January
  { id: "1", createdAt: "2025-01-03" },
  { id: "2", createdAt: "2025-01-10" },
  { id: "3", createdAt: "2025-01-15" },

  // February
  { id: "4", createdAt: "2025-02-02" },
  { id: "5", createdAt: "2025-02-14" },
  { id: "6", createdAt: "2025-02-27" },

  // March
  { id: "7", createdAt: "2025-03-05" },
  { id: "8", createdAt: "2025-03-18" },

  // April
  { id: "9", createdAt: "2025-04-01" },
  { id: "10", createdAt: "2025-04-12" },
  { id: "11", createdAt: "2025-04-25" },

  // May
  { id: "12", createdAt: "2025-05-03" },
  { id: "13", createdAt: "2025-05-11" },
  { id: "14", createdAt: "2025-05-26" },

  // June
  { id: "15", createdAt: "2025-06-04" },
  { id: "16", createdAt: "2025-06-19" },

  // July
  { id: "17", createdAt: "2025-07-08" },
  { id: "18", createdAt: "2025-07-20" },

  // August
  { id: "19", createdAt: "2025-08-02" },
  { id: "20", createdAt: "2025-08-15" },
  { id: "21", createdAt: "2025-08-29" },

  // September
  { id: "22", createdAt: "2025-09-05" },
  { id: "23", createdAt: "2025-09-14" },
  { id: "24", createdAt: "2025-09-27" },

  // October
  { id: "25", createdAt: "2025-10-03" },
  { id: "26", createdAt: "2025-10-12" },
  { id: "27", createdAt: "2025-10-25" },

  // November
  { id: "28", createdAt: "2025-11-01" },
  { id: "29", createdAt: "2025-11-06" },
  { id: "30", createdAt: "2025-11-11" },
  { id: "31", createdAt: "2025-11-18" },
  { id: "32", createdAt: "2025-11-20" },
  { id: "33", createdAt: "2025-11-22" },
  { id: "34", createdAt: "2025-11-23" },
  { id: "35", createdAt: "2025-11-24" },
];
