import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  
  const consent = request.cookies.get("cookieConsent")?.value;
  if (consent !== "accepted") {
    return response;
  }

 
  if (request.cookies.get("visitorId")) {
    return response;
  }

 
  const newVisitorId = nanoid(16);

  response.cookies.set("visitorId", newVisitorId, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365, 
    path: "/",
  });

  return response;
}

export const config = {
  
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};