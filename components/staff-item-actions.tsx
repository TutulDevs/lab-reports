"use client";

import { PartialUser } from "@/lib/coreconstants";
import React from "react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Fullscreen, SquarePen, UserRoundX } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { cn, dateFormatter } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { Role } from "@prisma/client";

export const StaffItemActions: React.FC<{
  user: PartialUser;
  isAdmin: boolean;
}> = ({ user, isAdmin }) => {
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
        <a href={"tel:+" + user.phone}>{user.phone}</a>
      ),
    },
    {
      title: "Email",
      children: !user.email ? (
        "N/A"
      ) : (
        <a href={"mailto:" + user.email}>{user.email}</a>
      ),
    },
    { title: "Created At", children: dateFormatter(user.createdAt) },
    { title: "Updated At", children: dateFormatter(user.updatedAt) },
  ];

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
      <Dialog>
        <DialogTrigger>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="default" size={"icon-sm"} className="mx-2">
                <SquarePen />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Staff</p>
            </TooltipContent>
          </Tooltip>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>{`Update ${user.username}`}</DialogTitle>
            <DialogDescription className="mt-4">
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* delete */}
      <Tooltip>
        <TooltipTrigger>
          <Button
            variant="destructive"
            size={"icon-sm"}
            disabled={user.role == Role.STAFF || isAdmin}
            onClick={() => alert("hello")}
          >
            <UserRoundX />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {user.role == Role.STAFF
              ? "Only admin can delete staff"
              : isAdmin
                ? "Admin cannot be deleted"
                : "Delete Staff"}
          </p>
        </TooltipContent>
      </Tooltip>
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
