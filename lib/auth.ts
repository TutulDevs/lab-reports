import { JWTPayload, SignJWT, jwtVerify } from "jose";
import { MAX_AGE_IN_SECONDS, SESSION_COOKIE_NAME } from "./coreconstants";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
const COOKIE_NAME = process.env.COOKIE_NAME || SESSION_COOKIE_NAME;
const MAX_AGE = Number(process.env.COOKIE_MAX_AGE || MAX_AGE_IN_SECONDS); // seconds

// sign
export async function signJwt(payload: JWTPayload, expiresIn = "1h") {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
}

// verify
export async function verifyJwt<T = any>(token: string): Promise<T | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as T;
  } catch (e) {
    console.error("JWT verification failed:", e);
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
