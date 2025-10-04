import { User } from "@prisma/client";

export const MAX_AGE_IN_SECONDS = 86400;
export const SESSION_COOKIE_NAME = "lab_session";

export type PartialUser = Omit<User, "password">;
