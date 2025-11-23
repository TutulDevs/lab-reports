"use client";

import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from "recharts";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { DashboardHeader } from "../dashboard-header";
import { FileUser } from "lucide-react";
import { Loader } from "../loader";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { periodOptions } from "@/lib/corearrays";
import { useDashboardReportsPerBuyer } from "@/hooks/dashboards";
import { cn } from "@/lib/utils";
import { useDownloadDOM } from "@/hooks/use-download-dom";

// ---- Chart config ----
const chartConfig = {
  count: {
    label: "Count",
    color: "var(--chart-1)",
  },
  label: {
    color: "var(--background)",
  },
} satisfies ChartConfig;

export const ReportsPerBuyerChart: React.FC<{ className?: string }> = ({
  className,
}) => {
  const [selectedPeriod, setSelectedPeriod] = React.useState(
    periodOptions[0].value,
  );

  const { data, isLoading, error, refetch } = useDashboardReportsPerBuyer({
    from: selectedPeriod == "ALL" ? undefined : selectedPeriod,
  });

  const { ref, downloadImage } = useDownloadDOM();

  return (
    <Card className={cn("@container/card", className)} ref={ref}>
      <CardHeader>
        <DashboardHeader
          title={
            <>
              <FileUser className="h-4 w-4" /> Reports per Buyer
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
            className="w-full"
            style={{ height: data && data?.length ? data?.length * 40 : 100 }}
          >
            <BarChart
              accessibilityLayer
              data={data}
              layout="vertical"
              margin={{ right: 16 }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="title"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
                hide
              />
              <XAxis dataKey="count" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Bar
                dataKey="count"
                layout="vertical"
                fill="var(--color-count)"
                radius={4}
              >
                <LabelList
                  dataKey="title"
                  position="insideLeft"
                  offset={8}
                  className="fill-(--color-label)"
                  fontSize={14}
                />
                <LabelList
                  dataKey="count"
                  position="right"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

const dummyReportsPerBuyer = [
  { title: "Buyer A", count: 18 },
  { title: "Buyer B", count: 24 },
  { title: "Buyer C", count: 12 },
  { title: "Buyer D", count: 30 },
  { title: "Buyer E", count: 8 },
];
