import { Loader } from "@/components/loader";
import { StaffList } from "@/components/staffs/staff-list";
import { getServerUser } from "@/lib/fetcher";
import { Suspense } from "react";

export default async function StaffsPage() {
  const me = await getServerUser();

  return (
    <div className="p-6 md:p-10">
      <Suspense fallback={<Loader />}>
        <StaffList me={me} />
      </Suspense>
    </div>
  );
}
