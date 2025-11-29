import { LogsList } from "@/components/logs/logs-list";
import { PageHeaderSection } from "@/components/page-header";
import { getServerUser, getServerUsersAllForFilter } from "@/lib/fetcher";

export default async function ActivityLogsPage() {
  const me = await getServerUser();
  const users = await getServerUsersAllForFilter();

  return (
    <>
      <PageHeaderSection title={"Activity Logs"} />

      <LogsList me={me} users={users ?? []} />
    </>
  );
}
