import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifyJwt } from "@/lib/auth";
import { Role } from "@prisma/client";

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

    const session = await verifyJwt<{ id: string; role: string }>(token);

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

    return NextResponse.json({
      success: true,
      message: `Buyer deleted successfully`,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
