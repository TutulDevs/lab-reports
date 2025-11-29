import { StaffList } from "@/components/staffs/staff-list";
import { getServerUser } from "@/lib/fetcher";

export default async function StaffsPage() {
  const me = await getServerUser();

  return (
    <>
      <StaffList me={me} />
    </>
  );
}
