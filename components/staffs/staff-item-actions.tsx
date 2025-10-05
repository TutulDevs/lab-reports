"use client";

import { PartialUser } from "@/lib/coreconstants";
import React, { useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Fullscreen, SquarePen, UserRoundX } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { cn, dateFormatter } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Role } from "@prisma/client";
import { CreateOrUpdateUserForm } from "./create-or-update-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const StaffItemActions: React.FC<{
  user: PartialUser;
  canEdit: boolean;
  canDelete: boolean;
}> = ({ user, canEdit, canDelete }) => {
  const detailsInfo = [
    { title: "ID", children: user.id },
    { title: "Username", children: user.username },
    { title: "Full Name", children: user.fullname ?? "N/A" },
    {
      title: "Role",
      children: (
        <Badge variant={user.role == Role.ADMIN ? "default" : "secondary"}>
          {user.role}
        </Badge>
      ),
    },
    { title: "Designation", children: user.designation ?? "N/A" },
    {
      title: "Phone",
      children: !user.phone ? (
        "N/A"
      ) : (
        <a
          href={"tel:+" + user.phone}
          className={cn("text-primary hover:underline")}
        >
          {user.phone}
        </a>
      ),
    },
    {
      title: "Email",
      children: !user.email ? (
        "N/A"
      ) : (
        <a
          href={"mailto:" + user.email}
          className={cn("text-primary hover:underline")}
        >
          {user.email}
        </a>
      ),
    },
    { title: "Created At", children: dateFormatter(user.createdAt) },
    { title: "Updated At", children: dateFormatter(user.updatedAt) },
  ];

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const deleteStaff = async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/staff/${user.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const status = res.status;
      const data = await res.json();

      // console.log("res:", status, res);
      // console.log("data:", data);

      if (data?.success) {
        toast.success(data?.message || `Staff deleted successfully"}`);

        router.refresh();
      } else {
        toast.error(data?.error || `Failed to delete staff`);
        if (status == 401) window.location.href = "/login";
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to delete staff");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* view details */}
      <Dialog>
        <DialogTrigger>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size={"icon-sm"}>
                <Fullscreen />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View Details</p>
            </TooltipContent>
          </Tooltip>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>{`Details of ${user.username}`}</DialogTitle>

            <DialogDescription className="mt-4">
              {detailsInfo.map((x, i) => (
                <Item
                  key={x.title}
                  title={x.title}
                  className={i == 0 ? "" : "border-t"}
                >
                  {x.children}
                </Item>
              ))}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* edit */}
      <CreateOrUpdateStaffButton user={user} canEdit={canEdit} />

      {/* delete */}
      <AlertDialog>
        <AlertDialogTrigger disabled={!canDelete}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="destructive"
                size={"icon-sm"}
                disabled={!canDelete}
              >
                <UserRoundX />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{!canDelete ? "Not permitted" : "Delete Staff"}</p>
            </TooltipContent>
          </Tooltip>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the{" "}
              {`staff's`}
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={cn(buttonVariants({ variant: "destructive" }))}
              onClick={deleteStaff}
              disabled={loading}
            >
              {loading ? "Deleting" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

const Item: React.FC<{
  title: string;
  className?: string;
  children: React.ReactNode;
}> = ({ title, className, children }) => {
  return (
    <div
      className={cn(
        "flex gap-2 items-center justify-between flex-wrap pt-2 border-dotted mb-2",
        className
      )}
    >
      <strong>{title}</strong>
      <span>{children}</span>
    </div>
  );
};

export const CreateOrUpdateStaffButton: React.FC<{
  user?: PartialUser;
  canEdit?: boolean;
}> = ({ user, canEdit }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={() => setOpen((v) => !v)}>
        <DialogTrigger disabled={!canEdit}>
          {!user ? (
            <Button variant="default">Create Staff</Button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="default"
                  size={"icon-sm"}
                  className="mx-2"
                  disabled={!canEdit}
                >
                  <SquarePen />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Staff</p>
              </TooltipContent>
            </Tooltip>
          )}
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {!user ? "Create a staff" : `Update ${user.username}`}
            </DialogTitle>
            <DialogDescription asChild>
              <CreateOrUpdateUserForm
                user={user}
                closeModal={() => setOpen(false)}
              />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};
