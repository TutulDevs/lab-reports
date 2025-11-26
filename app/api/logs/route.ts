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

    // ---- Parse query params ----
    // /api/logs?from=2025-11-19&sort=dsc&limit=10
    const { searchParams } = new URL(req.url);
    const fromStr = searchParams.get("from");
    const toStr = searchParams.get("to");
    const query = searchParams.get("query") ?? "";
    const sort = searchParams.get("sort") === "asc" ? "asc" : "desc"; // fallback desc
    const limit = Number(searchParams.get("limit") ?? 10);
    const offset = Number(searchParams.get("offset") ?? 0);

    const from = fromStr ? parseISO(fromStr) : null;
    const to = toStr ? parseISO(toStr) : new Date();

    const userId = searchParams.get("userId") ?? "";
    const event = Number(searchParams.get("event") ?? "") || null;

    // ---- Build prisma filter ----
    const where: any = {};

    if (from && isValid(from))
      where.createdAt = { ...where.createdAt, gte: from };
    if (to && isValid(to)) where.createdAt = { ...where.createdAt, lte: to };

    if (userId) where.userId = userId;
    if (event) where.event = event;

    if (query) {
      where.OR = [
        { id: { contains: query, mode: "insensitive" } },
        { userId: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { ip_address: { contains: query, mode: "insensitive" } },
        { user: { username: { contains: query, mode: "insensitive" } } },
      ];
    }

    // ---- Total count (for pagination) ----
    const total = await prisma.log.count({ where });

    // ---- Paginated data ----
    const logs = await prisma.log.findMany({
      where,
      include: {
        user: { select: { id: true, username: true } },
      },
      orderBy: { createdAt: sort },
      take: limit,
      skip: offset,
    });

    return NextResponse.json({
      data: logs,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error fetching report:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
