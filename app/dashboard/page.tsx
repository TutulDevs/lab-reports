import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import data from "./data.json";

import { DashboardQuickKpi } from "@/components/dashboard/dashboard-quick-kpi";
import { ReportsOverTimeChart } from "@/components/dashboard/dashboard-report-overtime-chart";
import { ReportsPerBuyerChart } from "@/components/dashboard/dashboard-report-per-buyer-chart";
import { DashboardReportOverallResultChart } from "@/components/dashboard/dashboard-report-overall-result-chart";

export default function Page() {
  return (
    <>
      <div className="space-y-8">
        {/* kpis */}
        <DashboardQuickKpi />

        {/* report over time */}
        <ReportsOverTimeChart />

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {/* reports by buyer */}
          <ReportsPerBuyerChart className="xl:col-span-2" />

          {/* overall results */}
          <DashboardReportOverallResultChart />
        </div>
      </div>

      {/* dummy */}
      {/* <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4">
            <SectionCards />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
            <DataTable data={data} />
          </div>
        </div>
      </div> */}
    </>
  );
}
