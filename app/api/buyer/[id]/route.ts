import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifyJwt } from "@/lib/auth";
import { LogEvent, Role } from "@/lib/coreconstants";
import { logEventHandler } from "@/lib/fetcher";

// get details
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
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

    const { id } = await context.params;

    const buyer = await prisma.buyer.findUnique({
      where: { id },
      include: {
        burstingRules: { select: { gsm: true, bursting_strength_kpa: true } },
      },
    });

    if (!buyer) {
      return NextResponse.json({ error: "Buyer not found" }, { status: 404 });
    }

    return NextResponse.json(buyer);
  } catch (error) {
    console.error("Error fetching buyer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// delete
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
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
        { error: "Staff is not permitted" },
        { status: 400 },
      );
    }

    const { id } = await context.params;

    const buyer = await prisma.buyer.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!buyer) {
      return NextResponse.json({ error: "Buyer not found" }, { status: 404 });
    }

    await prisma.buyer.delete({
      where: { id },
    });

    await logEventHandler(
      LogEvent.BUYER_DELETE,
      session?.id,
      `Buyer ID: ${buyer.id}`,
    );

    return NextResponse.json({
      success: true,
      message: `Buyer deleted successfully`,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
