import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifyJwt } from "@/lib/auth";
import { createReportSchema, updateReportSchema } from "@/lib/schemas";
import { format, isValid, parseISO } from "date-fns";
import { logEventHandler } from "@/lib/fetcher";
import { LogEvent } from "@/lib/coreconstants";

// create
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ error: "Access denied" }, { status: 401 });
    }

    const session = await verifyJwt<{ id: string; role: string }>(token);

    if (!session) {
      return NextResponse.json({ error: "Access denied" }, { status: 401 });
    }

    const userId = session.id;
    const body = await req.json();
    const data = createReportSchema.parse(body);

    // Generate report_id
    const today = format(new Date(), "yyyyMMdd"); // e.g. 20251111
    const count = await prisma.report.count({});
    const report_id = `TIL-${today}-${String(count + 1).padStart(3, "0")}`;

    const report = await prisma.report.create({
      data: {
        ...data,
        report_id,
        lastUpdatedBy: { connect: { id: userId } },
      },
      select: { id: true },
    });

    // console.log(data.buyer);

    await logEventHandler(
      LogEvent.REPORT_CREATE,
      session?.id,
      `Report ID: ${report.id}`,
    );

    return NextResponse.json(
      {
        success: true,
        message: `Report created successfully`,
        report,
      },
      { status: 201 },
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// update
export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ error: "Access denied" }, { status: 401 });
    }

    const session = await verifyJwt<{ id: string; role: string }>(token);

    if (!session) {
      return NextResponse.json({ error: "Access denied" }, { status: 401 });
    }

    const userId = session.id;
    const body = await req.json();
    const data = updateReportSchema.parse(body);

    const reportExists = await prisma.report.findFirst({
      where: { OR: [{ id: data.id }, { report_id: data.report_id }] },
      select: { id: true, report_id: true },
    });

    if (!reportExists) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const report = await prisma.report.update({
      where: { id: data.id },
      data: {
        ...data,
        lastUpdatedBy: { connect: { id: userId } },
      },
      select: { id: true },
    });

    // console.log(data.buyer);

    await logEventHandler(
      LogEvent.REPORT_UPDATE,
      session?.id,
      `Report ID: ${report.id}`,
    );

    return NextResponse.json({
      success: true,
      message: `Report updated successfully`,
      report,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// Get
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
    // /api/report?from=2025-11-19&sort=dsc&limit=10
    const { searchParams } = new URL(req.url);
    const isDownload = Number(searchParams.get("isDownload") ?? 0);

    // for downloading
    if (isDownload) {
      const reports = await prisma.report.findMany({
        include: { lastUpdatedBy: { select: { username: true } } },
        orderBy: { createdAt: "desc" },
      });

      await logEventHandler(LogEvent.REPORT_DOWNLOAD, session.id);

      return NextResponse.json({ data: reports });
    }

    const fromStr = searchParams.get("from");
    const toStr = searchParams.get("to");
    const query = searchParams.get("query") ?? "";
    const sort = searchParams.get("sort") === "asc" ? "asc" : "desc"; // fallback desc
    const limit = Number(searchParams.get("limit") ?? 10);
    const offset = Number(searchParams.get("offset") ?? 0);

    const from = fromStr ? parseISO(fromStr) : null;
    const to = toStr ? parseISO(toStr) : new Date();

    const status = Number(searchParams.get("status") ?? "") || null;

    // ---- Build prisma filter ----
    const where: any = {};

    if (from && isValid(from))
      where.createdAt = { ...where.createdAt, gte: from };
    if (to && isValid(to)) where.createdAt = { ...where.createdAt, lte: to };

    if (status) where.status = status;

    if (query) {
      const orFilters: any[] = [];

      if (!isNaN(Number(query))) {
        const num = Number(query);
        orFilters.push({ order_number: num });
        orFilters.push({ batch_number: num });
      }

      orFilters.push(
        { id: { contains: query, mode: "insensitive" } },
        { buyerId: { contains: query, mode: "insensitive" } },
        { userId: { contains: query, mode: "insensitive" } },
        { report_id: { contains: query, mode: "insensitive" } },
        { color: { contains: query, mode: "insensitive" } },
        { fabric_type: { contains: query, mode: "insensitive" } },
      );

      if (orFilters.length > 0) {
        where.OR = orFilters;
      }
    }

    const total = await prisma.report.count({ where });

    // ---- Paginated data ----
    const reports = await prisma.report.findMany({
      where,
      select: {
        id: true,
        report_id: true,
        buyerId: true,
        buyer: true,
        status: true,
        result: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
      },
      orderBy: { createdAt: sort },
      take: limit,
      skip: offset,
    });

    return NextResponse.json({
      data: reports,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
