import { COOKIE_NAME, verifyJwt } from "@/lib/auth";
import { LogEvent } from "@/lib/coreconstants";
import { logEventHandler } from "@/lib/fetcher";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const session = await verifyJwt<{ id: string; role: string }>(token ?? "");

  cookieStore.delete(COOKIE_NAME);
  await logEventHandler(LogEvent.LOGOUT, session?.id);

  return NextResponse.json({ ok: true });
}
