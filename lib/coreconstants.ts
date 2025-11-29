export const MAX_AGE_IN_SECONDS = 86400;
export const SESSION_COOKIE_NAME = "lab_session";

export enum Role {
  ADMIN = 1,
  STAFF = 2,
}

export enum UserStatus {
  INACTIVE = 0,
  ACTIVE = 1,
  SUSPENDED = 2,
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

export enum LogEvent {
  LOGIN = 1,
  LOGOUT = 2,

  STAFF_CREATE = 3,
  STAFF_UPDATE = 4,
  STAFF_DELETE = 5,
  STAFF_DOWNLOAD = 6,

  BUYER_CREATE = 7,
  BUYER_UPDATE = 8,
  BUYER_DELETE = 9,
  BUYER_DOWNLOAD = 10,

  REPORT_CREATE = 11,
  REPORT_UPDATE = 12,
  REPORT_DELETE = 13,
  REPORT_DOWNLOAD = 14,

  LOG_DOWNLOAD = 15,
}

export const DEFAULT_TABLE_LIMIT = 20;
export const DEFAULT_TABLE_OFFSET = 0;
