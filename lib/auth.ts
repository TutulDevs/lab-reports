import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
const COOKIE_NAME = process.env.COOKIE_NAME || "sb_session";
const MAX_AGE = Number(process.env.COOKIE_MAX_AGE || 60 * 60 * 24 * 7); // seconds

export function signJwt(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: `${MAX_AGE}s` });
}

export function verifyJwt<T = any>(token: string): T | null {
  try {
    return jwt.verify(token, JWT_SECRET) as T;
  } catch (e) {
    return null;
  }
}

export function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: MAX_AGE,
  };
}

export { COOKIE_NAME };
