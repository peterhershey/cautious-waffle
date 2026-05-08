import { NextResponse, type NextRequest } from "next/server";

/* The site is publicly reachable now — homepage and case-study landings
 * are open. The case-study pages soft-paywall their full content
 * server-side via the wpd_auth cookie (see app/case-studies/[id]/page.tsx).
 * This proxy only stamps the noindex header so search engines don't
 * surface the portfolio while it's still under wraps. */
export function proxy(_request: NextRequest) {
  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = {
  matcher: [
    /* Skip Next internals and static assets. */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|mp4|mov|webm|m4v|woff2?|ttf|otf|css|js|ico|txt|xml|json)).*)",
  ],
};
