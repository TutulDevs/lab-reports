import { COOKIE_NAME, verifyJwt } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const session = token ? await verifyJwt<{ role: string }>(token) : null;
  const { pathname } = req.nextUrl;

  // console.log("MW:", { token, session });

  const protectedRoutes = [
    "/dashboard",
    "/staffs",
    "/buyers",
    "/settings",
    "/reports",
  ];

  if (!session && protectedRoutes.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (session && pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/staffs/:path*",
    "/buyers/:path*",
    "/reports/:path*",
    "/login",
    "/settings",
  ],
};
