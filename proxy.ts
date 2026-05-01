import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_NAME, verifyCookie } from "@/lib/auth";

const ROBOTS_HEADER = "noindex, nofollow";

export async function proxy(request: NextRequest) {
  const cookie = request.cookies.get(COOKIE_NAME)?.value;
  const ok = await verifyCookie(cookie);

  if (ok) {
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", ROBOTS_HEADER);
    return res;
  }

  const next =
    request.nextUrl.pathname + (request.nextUrl.search ?? "");
  const loginUrl = new URL("/login", request.url);
  if (next && next !== "/") loginUrl.searchParams.set("next", next);
  const res = NextResponse.redirect(loginUrl, 307);
  res.headers.set("X-Robots-Tag", ROBOTS_HEADER);
  return res;
}

export const config = {
  matcher: [
    /* Gate everything except: the login page, the auth API, Next internals,
     * and static assets. */
    "/((?!login|api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|mp4|mov|webm|m4v|woff2?|ttf|otf|css|js|ico|txt|xml|json)).*)",
  ],
};
