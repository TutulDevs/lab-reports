import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifyJwt } from "@/lib/auth";
import { ReportOverallResult } from "@/lib/coreconstants";
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

    // fetch(`/api/dashboard/kpi?from=2025-01-01&to=2025-02-01`);
    // fetch(`/api/dashboard/kpi?from=2025-01-01`);
    // fetch(`/api/dashboard/kpi`);
    const { searchParams } = new URL(req.url);
    const fromStr = searchParams.get("from");
    const toStr = searchParams.get("to");

    const from = fromStr ? parseISO(fromStr) : null;
    const to = toStr ? parseISO(toStr) : new Date();

    const where: any = {};

    if (from && isValid(from))
      where.createdAt = { ...where.createdAt, gte: from };
    if (to && isValid(to)) where.createdAt = { ...where.createdAt, lte: to };

    const buyersCount = await prisma.buyer.count({ where });
    const reportsCount = await prisma.report.count({ where });
    const passCount = await prisma.report.count({
      where: { ...where, result: ReportOverallResult.PASS },
    });
    const failCount = await prisma.report.count({
      where: { ...where, result: ReportOverallResult.FAIL },
    });

    return NextResponse.json({
      buyersCount,
      reportsCount,
      passCount,
      failCount,
    });
  } catch (error) {
    console.error("Error fetching report:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
