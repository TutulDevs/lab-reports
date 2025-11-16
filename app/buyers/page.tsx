import { Suspense } from "react";
import { BuyersList } from "@/components/buyers/buyers-list";
import { Loader } from "@/components/loader";

export default async function BuyersPage() {
  return (
    <div className="p-6 md:p-10">
      <Suspense fallback={<Loader />}>
        <BuyersList />
      </Suspense>
    </div>
  );
}
