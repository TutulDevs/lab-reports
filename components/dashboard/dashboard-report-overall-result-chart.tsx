"use client";

import * as React from "react";
import { PieChart, Pie } from "recharts";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { DashboardHeader } from "../dashboard-header";
import { PieChart as PieChartIcon } from "lucide-react";
import { Loader } from "../loader";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { periodOptions, reportOverallResultText } from "@/lib/corearrays";
import { useDashboardReportOverallResult } from "@/hooks/dashboards";
import { ReportOverallResult } from "@/lib/coreconstants";
import { useDownloadDOM } from "@/hooks/use-download-dom";

// ---- Chart config ----
const chartConfig = {
  [reportOverallResultText[ReportOverallResult.PENDING]]: {
    label: reportOverallResultText[ReportOverallResult.PENDING],
    color: "var(--secondary)",
  },
  [reportOverallResultText[ReportOverallResult.PASS]]: {
    label: reportOverallResultText[ReportOverallResult.PASS],
    color: "var(--chart-2)",
  },
  [reportOverallResultText[ReportOverallResult.FAIL]]: {
    label: reportOverallResultText[ReportOverallResult.FAIL],
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export const DashboardReportOverallResultChart = () => {
  const [selectedPeriod, setSelectedPeriod] = React.useState(
    periodOptions[0].value,
  );

  const { data, isLoading, error, refetch } = useDashboardReportOverallResult({
    from: selectedPeriod == "ALL" ? undefined : selectedPeriod,
  });

  const chartData = data?.map((item) => ({
    ...item,
    statusText: reportOverallResultText[item.status],
    fill: `var(--color-${reportOverallResultText[item.status]})`,
  }));

  const { ref, downloadImage } = useDownloadDOM();

  return (
    <Card className="@container/card" ref={ref}>
      <CardHeader>
        <DashboardHeader
          title={
            <>
              <PieChartIcon className="h-4 w-4" /> Reports Status
            </>
          }
          isLoading={isLoading}
          refetch={() => refetch()}
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          onCapture={downloadImage}
        />
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <Loader />
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie data={chartData} dataKey="count" nameKey="statusText" />
              <ChartLegend
                content={<ChartLegendContent nameKey="statusText" />}
                className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

const DUMMY_DATA = [
  { status: ReportOverallResult.PENDING, count: 200 },
  { status: ReportOverallResult.PASS, count: 300 },
  { status: ReportOverallResult.FAIL, count: 30 },
];
