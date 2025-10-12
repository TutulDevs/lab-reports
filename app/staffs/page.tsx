import { PageHeaderSection } from "@/components/page-header";
import {
  CreateOrUpdateStaffButton,
  StaffItemActions,
} from "@/components/staffs/staff-item-actions";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getServerUser, getServerUsersAll } from "@/lib/fetcher";
import { dateFormatter } from "@/lib/utils";
import { Role } from "@prisma/client";

export default async function StaffsPage() {
  const me = await getServerUser();
  const users = await getServerUsersAll();

  return (
    <div className="p-6 md:p-10">
      <PageHeaderSection
        title={"List of staffs"}
        subtitle={`Total: ${users?.length ?? 0}`}
      >
        <CreateOrUpdateStaffButton canEdit={me?.role == Role.ADMIN} />
      </PageHeaderSection>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users && users.length > 0
            ? users?.map((user) => {
                const canEdit = me?.id == user.id || me?.role == Role.ADMIN;
                const canDelete =
                  me?.role == Role.ADMIN && user.role == Role.STAFF;

                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>
                      {user.username}

                      {/* <br />{JSON.stringify({ canEdit, canDelete })} */}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role == Role.ADMIN ? "default" : "secondary"
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {dateFormatter(user.createdAt, "dd MMM yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <StaffItemActions
                        user={user}
                        canEdit={canEdit}
                        canDelete={canDelete}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            : "no items"}
        </TableBody>
      </Table>
    </div>
  );
}
