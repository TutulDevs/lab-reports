import { Prisma, User } from "@prisma/client";

export const MAX_AGE_IN_SECONDS = 86400;
export const SESSION_COOKIE_NAME = "lab_session";

export type PartialUser = Omit<User, "password">;

export type BuyerWithUser = Prisma.BuyerGetPayload<{
  include: { lastUpdatedBy: { select: { username: true } } };
}>;

export type BuyersForReport = {
  id: string;
  title: string;
};

export enum Role {
  ADMIN = 1,
  STAFF = 2,
}

export enum ReportStatus {
  IN_PROGRESS = 1,
  PENDING = 2,
  COMPLETED = 3,
}

export enum ReportSampleType {
  FABRIC = 1,
  GARMENT = 2,
  YARN = 3,
  MOCKUP = 4,
}

export enum ReportSampleStage {
  A_STENTER = 1,
  A_COMPACTING = 2,
  A_DRAYER = 3,
  A_TUMBLE = 4,
  SAMPLE = 5,
  RND = 6,
  KNITTING = 7,
  WASHING = 8,
}

export enum ReportDryProcess {
  LINE = 1,
  FLAT = 2,
  TUBLE = 3,
}

export enum ReportOverallResult {
  PENDING = 1,
  PASS = 2,
  FAIL = 3,
}
