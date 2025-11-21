import { BuyerDetails } from "@/components/buyers/buyer-details";
import { Loader } from "@/components/loader";
import { Suspense } from "react";

export default async function BuyerDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <Suspense fallback={<Loader className="py-8" />}>
        <BuyerDetails buyerId={id} />
      </Suspense>
    </>
  );
}
