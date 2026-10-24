import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const fromParam = req.nextUrl.searchParams.get("from");
  const targetPath =
    fromParam && fromParam.startsWith("/") && !fromParam.startsWith("//")
      ? fromParam
      : "/login";

  const redirectUrl = new URL(targetPath, req.url);
  const response = NextResponse.redirect(redirectUrl, { status: 302 });

  response.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return response;
}
