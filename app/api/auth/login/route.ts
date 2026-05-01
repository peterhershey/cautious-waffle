import { NextResponse, type NextRequest } from "next/server";
import {
  COOKIE_NAME,
  expectedToken,
  safeNextPath,
  verifyPassword,
} from "@/lib/auth";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const password = String(form.get("password") ?? "");
  const next = safeNextPath(String(form.get("next") ?? "/"));

  if (!(await verifyPassword(password))) {
    const failUrl = new URL("/login", request.url);
    failUrl.searchParams.set("err", "1");
    if (next !== "/") failUrl.searchParams.set("next", next);
    return NextResponse.redirect(failUrl, 303);
  }

  const token = await expectedToken();
  const successUrl = new URL(next, request.url);
  const res = NextResponse.redirect(successUrl, 303);
  res.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return res;
}
