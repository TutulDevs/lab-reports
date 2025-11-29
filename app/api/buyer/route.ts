import { createBuyerSchema, updateBuyerSchema } from "@/lib/schemas";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifyJwt } from "@/lib/auth";
import { logEventHandler } from "@/lib/fetcher";
import { LogEvent } from "@/lib/coreconstants";
import { isValid, parseISO } from "date-fns";

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
    const data = createBuyerSchema.parse(body);

    // find same title
    const hasBuyer = await prisma.buyer.findUnique({
      where: { title: data.title },
      select: { id: true },
    });

    if (hasBuyer) {
      return NextResponse.json(
        { error: `Buyer ${data.title} exists. Set a different title.` },
        { status: 400 },
      );
    }

    const { burstingRules, ...restData } = data;

    const buyer = await prisma.buyer.create({
      data: {
        ...restData,
        burstingRules: { create: burstingRules },
        lastUpdatedBy: { connect: { id: userId } },
      },
      select: { title: true, id: true },
    });

    await logEventHandler(
      LogEvent.BUYER_CREATE,
      session?.id,
      `Buyer ID: ${buyer.id}`,
    );

    return NextResponse.json(
      {
        success: true,
        message: `${buyer.title} created successfully`,
        buyer,
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
    const data = updateBuyerSchema.parse(body);

    // find same title
    const buyerExists = await prisma.buyer.findUnique({
      where: { id: data.id },
      select: { id: true, title: true },
    });

    if (!buyerExists) {
      return NextResponse.json({ error: "Buyer not found" }, { status: 404 });
    }

    const existingBuyer = await prisma.buyer.findUnique({
      where: { title: data.title },
      select: { title: true },
    });

    if (data.title != buyerExists.title && existingBuyer) {
      return NextResponse.json(
        { error: "Buyer title already exists. Set a new title." },
        { status: 404 },
      );
    }

    const { id, burstingRules, ...restData } = data;

    const buyer = await prisma.buyer.update({
      where: { id: data.id },
      data: {
        ...restData,
        burstingRules: {
          deleteMany: {},
          create: burstingRules,
        },
        lastUpdatedBy: { connect: { id: userId } },
      },
      select: { title: true, id: true },
    });

    await logEventHandler(
      LogEvent.BUYER_UPDATE,
      session?.id,
      `Buyer ID: ${buyer.id}`,
    );

    return NextResponse.json({
      success: true,
      message: `${buyer.title} updated successfully`,
      buyer,
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
    // /api/buyer?from=2025-11-19&sort=dsc&limit=10
    const { searchParams } = new URL(req.url);
    const isDownload = Number(searchParams.get("isDownload") ?? 0);

    // for downloading
    if (isDownload) {
      const buyers = await prisma.buyer.findMany({
        include: {
          lastUpdatedBy: { select: { username: true } },
          burstingRules: { select: { gsm: true, bursting_strength_kpa: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      await logEventHandler(LogEvent.BUYER_DOWNLOAD, session.id);

      return NextResponse.json({ data: buyers });
    }

    const fromStr = searchParams.get("from");
    const toStr = searchParams.get("to");
    const query = searchParams.get("query") ?? "";
    const sort = searchParams.get("sort") === "asc" ? "asc" : "desc"; // fallback desc
    const limit = Number(searchParams.get("limit") ?? 10);
    const offset = Number(searchParams.get("offset") ?? 0);

    const from = fromStr ? parseISO(fromStr) : null;
    const to = toStr ? parseISO(toStr) : new Date();

    const userId = searchParams.get("userId") ?? "";

    // ---- Build prisma filter ----
    const where: any = {};

    if (from && isValid(from))
      where.createdAt = { ...where.createdAt, gte: from };
    if (to && isValid(to)) where.createdAt = { ...where.createdAt, lte: to };

    if (userId) where.userId = userId;

    if (query) {
      where.OR = [
        { id: { contains: query, mode: "insensitive" } },
        { title: { contains: query, mode: "insensitive" } },
        { userId: { contains: query, mode: "insensitive" } },
      ];
    }

    const total = await prisma.buyer.count({ where });

    // ---- Paginated data ----
    const buyers = await prisma.buyer.findMany({
      where,
      select: {
        id: true,
        title: true,
        updatedAt: true,
        userId: true,
        lastUpdatedBy: { select: { username: true } },
      },
      orderBy: { createdAt: sort },
      take: limit,
      skip: offset,
    });

    return NextResponse.json({
      data: buyers,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error fetching buyers:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
