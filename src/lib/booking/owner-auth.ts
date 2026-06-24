import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { serverEnv } from "@/config/env";

// Gates the owner booking-management actions behind a shared password the
// customer never sees. With the WhatsApp-link flow the customer composes the
// message that carries the /owner/<token> link, so token possession alone
// can't be the gate — confirm/deny additionally requires this password.

const COOKIE_NAME = "lm_owner";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

/** Cookie value: an HMAC keyed by the password, so it can't be forged. */
function cookieTokenFor(password: string): string {
  return createHmac("sha256", password).update("owner-portal-v1").digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

/** True only when an owner password has been configured. */
export function ownerPortalConfigured(): boolean {
  return Boolean(serverEnv.OWNER_PORTAL_PASSWORD);
}

/** True when the current request carries a valid owner session cookie. */
export async function isOwnerAuthed(): Promise<boolean> {
  const password = serverEnv.OWNER_PORTAL_PASSWORD;
  if (!password) return false;
  const store = await cookies();
  const value = store.get(COOKIE_NAME)?.value;
  if (!value) return false;
  return safeEqual(value, cookieTokenFor(password));
}

/**
 * Verify the password and, on success, set the owner session cookie.
 * Must be called from a Server Action / Route Handler (it mutates cookies).
 */
export async function signInOwner(password: string): Promise<boolean> {
  const expected = serverEnv.OWNER_PORTAL_PASSWORD;
  if (!expected) return false;
  if (!safeEqual(password, expected)) return false;

  const store = await cookies();
  store.set(COOKIE_NAME, cookieTokenFor(expected), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/owner",
    maxAge: MAX_AGE_SECONDS,
  });
  return true;
}
