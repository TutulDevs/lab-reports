import { registerStaffSchema, updateStaffSchema } from "@/lib/schemas";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifyJwt } from "@/lib/auth";
import { LogEvent, Role } from "@/lib/coreconstants";
import { logEventHandler } from "@/lib/fetcher";
import { isValid, parseISO } from "date-fns";

// register
export async function POST(req: Request) {
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

    if (session.role == Role.STAFF) {
      return NextResponse.json(
        { error: "You are not permitted" },
        { status: 400 },
      );
    }

    const body = await req.json();
    const data = registerStaffSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { username: data.username },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 404 },
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        ...data,
        role: data.role,
        password: hashedPassword,
      },
      omit: { password: true },
    });

    await logEventHandler(
      LogEvent.STAFF_CREATE,
      session?.id,
      `Staff ID: ${user.id}`,
    );

    return NextResponse.json(
      { success: true, message: `${user.username} created successfully` },
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

    const session = await verifyJwt<{ id: string; role: number }>(token);

    if (!session) {
      return NextResponse.json({ error: "Access denied" }, { status: 401 });
    }

    const body = await req.json();
    const data = updateStaffSchema.parse(body);

    // const { id, username, password, ...rest } = data;

    const user = await prisma.user.findUnique({
      where: { id: data.id },
      select: { id: true, username: true },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { username: data.username },
      select: { username: true },
    });

    if (data.username != user.username && existingUser) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 404 },
      );
    }

    const { password, ...restData } = data;

    let hashedPassword = password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updated = await prisma.user.update({
      where: { id: data.id },
      data: !password
        ? {
            ...restData,
            role: restData.role,
          }
        : {
            ...restData,
            role: restData.role,
            password: hashedPassword,
          },
      select: { username: true },
    });

    await logEventHandler(
      LogEvent.STAFF_UPDATE,
      session?.id,
      `Staff ID: ${user.id}`,
    );

    return NextResponse.json({
      success: true,
      message: `${updated.username} updated successfully`,
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
    // /api/staff?from=2025-11-19&sort=dsc&limit=10
    const { searchParams } = new URL(req.url);
    const isDownload = Number(searchParams.get("isDownload") ?? 0);

    // for downloading
    if (isDownload) {
      const users = await prisma.user.findMany({
        omit: { password: true },
        orderBy: { createdAt: "desc" },
      });

      await logEventHandler(LogEvent.STAFF_DOWNLOAD, session.id);

      return NextResponse.json({ data: users });
    }

    const fromStr = searchParams.get("from");
    const toStr = searchParams.get("to");
    const query = searchParams.get("query") ?? "";
    const sort = searchParams.get("sort") === "asc" ? "asc" : "desc"; // fallback desc
    const limit = Number(searchParams.get("limit") ?? 10);
    const offset = Number(searchParams.get("offset") ?? 0);

    const from = fromStr ? parseISO(fromStr) : null;
    const to = toStr ? parseISO(toStr) : new Date();

    const role = searchParams.get("role") ?? "";
    const status = Number(searchParams.get("status") ?? "") || null;

    // ---- Build prisma filter ----
    const where: any = {};

    if (from && isValid(from))
      where.createdAt = { ...where.createdAt, gte: from };
    if (to && isValid(to)) where.createdAt = { ...where.createdAt, lte: to };

    if (role) where.role = role;
    if (status) where.status = status;

    if (query) {
      where.OR = [
        { id: { contains: query, mode: "insensitive" } },
        { username: { contains: query, mode: "insensitive" } },
        { fullname: { contains: query, mode: "insensitive" } },
        { designation: { contains: query, mode: "insensitive" } },
        { phone: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
      ];
    }

    const total = await prisma.user.count({ where });

    // ---- Paginated data ----
    const users = await prisma.user.findMany({
      where,
      omit: { password: true },
      orderBy: { createdAt: sort },
      take: limit,
      skip: offset,
    });

    return NextResponse.json({
      data: users,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
