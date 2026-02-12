import { auth } from "@hackhyre/db/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/onboarding", "/messages", "/applications"];
const authRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
  const isAuthRoute = authRoutes.some((route) => pathname === route);

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding",
    "/messages/:path*",
    "/applications/:path*",
    "/sign-in",
    "/sign-up",
  ],
};
