import { Buyer, Report } from "@prisma/client";
import {
  BuyerWithUser,
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
export const reportSampleTypeText: any = {
  [ReportSampleType.FABRIC]: "Fabric",
  [ReportSampleType.GARMENT]: "Garment",
  [ReportSampleType.YARN]: "Yarn",
  [ReportSampleType.MOCKUP]: "Mockup",
};

export const reportSampleList = Object.entries(reportSampleTypeText).map(
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

export const reportOverallResultVariants: any = {
  [ReportOverallResult.PENDING]: "secondary",
  [ReportOverallResult.PASS]: "success",
  [ReportOverallResult.FAIL]: "destructive",
};

export const reportOverallResultsList = Object.entries(
  reportOverallResultText,
).map(([value, label]) => ({
  value: Number(value),
  label: String(label),
}));

// report buyer values field text
export const reportBuyerCommonFieldsText: any = {
  ds_wash_length: "DS Wash Length",
  ds_wash_length_min: "DS Wash Length (Min)",
  ds_wash_length_max: "DS Wash Length (Max)",
  ds_wash_width: "DS Wash Width",
  ds_wash_width_min: "DS Wash Width (Min)",
  ds_wash_width_max: "DS Wash Width (Max)",
  spirality_max: "Spirality (Max)",
  cf_wash_cs: "CF to Wash - CS",
  cf_wash_cc: "CF to Wash - CC",
  cf_rub_dry: "CF to Rubbing - Dry",
  cf_rub_wet: "CF to Rubbing - Wet",
  cf_water_cs: "CF to Water - CS",
  cf_water_cc: "CF to Water -CC",
  cf_persp_cs_acd: "CF to Perspiration Acid - CS",
  cf_persp_cc_acd: "CF to Perspiration Acid - CC",
  cf_persp_cs_alk: "CF to Perspiration Alkaline - CS",
  cf_persp_cc_alk: "CF to Perspiration Alkaline - CC",
  pilling: "Pilling",
  pilling_min: "Pilling (Min)",
  pilling_max: "Pilling (Max)",
  bursting_strength_kpa: "Bursting Strength (kPa)",
  ph: "pH",
  ph_min: "pH (Min)",
  ph_max: "pH (Max)",
  gsm: "GSM",
  cf_dye_transfer: "CF to Dye Transfer",
  cc_dye_transfer: "CC to Dye Transfer",
  fabric_r_dia: "Fabric R. Dia",
  fabric_f_dia: "Fabric F. Dia",
  fabric_r_gsm: "Fabric R. GSM",
  fabric_f_gsm: "Fabric F. GSM",
};

export const getBuyerValue = (
  key: keyof Report,
  buyer?: null | BuyerWithUser,
  withBrackets = true,
  gsm?: null | number,
): string | null => {
  if (!buyer) return null;

  // length
  if (key == "ds_wash_length") {
    const val = `${buyer["ds_wash_length_min"]} to ${buyer["ds_wash_length_max"]}`;
    return withBrackets ? ` (${val})` : val;
  }

  // width
  if (key == "ds_wash_width") {
    const val = `${buyer["ds_wash_width_min"]} to ${buyer["ds_wash_width_max"]}`;
    return withBrackets ? ` (${val})` : val;
  }

  // pilling
  if (key == "pilling" && (buyer["pilling_min"] || buyer["pilling_max"])) {
    const val = `${buyer["pilling_min"]} to ${buyer["pilling_max"]}`;
    return withBrackets ? ` (${val})` : val;
  }

  // ph
  if (key == "ph" && (buyer["ph_min"] || buyer["ph_max"])) {
    const val = `${buyer["ph_min"]} to ${buyer["ph_max"]}`;
    return withBrackets ? ` (${val})` : val;
  }

  // bursting strength
  if (key == "bursting_strength_kpa" && gsm) {
    const rules = buyer?.burstingRules ?? [];
    const ruleIdx = rules.findIndex((x) => x.gsm >= gsm);
    const reqStrength = rules[ruleIdx]?.bursting_strength_kpa;

    return withBrackets ? ` (${reqStrength})` : reqStrength.toString();
  }

  // others
  const value = buyer[key as keyof Buyer];
  if (value == null || value == undefined) return null;
  return withBrackets ? ` (${value})` : value.toString();
};
