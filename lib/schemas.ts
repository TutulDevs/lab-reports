import { Buyer } from "@prisma/client";
import { z } from "zod";

const reqNumNeg = z.preprocess(
  (v) => (v === "" ? undefined : Number(v)),
  z.number({ error: "Required" }).negative("Should be negative"),
);
const reqNumPos = z.preprocess(
  (v) => (v === "" ? undefined : Number(v)),
  z.number({ error: "Required" }).nonnegative("Should be positive"),
);
const reqNum = z.preprocess(
  (v) => (v === "" ? undefined : Number(v)),
  z.number({ error: "Required" }),
);

const numOptional = z.preprocess((val) => {
  if (val === "" || val === null || val === undefined) return undefined;
  const num = Number(val);
  return Number.isNaN(num) ? undefined : num;
}, z.number().optional());

// auth
export const loginSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(
      /^[a-zA-Z0-9]+$/,
      "Username can only contain letters and numbers, no spaces or special characters",
    ),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d).+$/,
      "Password must contain both letters and numbers",
    ),
});

export const registerStaffSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(
      /^[a-zA-Z0-9]+$/,
      "Username can only contain letters and numbers, no spaces or special characters",
    ),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d).+$/,
      "Password must contain both letters and numbers",
    ),
  fullname: z.string().optional().or(z.literal("")),
  designation: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  role: z.number(),
  status: z.number(),
});

export const updateStaffSchema = z.object({
  id: z.string(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9]+$/, "Username can only contain letters and numbers"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d).+$/,
      "Password must contain both letters and numbers",
    )
    .optional()
    .or(z.literal("")),
  fullname: z.string().optional().or(z.literal("")),
  designation: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  role: z.number(),
  status: z.number(),
});

// buyer
const buyerSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  burstingRules: z
    .array(z.object({ gsm: reqNumPos, bursting_strength_kpa: reqNumPos }))
    .optional(),
  ds_wash_length_min: reqNumNeg,
  ds_wash_length_max: reqNumPos,
  ds_wash_width_min: reqNumNeg,
  ds_wash_width_max: reqNumPos,
  spirality_max: numOptional,
  cf_wash_cs: numOptional,
  cf_wash_cc: numOptional,
  cf_rub_dry: numOptional,
  cf_rub_wet: numOptional,
  cf_water_cs: numOptional,
  cf_water_cc: numOptional,
  cf_persp_cs_acd: numOptional,
  cf_persp_cc_acd: numOptional,
  cf_persp_cs_alk: numOptional,
  cf_persp_cc_alk: numOptional,
  pilling_min: numOptional,
  pilling_max: numOptional,
  ph_min: numOptional,
  ph_max: numOptional,
  cf_dye_transfer: numOptional,
  cc_dye_transfer: numOptional,
  fabric_r_dia: numOptional,
  fabric_f_dia: numOptional,
  fabric_r_gsm: numOptional,
  fabric_f_gsm: numOptional,
});

export const createBuyerSchema = buyerSchema.omit({ id: true });
export const updateBuyerSchema = buyerSchema.partial();

// reports
const reportSchema = z.object({
  id: z.string().optional(),
  buyerId: z.string().min(1, "Buyer is required"),
  buyer: z.custom<Buyer>().optional(),

  // report related
  sample_receive_date: z.coerce.date(),
  report_id: z.string(),
  status: z.number(),
  sample_type: numOptional,
  sample_stage: numOptional,
  dry_process: numOptional,
  order_number: reqNum,
  batch_number: reqNum,
  color: z.string().optional(),
  fabric_type: z.string().optional(),
  roll_number: reqNumPos,
  result: z.number(),
  fail_portions: z.string().optional(),
  remarks: z.string().optional(),
  gsm: reqNum,

  // for buyer req
  ds_wash_length: reqNum,
  ds_wash_width: reqNum,
  spirality_max: numOptional,
  cf_wash_cs: numOptional,
  cf_wash_cc: numOptional,
  cf_rub_dry: numOptional,
  cf_rub_wet: numOptional,
  cf_water_cs: numOptional,
  cf_water_cc: numOptional,
  cf_persp_cs_acd: numOptional,
  cf_persp_cc_acd: numOptional,
  cf_persp_cs_alk: numOptional,
  cf_persp_cc_alk: numOptional,
  pilling: numOptional,
  bursting_strength_kpa: numOptional,
  ph: numOptional,
  cf_dye_transfer: numOptional,
  cc_dye_transfer: numOptional,
  fabric_r_dia: numOptional,
  fabric_f_dia: numOptional,
  fabric_r_gsm: numOptional,
  fabric_f_gsm: numOptional,
});

export const createReportSchema = reportSchema.omit({ id: true });
export const updateReportSchema = reportSchema.partial();
