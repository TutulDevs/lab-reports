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

    // fetch(`/reports-per-buyer?from=2025-01-01&to=2025-02-01`);
    // fetch(`/reports-per-buyer?from=2025-01-01`);
    // fetch(`/reports-per-buyer`);
    const { searchParams } = new URL(req.url);
    const fromStr = searchParams.get("from");
    const toStr = searchParams.get("to");

    const from = fromStr ? parseISO(fromStr) : null;
    const to = toStr ? parseISO(toStr) : new Date();

    const where: any = {};

    if (from && isValid(from))
      where.createdAt = { ...where.createdAt, gte: from };
    if (to && isValid(to)) where.createdAt = { ...where.createdAt, lte: to };

    const reportsPerBuyer = await prisma.report.groupBy({
      by: ["buyerId"],
      _count: { buyerId: true },
    });
    // console.log("reportsPerBuyer:", reportsPerBuyer);

    // fetch buyer names
    const buyerIds = reportsPerBuyer.map((r) => r.buyerId);
    // console.log("buyerIds:", buyerIds);

    const buyers = await prisma.buyer.findMany({
      where: { id: { in: buyerIds } },
      select: { id: true, title: true },
    });
    // console.log("buyers:", buyers);

    // merge
    const data = reportsPerBuyer.map((r) => ({
      title: buyers.find((b) => b.id === r.buyerId)?.title || "Unknown",
      count: r._count.buyerId,
    }));
    // console.log("data:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching report:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
