import { Buyer, User } from "@prisma/client";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifyJwt } from "./auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { PartialUser } from "./coreconstants";

const API_URL = process.env.NEXT_PUBLIC_BASE_API_URL; // NEXT_PUBLIC_BASE_API_URL=http://localhost:3000/api

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

export async function getServerBuyersAll(): Promise<Buyer[] | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  const session = await verifyJwt<{ id: string; role: string }>(token);
  if (!session) return null;

  const buyers = await prisma.buyer.findMany({});
  return buyers;
}
