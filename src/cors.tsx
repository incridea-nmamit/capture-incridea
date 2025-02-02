import { NextRequest, NextResponse } from "next/server";

export function cors(req: NextRequest) {
  const res = NextResponse.next();
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200 });
  }

  return res;
}

export const config = {
  matcher: "/api/:path*",
};