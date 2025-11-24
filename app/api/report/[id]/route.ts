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

    const report = await prisma.report.findFirst({
      where: { OR: [{ id: id }, { report_id: id }] },
      include: { lastUpdatedBy: { select: { username: true } } },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error("Error fetching report:", error);
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

    const report = await prisma.report.findFirst({
      where: { OR: [{ id: id }, { report_id: id }] },
      select: { id: true },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    await prisma.report.delete({
      where: { id: report.id },
    });

    await logEventHandler(
      LogEvent.REPORT_DELETE,
      session?.id,
      `Report ID: ${report.id}`,
    );

    return NextResponse.json({
      success: true,
      message: `Report deleted successfully`,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
