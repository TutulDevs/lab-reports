import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { loginSchema } from "@/lib/schemas";
import { COOKIE_NAME, MAX_AGE, signJwt } from "@/lib/auth";
import { logEventHandler } from "@/lib/fetcher";
import { LogEvent } from "@/lib/coreconstants";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = loginSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const token = await signJwt({ id: user.id, role: user.role });

    const res = NextResponse.json({
      success: true,
      message: "Login successful",
      user,
    });

    res.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: MAX_AGE,
    });

    await logEventHandler(LogEvent.LOGIN, user?.id);

    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
