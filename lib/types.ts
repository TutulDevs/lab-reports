import { Prisma, User } from "@prisma/client";
import { ReportOverallResult } from "./coreconstants";

export type PartialUser = Omit<User, "password">;

export type BuyerWithUser = Prisma.BuyerGetPayload<{
  include: {
    lastUpdatedBy: { select: { username: true } };
    burstingRules: { select: { gsm: true; bursting_strength_kpa: true } };
  };
}>;

export type ReportWithUser = Prisma.ReportGetPayload<{
  include: { lastUpdatedBy: { select: { username: true } } };
}>;

export type BuyersForReport = Prisma.BuyerGetPayload<{
  select: { id: true; title: true };
}>;

export type DashboardKpi = {
  buyersCount: number;
  reportsCount: number;
  passCount: number;
  failCount: number;
};

export type DashboardReportsOvertime = Prisma.ReportGetPayload<{
  select: { id: true; createdAt: true };
}>;

export type DashboardReportsPerBuyer = {
  title: string;
  count: number;
};

export type DashboardReportOverallResult = {
  status: ReportOverallResult;
  count: number;
};
