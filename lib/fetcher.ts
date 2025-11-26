import { cookies, headers } from "next/headers";
import { COOKIE_NAME, verifyJwt } from "./auth";
import { prisma } from "@/lib/prisma";
import {
  BuyersForReport,
  BuyerWithUser,
  PartialUser,
  ReportWithUser,
} from "./types";
import { Buyer, Report } from "@prisma/client";
import { LogEvent } from "./coreconstants";

export async function getServerUser(): Promise<PartialUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  const session = await verifyJwt<{ id: string; role: string }>(token);
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    omit: { password: true },
  });
  return user;
}

export async function getServerUsersAll(): Promise<PartialUser[] | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  const session = await verifyJwt<{ id: string; role: string }>(token);
  if (!session) return null;

  const user = await prisma.user.findMany({ omit: { password: true } });
  return user;
}

export async function getServerUsersAllForFilter(): Promise<
  | {
      id: string;
      username: string;
    }[]
  | null
> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  const session = await verifyJwt<{ id: string; role: string }>(token);
  if (!session) return null;

  const users = await prisma.user.findMany({
    select: { id: true, username: true },
  });

  return users;
}

export async function getServerBuyersAll(): Promise<BuyerWithUser[] | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  const session = await verifyJwt<{ id: string; role: string }>(token);
  if (!session) return null;

  const buyers = await prisma.buyer.findMany({
    include: {
      lastUpdatedBy: { select: { username: true } },
      burstingRules: { select: { gsm: true, bursting_strength_kpa: true } },
    },
  });
  return buyers;
}

export async function getServerBuyersAllForReport(): Promise<
  BuyersForReport[] | null
> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  const session = await verifyJwt<{ id: string; role: string }>(token);
  if (!session) return null;

  const buyers = await prisma.buyer.findMany({
    select: { id: true, title: true },
  });
  return buyers;
}

export async function getServerBuyerDetails(
  id: string,
): Promise<BuyerWithUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  const session = await verifyJwt<{ id: string; role: string }>(token);
  if (!session) return null;

  const buyer = await prisma.buyer.findUnique({
    where: { id },
    include: {
      lastUpdatedBy: { select: { username: true } },
      burstingRules: { select: { gsm: true, bursting_strength_kpa: true } },
    },
  });

  return buyer;
}

export async function getServerReportsAll(): Promise<Report[] | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  const session = await verifyJwt<{ id: string; role: string }>(token);
  if (!session) return null;

  const reports = await prisma.report.findMany({});
  return reports;
}

export async function getServerReportsDetails(
  id: string,
): Promise<ReportWithUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  const session = await verifyJwt<{ id: string; role: string }>(token);
  if (!session) return null;

  const reports = await prisma.report.findFirst({
    where: { OR: [{ id: id }, { report_id: id }] },
    include: { lastUpdatedBy: { select: { username: true } } },
  });
  return reports;
}

export const logEventHandler = async (
  event: LogEvent,
  userId?: string,
  description?: string,
) => {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";

  await prisma.log.create({
    data: { event, description, userId, ip_address: ip },
  });
};
