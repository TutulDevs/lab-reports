import { PageHeaderSection } from "@/components/page-header";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getServerReportsDetails } from "@/lib/fetcher";
import { notFound } from "next/navigation";

export default async function ReportDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const report = await getServerReportsDetails(id);

  if (!report) {
    notFound();
  }

  const { buyer, ...rest } = report;

  return (
    <>
      <div className="p-6 md:p-10">
        <PageHeaderSection title={report.id}>
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

        <div className="grid grid-cols-2">
          <pre className="text-wrap">{JSON.stringify(rest, null, 2)}</pre>
          <pre className="text-wrap"> {JSON.stringify(buyer, null, 2)}</pre>
        </div>
      </div>
    </>
  );
}
