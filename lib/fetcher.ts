import { cookies } from "next/headers";
import { COOKIE_NAME, verifyJwt } from "./auth";
import { prisma } from "@/lib/prisma";
import { BuyerWithUser, PartialUser } from "./coreconstants";
import { Report } from "@prisma/client";

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

export async function getServerBuyersAll(): Promise<BuyerWithUser[] | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  const session = await verifyJwt<{ id: string; role: string }>(token);
  if (!session) return null;

  const buyers = await prisma.buyer.findMany({
    include: { lastUpdatedBy: { select: { username: true } } },
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
    include: { lastUpdatedBy: { select: { username: true } } },
  });

  return buyer;
}

export async function getServerReportsAll(): Promise<Report[] | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  const session = await verifyJwt<{ id: string; role: string }>(token);
  if (!session) return null;

  const reports = await prisma.report.findMany({
    // include: { lastUpdatedBy: { select: { username: true } } },
  });
  return reports;
}
