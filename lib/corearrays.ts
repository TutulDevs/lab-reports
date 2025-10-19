import { ReportStatus, Role } from "./coreconstants";

export const commonValuesList = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

// role
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

// report status
export const reportStatusText: any = {
  [ReportStatus.IN_PROGRESS]: "In Progress",
  [ReportStatus.PENDING]: "Pending",
  [ReportStatus.COMPLETED]: "Completed",
};

export const reportStatusVariants: any = {
  [ReportStatus.IN_PROGRESS]: "secondary",
  [ReportStatus.PENDING]: "default",
  [ReportStatus.COMPLETED]: "success",
};

export const reportStatusList = Object.entries(reportStatusText).map(
  ([value, label]) => ({
    value: Number(value),
    label: String(label),
  }),
);
