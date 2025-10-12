import { PageHeaderSection } from "@/components/page-header";
import { buttonVariants } from "@/components/ui/button";
import { getServerBuyerDetails } from "@/lib/fetcher";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function BuyerDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const buyer = await getServerBuyerDetails(id);

  if (!buyer) {
    notFound();
  }

  return (
    <div className="p-6 md:p-10">
      <PageHeaderSection
        title={buyer.title}
        // subtitle={"Fill the form to create a buyer with the requirements."}
      >
        <div className="space-x-2">
          <Link
            href={"/buyers/edit/" + buyer.id}
            className={cn(buttonVariants())}
          >
            Edit
          </Link>

          <button
            type="button"
            className={cn(buttonVariants({ variant: "destructive" }))}
          >
            Delete
          </button>
        </div>
      </PageHeaderSection>

      <pre>{JSON.stringify(buyer, null, 2)}</pre>
    </div>
  );
}
