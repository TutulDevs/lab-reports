import { createBuyerSchema, updateBuyerSchema } from "@/lib/schemas";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifyJwt } from "@/lib/auth";

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
        { status: 400 }
      );
    }

    const buyer = await prisma.buyer.create({
      data: { ...data, userId: userId },
      select: { title: true, id: true },
    });

    return NextResponse.json(
      {
        success: true,
        message: `${buyer.title} created successfully`,
        buyer,
      },
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
        { status: 404 }
      );
    }

    const { id, ...restData } = data;

    const buyer = await prisma.buyer.update({
      where: { id: data.id },
      data: { ...restData, userId: userId },
      select: { title: true, id: true },
    });

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
