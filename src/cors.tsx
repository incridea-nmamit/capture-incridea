import { NextRequest, NextResponse } from "next/server";

export function cors(req: NextRequest) {
  const res = NextResponse.next();

  res.headers.set("Access-Control-Allow-Credentials", "true");
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", 'GET,DELETE,PATCH,POST,PUT, OPTIONS');
  res.headers.set("Access-Control-Allow-Headers", 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  console.log("HELLLLLOOOO OMAKRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR", req.url, req.method, req.nextUrl, JSON.stringify(req.formData, null, 2))

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200 });
  }

  return res;
}

export const config = {
  matcher: "/api/:path*",
};
