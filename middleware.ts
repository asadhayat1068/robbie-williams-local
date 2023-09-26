import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "./lib/helpers/web3AuthManager";

export async function middleware(request: NextRequest, response: NextResponse) {
  const headers = new Headers(request.headers);
  const auth = headers.get("authorization") || "";
  const authResponse = await verifyJWT(auth);
  if (!authResponse.success) {
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "authentication failed",
      }),
      { status: 401, headers: { "content-type": "application/json" } }
    );
  }
  const user = authResponse.data;
  // request.locals.user = user;
  headers.set("auth-user", JSON.stringify(user));
  const _response = NextResponse.next({
    request: {
      headers,
    },
  });
  return _response;
}

export const config = {
  matcher: "/api/user/:path*",
};
