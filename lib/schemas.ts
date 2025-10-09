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

const buyerSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  ds_wash_length_min: z.number(),
  ds_wash_length_max: z.number(),
  ds_wash_width_min: z.number(),
  ds_wash_width_max: z.number(),
  spirality_max: z.number().optional(),
  cf_wash_cs: z.number().optional(),
  cf_wash_cc: z.number().optional(),
  cf_rub_dry: z.number().optional(),
  cf_rub_wet: z.number().optional(),
  cf_water_cs: z.number().optional(),
  cf_water_cc: z.number().optional(),
  cf_persp_cs_acd: z.number().optional(),
  cf_persp_cc_acd: z.number().optional(),
  cf_persp_cs_alk: z.number().optional(),
  cf_persp_cc_alk: z.number().optional(),
  piling_min: z.number().optional(),
  piling_max: z.number().optional(),
  bursting_strength_kpa: z.number().int().optional(),
  ph_min: z.number().optional(), // Decimal → number
  ph_max: z.number().optional(),
  cf_dye_transfer: z.number().optional(),
  fabric_r_dia: z.number().int().optional(),
  fabric_f_dia: z.number().int().optional(),
  fabric_r_gsm: z.number().int().optional(),
  fabric_f_gsm: z.number().int().optional(),
});

export const createBuyerSchema = buyerSchema.omit({ id: true });

export const updateBuyerSchema = buyerSchema.partial();
