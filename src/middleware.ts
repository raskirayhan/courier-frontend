import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function parseJwtPayload(token: string) {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;
  const cookieRole = request.cookies.get("userRole")?.value;

  let role = cookieRole;
  if (token && !role) {
    const payload = parseJwtPayload(token);
    if (payload?.role) {
      role = payload.role;
    }
  }

  const isAuthenticated = Boolean(token);

  // If user is already authenticated and visits /login or /register, redirect to dashboard
  if (isAuthenticated && (pathname === "/login" || pathname === "/register")) {
    if (role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    if (role === "COURIER") {
      return NextResponse.redirect(new URL("/courier", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (role !== "ADMIN") {
      // Unauthorized for admin portal
      if (role === "COURIER") {
        return NextResponse.redirect(new URL("/courier", request.url));
      }
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Protect /courier routes
  if (pathname.startsWith("/courier")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (role !== "COURIER" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Protect /dashboard routes (Customer)
  if (pathname.startsWith("/dashboard")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/courier/:path*",
    "/dashboard/:path*",
    "/login",
    "/register",
  ],
};
