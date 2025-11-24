import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifyJwt } from "@/lib/auth";
import { isValid, parseISO } from "date-fns";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ error: "Access denied" }, { status: 401 });
    }

    const session = await verifyJwt<{ id: string; role: number }>(token);

    if (!session) {
      return NextResponse.json({ error: "Access denied" }, { status: 401 });
    }

    // const { searchParams } = new URL(req.url);
    // const fromStr = searchParams.get("from");
    // const toStr = searchParams.get("to");

    // const from = fromStr ? parseISO(fromStr) : null;
    // const to = toStr ? parseISO(toStr) : new Date();

    // const where: any = {};

    // if (from && isValid(from))
    //   where.createdAt = { ...where.createdAt, gte: from };
    // if (to && isValid(to)) where.createdAt = { ...where.createdAt, lte: to };

    const logs = await prisma.log.findMany({
      where: {},
      include: { user: { select: { id: true, username: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Error fetching report:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
