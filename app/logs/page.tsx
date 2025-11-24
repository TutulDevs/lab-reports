import { Loader } from "@/components/loader";
import { LogsList } from "@/components/logs/logs-list";
import { StaffList } from "@/components/staffs/staff-list";
import { getServerUser } from "@/lib/fetcher";
import { Suspense } from "react";

export default async function ActivityLogsPage() {
  const me = await getServerUser();

  return (
    <>
      <LogsList me={me} />
      {/* <Suspense fallback={<Loader />}>
        <StaffList me={me} />
      </Suspense> */}
    </>
  );
}
