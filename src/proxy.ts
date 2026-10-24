import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "formflow-super-secret-jwt-key-2026-production-ready"
);

const COOKIE_NAME = "formflow_session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  let isAuthenticated = false;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      if (payload && payload.userId) {
        isAuthenticated = true;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  // 1. Protected Dashboard Pages: /dashboard and any subroute
  if (pathname.startsWith("/dashboard")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      const response = NextResponse.redirect(loginUrl);
      if (token) {
        response.cookies.set({
          name: COOKIE_NAME,
          value: "",
          expires: new Date(0),
          path: "/",
        });
      }
      return response;
    }
  }

  // 2. Protected Internal API Endpoints: /api/forms
  if (pathname.startsWith("/api/forms")) {
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // 3. Guest-only Auth Pages: /login, /register
  // If user is already authenticated, redirect straight to /dashboard
  if ((pathname === "/login" || pathname === "/register") && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/forms/:path*",
    "/login",
    "/register",
  ],
};
