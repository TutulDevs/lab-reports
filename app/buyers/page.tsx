import { getServerBuyersAll } from "@/lib/fetcher";

export default async function StaffsPage() {
  const buyers = await getServerBuyersAll();

  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-wrap gap-4 justify-between">
        <div>
          <h1 className="text-lg md:text-3xl mb-2">List of Buyers</h1>
          <p>Total: {buyers?.length ?? 0}</p>
        </div>
      </div>

      <hr className="my-4" />
    </div>
  );
}
