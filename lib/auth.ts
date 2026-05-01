/* Shared HMAC-based auth primitives for the password gate.
 *
 * The cookie value is HMAC-SHA256(SITE_PASSWORD, COOKIE_MARKER). When the
 * env var is rotated, the expected token changes and every issued cookie is
 * invalidated automatically — no server-side session store needed.
 */

export const COOKIE_NAME = "wpd_auth";
const COOKIE_MARKER = "wpd_auth_v1";

function getSecret(): string {
  const secret = process.env.SITE_PASSWORD;
  if (!secret) throw new Error("SITE_PASSWORD env var is not set");
  return secret;
}

async function hmac(secret: string, msg: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(msg),
  );
  return Buffer.from(sig).toString("base64url");
}

export async function expectedToken(): Promise<string> {
  return hmac(getSecret(), COOKIE_MARKER);
}

export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function verifyCookie(value: string | undefined): Promise<boolean> {
  if (!value) return false;
  try {
    const expected = await expectedToken();
    return timingSafeEqual(value, expected);
  } catch {
    return false;
  }
}

export async function verifyPassword(submitted: string): Promise<boolean> {
  try {
    return timingSafeEqual(submitted, getSecret());
  } catch {
    return false;
  }
}

/** Validate a user-supplied `next` redirect target — same-origin paths only. */
export function safeNextPath(next: string | null | undefined): string {
  if (!next) return "/";
  if (!next.startsWith("/") || next.startsWith("//")) return "/";
  return next;
}
