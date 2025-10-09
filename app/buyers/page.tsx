import { buttonVariants } from "@/components/ui/button";
import { getServerBuyersAll } from "@/lib/fetcher";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function BuyersPage() {
  const buyers = await getServerBuyersAll();

  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-wrap gap-4 justify-between">
        <div>
          <h1 className="text-lg md:text-3xl mb-2">List of Buyers</h1>
          <p>Total: {buyers?.length ?? 0}</p>
        </div>

        <Link href={"/buyers/create"} className={cn(buttonVariants())}>
          Create Buyer
        </Link>
      </div>

      <hr className="my-4" />
    </div>
  );
}
