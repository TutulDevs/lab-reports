import { Role } from "./coreconstants";

export const roleText: any = {
  [Role.ADMIN]: "Admin",
  [Role.STAFF]: "Staff",
};

export const roleVariants: any = {
  [Role.ADMIN]: "default",
  [Role.STAFF]: "secondary",
};

export const roleList = Object.entries(roleText).map(([value, label]) => ({
  value: Number(value),
  label: String(label),
}));
