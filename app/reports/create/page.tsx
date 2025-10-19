import { PageHeaderSection } from "@/components/page-header";
import { CreateOrEditReportForm } from "@/components/reports/create-edit-report-from";
import { getServerBuyersAllForReport } from "@/lib/fetcher";

export default async function ReportsPage() {
  const buyers = await getServerBuyersAllForReport();

  return (
    <div className="p-6 md:p-10">
      <PageHeaderSection
        title={"Create a Report"}
        // subtitle={`Total: ${reports?.length ?? 0}`}
      />

      {/* form */}
      <CreateOrEditReportForm buyers={buyers ?? []} />
    </div>
  );
}
