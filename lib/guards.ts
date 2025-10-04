import { NextApiRequest, NextApiResponse } from "next";
import { COOKIE_NAME, verifyJwt } from "./auth";

export async function requireUser(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies[COOKIE_NAME];
  const session = token
    ? await verifyJwt<{ id: string; role: string }>(token)
    : null;
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }
  return session;
}

export async function requireRole(
  req: NextApiRequest,
  res: NextApiResponse,
  role: "ADMIN" | "STAFF"
) {
  const s = await requireUser(req, res);
  if (!s) return null;
  if (s.role !== role) {
    res.status(403).json({ error: "Forbidden" });
    return null;
  }
  return s;
}
