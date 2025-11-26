import { LogsList } from "@/components/logs/logs-list";
import { getServerUser, getServerUsersAllForFilter } from "@/lib/fetcher";

export default async function ActivityLogsPage() {
  const me = await getServerUser();
  const users = await getServerUsersAllForFilter();

  return (
    <>
      <LogsList me={me} users={users ?? []} />
    </>
  );
}
