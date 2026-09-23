/**
 * In-memory brute-force protection and lockout tracker for Member login.
 * Tracks failed attempts per Member ID using Map<string, { count: number; expiresAt: number }>.
 * Zero external dependencies. Strictly typed without `any`.
 */

export interface RateLimitEntry {
  count: number;
  expiresAt: number;
}

const MAX_FAILED_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15-minute evaluation & lockout window

const rateLimitStore = new Map<string, RateLimitEntry>();

function cleanupStore(now: number): void {
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.expiresAt <= now) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Checks if a Member ID is currently locked out.
 * Returns true if the ID has 5 or more failed attempts and the lockout window has not expired.
 */
export function isMemberLocked(memberId: string): boolean {
  const key = memberId.trim().toUpperCase();
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry) {
    return false;
  }

  if (entry.expiresAt <= now) {
    rateLimitStore.delete(key);
    return false;
  }

  return entry.count >= MAX_FAILED_ATTEMPTS;
}

/**
 * Records a failed login attempt for a Member ID.
 * Sets or increments the failure count. When reaching 5 failed attempts,
 * extends the lockout expiration to 15 minutes from the 5th failure.
 */
export function recordFailedAttempt(memberId: string): void {
  const key = memberId.trim().toUpperCase();
  const now = Date.now();
  cleanupStore(now);

  const entry = rateLimitStore.get(key);

  if (!entry || entry.expiresAt <= now) {
    rateLimitStore.set(key, {
      count: 1,
      expiresAt: now + WINDOW_MS,
    });
    return;
  }

  entry.count += 1;
  if (entry.count >= MAX_FAILED_ATTEMPTS) {
    entry.expiresAt = now + WINDOW_MS;
  }
}

/**
 * Clears the rate limit entry for a Member ID upon successful PIN authentication.
 */
export function clearRateLimit(memberId: string): void {
  const key = memberId.trim().toUpperCase();
  rateLimitStore.delete(key);
}

/**
 * Resets the in-memory rate limit store (for test suites and verification).
 */
export function resetRateLimitStore(): void {
  rateLimitStore.clear();
}
