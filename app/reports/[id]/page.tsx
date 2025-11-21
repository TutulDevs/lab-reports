import { Suspense } from "react";
import { ReportDetails } from "../../../components/reports/report-details";
import { Loader } from "@/components/loader";

export default async function ReportDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: reportId } = await params;

  return (
    <>
      <Suspense fallback={<Loader className="py-8" />}>
        <ReportDetails reportId={reportId} />
      </Suspense>
    </>
  );
}
