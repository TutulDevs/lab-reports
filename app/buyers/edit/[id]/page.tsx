import { CreateOrEditBuyerForm } from "@/components/buyers/create-or-edit-buyer-form";
import { PageHeaderSection } from "@/components/page-header";
import { getServerBuyerDetails } from "@/lib/fetcher";
import { BuyerWithUser } from "@/lib/types";
import { toPlainObject } from "@/lib/utils";
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

  const safeBuyer: BuyerWithUser = toPlainObject(buyer);

  return (
    <>
      <PageHeaderSection
        title={`Update ${buyer.title}`}
        subtitle={"Fill the form to update buyer with the requirements."}
      />

      <CreateOrEditBuyerForm buyer={safeBuyer} />
    </>
  );
}
