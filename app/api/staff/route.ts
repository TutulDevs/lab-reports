import { registerStaffSchema, updateStaffSchema } from "@/lib/schemas";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { Role } from "@prisma/client";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifyJwt } from "@/lib/auth";

// register
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

    if (session.role == Role.STAFF) {
      return NextResponse.json(
        { error: "You are not permitted" },
        { status: 400 }
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
        { status: 404 }
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        ...data,
        role: data.role as Role,
        password: hashedPassword,
      },
      omit: { password: true },
    });

    return NextResponse.json(
      { success: true, message: `${user.username} created successfully` },
      { status: 201 }
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
        { status: 404 }
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
            role: restData.role as Role,
          }
        : {
            ...restData,
            role: restData.role as Role,
            password: hashedPassword,
          },
      select: { username: true },
    });

    return NextResponse.json({
      success: true,
      message: `${updated.username} updated successfully`,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
