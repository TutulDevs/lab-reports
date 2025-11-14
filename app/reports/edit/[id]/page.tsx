import { PageHeaderSection } from "@/components/page-header";
import { CreateOrEditReportForm } from "@/components/reports/create-edit-report-from";
import { getServerReportsDetails } from "@/lib/fetcher";
import { toPlainObject } from "@/lib/utils";
import { Buyer } from "@prisma/client";
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

  // const safeBuyer: Buyer = toPlainObject(reportData);

  return (
    <div className="p-6 md:p-10">
      <PageHeaderSection
        title={`Update ${reportData.report_id}`}
        subtitle={"Fill the form to update the report"}
      />

      {/* form */}
      <CreateOrEditReportForm buyers={[]} report={reportData} />
    </div>
  );
}
