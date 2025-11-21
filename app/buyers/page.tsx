import { Suspense } from "react";
import { BuyersList } from "@/components/buyers/buyers-list";
import { Loader } from "@/components/loader";

export default async function BuyersPage() {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <BuyersList />
      </Suspense>
    </>
  );
}
