import { PageHeaderSection } from "@/components/page-header";
import { CreateOrEditReportForm } from "@/components/reports/create-edit-report-from";
import { getServerReportsDetails } from "@/lib/fetcher";
import { notFound } from "next/navigation";

export default async function ReportEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: reportId } = await params;
  const reportData = await getServerReportsDetails(reportId);

  if (!reportData) {
    notFound();
  }

  return (
    <>
      <PageHeaderSection
        title={`Update ${reportData.report_id}`}
        subtitle={"Fill the form to update the report"}
      />

      {/* form */}
      <CreateOrEditReportForm buyers={[]} report={reportData} />
    </>
  );
}
