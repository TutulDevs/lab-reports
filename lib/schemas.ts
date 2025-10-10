import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(
      /^[a-zA-Z0-9]+$/,
      "Username can only contain letters and numbers, no spaces or special characters"
    ),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d).+$/,
      "Password must contain both letters and numbers"
    ),
});

export const registerStaffSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(
      /^[a-zA-Z0-9]+$/,
      "Username can only contain letters and numbers, no spaces or special characters"
    ),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d).+$/,
      "Password must contain both letters and numbers"
    ),
  fullname: z.string().optional().or(z.literal("")),
  designation: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  role: z.string(),
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
      "Password must contain both letters and numbers"
    )
    .optional()
    .or(z.literal("")),
  fullname: z.string().optional().or(z.literal("")),
  designation: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  role: z.string(),
});

const reqNumNeg = z.preprocess(
  (v) => (v === "" ? undefined : Number(v)),
  z.number({ error: "Required" }).negative("Should be negative")
);
const reqNumPos = z.preprocess(
  (v) => (v === "" ? undefined : Number(v)),
  z.number({ error: "Required" }).nonnegative("Should be positive")
);

const numOptional = z.preprocess((val) => {
  if (val === "" || val === null || val === undefined) return undefined;
  const num = Number(val);
  return Number.isNaN(num) ? undefined : num;
}, z.number().optional());

const buyerSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters"),
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
  piling_min: numOptional,
  piling_max: numOptional,
  bursting_strength_kpa: numOptional,
  ph_min: numOptional,
  ph_max: numOptional,
  cf_dye_transfer: numOptional,
  fabric_r_dia: numOptional,
  fabric_f_dia: numOptional,
  fabric_r_gsm: numOptional,
  fabric_f_gsm: numOptional,
});

export const createBuyerSchema = buyerSchema.omit({ id: true });

export const updateBuyerSchema = buyerSchema.partial();
