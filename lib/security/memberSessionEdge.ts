import type { MemberSessionPayload } from "../types/member";

/**
 * Timing-safe Web Crypto HMAC-SHA256 session verifier compatible with Next.js Edge Runtime.
 * Verifies that the ironsync_member_session cookie signature was signed with MEMBER_SESSION_SECRET,
 * is not expired, and contains valid member identity fields.
 *
 * Returns MemberSessionPayload on success, or null on any tampering / expiry / invalidity.
 */
export async function verifyMemberSessionTokenEdge(
  token?: string | null
): Promise<MemberSessionPayload | null> {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payloadEncoded, signature] = parts;
  if (!payloadEncoded || !signature) return null;

  // Resolve secret key
  const secret = process.env.MEMBER_SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      // In production, reject all sessions if secret is missing
      return null;
    }
  }
  const effectiveSecret =
    secret ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "ironsync-gym-platform-member-secret-salt-2026";

  try {
    // 1. Decode base64url signature to raw bytes
    const base64Sig = signature.replace(/-/g, "+").replace(/_/g, "/");
    const padSig = (4 - (base64Sig.length % 4)) % 4;
    const paddedSig = base64Sig + "=".repeat(padSig);
    const binarySig = atob(paddedSig);
    const sigBytes = new Uint8Array(binarySig.length);
    for (let i = 0; i < binarySig.length; i++) {
      sigBytes[i] = binarySig.charCodeAt(i);
    }

    // 2. Import secret into Web Crypto HMAC
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(effectiveSecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    // 3. Cryptographically verify signature against payload string
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes,
      encoder.encode(payloadEncoded)
    );

    if (!isValid) {
      return null;
    }

    // 4. Decode base64url payload
    const base64Payload = payloadEncoded.replace(/-/g, "+").replace(/_/g, "/");
    const padPayload = (4 - (base64Payload.length % 4)) % 4;
    const paddedPayload = base64Payload + "=".repeat(padPayload);
    const binaryPayload = atob(paddedPayload);
    const payloadBytes = new Uint8Array(binaryPayload.length);
    for (let i = 0; i < binaryPayload.length; i++) {
      payloadBytes[i] = binaryPayload.charCodeAt(i);
    }
    const jsonStr = new TextDecoder().decode(payloadBytes);
    const payload = JSON.parse(jsonStr) as MemberSessionPayload;

    // 5. Check expiration timestamp
    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) {
      return null;
    }

    // 6. Check required identity fields
    if (!payload.id || !payload.memberId || !payload.fullName) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
