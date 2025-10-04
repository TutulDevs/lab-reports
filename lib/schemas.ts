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
  username: z.string().min(3),
  password: z.string().min(6),
});
