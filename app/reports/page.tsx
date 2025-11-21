import { Suspense } from "react";
import { ReportsList } from "@/components/reports/reports-list";
import { Loader } from "@/components/loader";

export default async function ReportsPage() {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <ReportsList />
      </Suspense>
    </>
  );
}
