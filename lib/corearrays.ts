import {
  ReportDryProcess,
  ReportOverallResult,
  ReportSampleStage,
  ReportSampleType,
  ReportStatus,
  Role,
} from "./coreconstants";

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

// report sample type
export const reportSampleText: any = {
  [ReportSampleType.FABRIC]: "Fabric",
  [ReportSampleType.GARMENT]: "Garment",
  [ReportSampleType.YARN]: "Yarn",
  [ReportSampleType.MOCKUP]: "Mockup",
};

export const reportSampleList = Object.entries(reportSampleText).map(
  ([value, label]) => ({
    value: Number(value),
    label: String(label),
  }),
);

// report sample stage
export const reportSampleStageText: any = {
  [ReportSampleStage.A_STENTER]: "A-Stenter",
  [ReportSampleStage.A_COMPACTING]: "A-Compacting",
  [ReportSampleStage.A_DRAYER]: "A-Dryer",
  [ReportSampleStage.A_TUMBLE]: "A-Tumble",
  [ReportSampleStage.SAMPLE]: "Sample",
  [ReportSampleStage.RND]: "R&D",
  [ReportSampleStage.KNITTING]: "Knitting",
  [ReportSampleStage.WASHING]: "Washing",
};

export const reportSampleStageList = Object.entries(reportSampleStageText).map(
  ([value, label]) => ({
    value: Number(value),
    label: String(label),
  }),
);

// report dry process
export const reportDryProcessText: any = {
  [ReportDryProcess.LINE]: "Line",
  [ReportDryProcess.FLAT]: "Flat",
  [ReportDryProcess.TUBLE]: "Tube",
};

export const reportDryProcessList = Object.entries(reportDryProcessText).map(
  ([value, label]) => ({
    value: Number(value),
    label: String(label),
  }),
);

// report overall result
export const reportOverallResultText: any = {
  [ReportOverallResult.PENDING]: "Pending",
  [ReportOverallResult.PASS]: "Pass",
  [ReportOverallResult.FAIL]: "Fail",
};

export const reportOverallResultsList = Object.entries(
  reportOverallResultText,
).map(([value, label]) => ({
  value: Number(value),
  label: String(label),
}));
