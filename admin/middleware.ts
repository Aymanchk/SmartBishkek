import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isAuth = request.cookies.has("sb_auth");

  // Allow access to login page
  if (request.nextUrl.pathname.startsWith("/login")) {
    if (isAuth) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Protect all other routes
  if (!isAuth && !request.nextUrl.pathname.startsWith("/_next") && !request.nextUrl.pathname.startsWith("/api") && !request.nextUrl.pathname.match(/\.(png|jpg|jpeg|gif|svg|ico)$/)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
