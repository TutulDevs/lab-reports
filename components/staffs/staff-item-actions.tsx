"use client";

import { PartialUser } from "@/lib/types";
import React, { useState } from "react";
import { Button, buttonVariants } from "../ui/button";
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
import { CreateOrUpdateUserForm } from "./create-or-update-form";
import {
  roleText,
  roleVariants,
  userStatusText,
  userStatusVariants,
} from "@/lib/corearrays";

export const StaffItemActions: React.FC<{
  user: PartialUser;
  canEdit: boolean;
  canDelete: boolean;
  refetch: () => void;
}> = ({ user, canEdit, canDelete, refetch }) => {
  const detailsInfo = [
    { title: "ID", children: user.id },
    { title: "Username", children: user.username },
    {
      title: "Role",
      children: (
        <Badge variant={roleVariants[user.role]}>{roleText[user.role]}</Badge>
      ),
    },
    {
      title: "Status",
      children:
        user?.status == null || user?.status == undefined ? (
          "N/A"
        ) : (
          <Badge variant={userStatusVariants[user.status]}>
            {userStatusText[user.status]}
          </Badge>
        ),
    },
    { title: "Full Name", children: user.fullname ?? "N/A" },
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

  const [openEdit, setOpenEdit] = useState(false);

  return (
    <>
      {/* view details */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size={"icon-sm"}>
            <Fullscreen />
          </Button>
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
      <CreateOrUpdateStaffButton
        user={user}
        canEdit={canEdit}
        onSuccess={refetch}
      />
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
        className,
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
  onSuccess: () => void;
}> = ({ user, canEdit, onSuccess }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={() => setOpen((v) => !v)}>
        <DialogTrigger
          className={cn({
            [buttonVariants()]: !user,
            [buttonVariants({ size: "icon-sm" }) + " mx-2 "]: !!user,
          })}
          disabled={!canEdit}
        >
          {!user ? "Create Staff" : <SquarePen />}
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {!user ? "Create a staff" : `Update ${user.username}`}
            </DialogTitle>
            <DialogDescription asChild>
              <CreateOrUpdateUserForm
                user={user}
                onSuccess={() => {
                  setOpen(false);
                  onSuccess();
                }}
              />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};
