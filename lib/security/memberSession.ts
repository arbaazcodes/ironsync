import crypto from "crypto";
import { MemberSessionPayload, MemberStatus } from "../types/member";

export const MEMBER_COOKIE_NAME = "ironsync_member_session";
const SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60; // 7 days

function getSecretKey(): string {
  const secret = process.env.MEMBER_SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "CRITICAL SECURITY CONFIGURATION ERROR: MEMBER_SESSION_SECRET environment variable is missing in production. " +
        "Please configure MEMBER_SESSION_SECRET in your production deployment settings."
      );
    }
    return (
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      "ironsync-gym-platform-member-secret-salt-2026"
    );
  }
  return secret;
}

/**
 * Creates an HMAC-SHA256 signed, base64url-encoded session token for an authenticated gym member.
 */
export function createMemberSessionToken(payload: Omit<MemberSessionPayload, "exp">): string {
  const secret = getSecretKey();
  const exp = Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS;

  const fullPayload: MemberSessionPayload = {
    ...payload,
    exp,
  };

  const payloadEncoded = Buffer.from(JSON.stringify(fullPayload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(payloadEncoded)
    .digest("base64url");

  return `${payloadEncoded}.${signature}`;
}

/**
 * Verifies and decodes a member session token. Returns null if invalid or expired.
 */
export function verifyMemberSessionToken(token: string): MemberSessionPayload | null {
  try {
    if (!token || typeof token !== "string") return null;

    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [payloadEncoded, signature] = parts;
    const secret = getSecretKey();

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(payloadEncoded)
      .digest("base64url");

    const expectedBuffer = Buffer.from(expectedSignature);
    const actualBuffer = Buffer.from(signature);

    if (expectedBuffer.length !== actualBuffer.length) {
      return null;
    }

    if (!crypto.timingSafeEqual(expectedBuffer, actualBuffer)) {
      return null;
    }

    const payloadJson = Buffer.from(payloadEncoded, "base64url").toString("utf8");
    const payload = JSON.parse(payloadJson) as MemberSessionPayload;

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null;
    }

    // Check minimum required fields
    if (!payload.id || !payload.memberId || !payload.fullName) {
      return null;
    }

    return payload;
  } catch (err) {
    return null;
  }
}

/**
 * Standard cookie options for setting the member session cookie.
 */
export function getMemberCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  };
}
