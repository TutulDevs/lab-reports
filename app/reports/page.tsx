import { Suspense } from "react";
import { ReportsList } from "@/components/reports/reports-list";
import { Loader } from "@/components/loader";

export default async function ReportsPage() {
  return (
    <>
      <div className="p-6 md:p-10">
        <Suspense fallback={<Loader />}>
          <ReportsList />
        </Suspense>
      </div>
    </>
  );
}
