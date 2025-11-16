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
import { roleText, roleVariants } from "@/lib/corearrays";
import { PartialUser, Role } from "@/lib/coreconstants";
import { getServerUsersAll } from "@/lib/fetcher";
import { dateFormatter } from "@/lib/utils";

export const StaffList: React.FC<{ me: PartialUser | null }> = async ({
  me,
}) => {
  const users = await getServerUsersAll();

  return (
    <>
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
                      <Badge variant={roleVariants[user.role]}>
                        {roleText[user.role]}
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
    </>
  );
};
