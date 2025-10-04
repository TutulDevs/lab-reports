import { User } from "@prisma/client";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifyJwt } from "./auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_BASE_API_URL; // NEXT_PUBLIC_BASE_API_URL=http://localhost:3000/api

export async function getServerUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  const session = await verifyJwt<{ id: string; role: string }>(token);
  if (!session) return null;

  const user = await prisma.user.findUnique({ where: { id: session.id } });
  return user;
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  revalidatePath("/login");
  redirect("/login");
}
