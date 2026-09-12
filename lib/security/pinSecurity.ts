import crypto from "crypto";

/**
 * Validates that a string is a valid 4-digit numeric PIN.
 */
export function isValidPin(pin: string): boolean {
  return /^\d{4}$/.test(pin.trim());
}

/**
 * Securely hashes a 4-digit PIN using scrypt with a unique 16-byte cryptographic salt.
 * Format returned: "salt:hash"
 * NEVER store plaintext PINs in the database.
 */
export function hashPin(pin: string): string {
  const trimmed = pin.trim();
  if (!isValidPin(trimmed)) {
    throw new Error("PIN must be exactly 4 digits.");
  }

  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(trimmed, salt, 64);
  const hash = derivedKey.toString("hex");

  return `${salt}:${hash}`;
}

/**
 * Constant-time verification of a plaintext PIN against the stored "salt:hash".
 * Returns true if valid, false otherwise. Protects against timing attacks.
 */
export function verifyPin(pin: string, storedPinHash: string): boolean {
  try {
    if (!pin || !storedPinHash) return false;
    const parts = storedPinHash.split(":");
    if (parts.length !== 2) return false;

    const [salt, expectedHash] = parts;
    if (!salt || !expectedHash) return false;

    const derivedKey = crypto.scryptSync(pin.trim(), salt, 64);
    const actualHash = derivedKey.toString("hex");

    const expectedBuffer = Buffer.from(expectedHash, "hex");
    const actualBuffer = Buffer.from(actualHash, "hex");

    if (expectedBuffer.length !== actualBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
  } catch (err) {
    console.error("PIN verification error:", err);
    return false;
  }
}

/**
 * Generates a random 4-digit numeric PIN (1000 - 9999).
 */
export function generateRandomPin(): string {
  return crypto.randomInt(1000, 10000).toString();
}

/**
 * Formats a sequence number into the official IronSync Member ID format: "IS-2026-0001".
 */
export function formatMemberId(sequenceNumber: number, year: number = 2026): string {
  const padded = String(Math.max(1, sequenceNumber)).padStart(4, "0");
  return `IS-${year}-${padded}`;
}

/**
 * Parses the numeric sequence from a member ID (e.g. "IS-2026-0042" -> 42).
 */
export function parseMemberIdSequence(memberId: string): number | null {
  const match = memberId.match(/^IS-\d{4}-(\d+)$/i);
  if (!match || !match[1]) return null;
  const num = parseInt(match[1], 10);
  return isNaN(num) ? null : num;
}
