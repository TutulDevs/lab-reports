import { PageHeaderSection } from "@/components/page-header";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ReportDetails } from "../../../components/reports/report-details";
import { Loader } from "@/components/loader";
import { getServerReportsValidity } from "@/lib/fetcher";

export default async function ReportDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: reportId } = await params;
  const report = await getServerReportsValidity(reportId);

  if (!report) {
    notFound();
  }

  return (
    <>
      <div className="p-6 md:p-10">
        <PageHeaderSection title={report.report_id}>
          <div className="space-x-2">
            <Link
              href={"/reports/edit/" + report.id}
              className={cn(buttonVariants())}
            >
              Edit
            </Link>

            {/* <BuyerDeleteBtn buyerId={report.id} /> */}
          </div>
        </PageHeaderSection>

        <Suspense fallback={<Loader className="py-8" />}>
          <ReportDetails reportId={reportId} />
        </Suspense>

        {/* <div className="grid grid-cols-2">
          <pre className="text-wrap">{JSON.stringify(report, null, 2)}</pre>
          <pre className="text-wrap"> {JSON.stringify(buyer, null, 2)}</pre>
        </div> */}
      </div>
    </>
  );
}
