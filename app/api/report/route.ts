import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifyJwt } from "@/lib/auth";
import { createReportSchema, updateReportSchema } from "@/lib/schemas";
import { format } from "date-fns";
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
