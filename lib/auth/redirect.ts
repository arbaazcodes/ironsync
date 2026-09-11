/**
 * IronSync Safe Redirect Validation
 *
 * Validates that a redirect target is a safe relative path belonging strictly to the application origin.
 * Defends against open redirect attacks via protocol-relative URLs (//evil.com), backslash evasion, or external hosts.
 */
export function validateSafeRedirect(next: string | null, origin: string): string {
  const fallback = `${origin}/dashboard`;
  if (!next || typeof next !== "string") {
    return fallback;
  }

  // Strictly disallow absolute external URLs, protocol-relative (//), or backslash evasions
  if (!next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\") || next.includes("\\")) {
    return fallback;
  }

  try {
    const targetUrl = new URL(next, origin);
    if (targetUrl.origin === origin) {
      return targetUrl.toString();
    }
  } catch {
    return fallback;
  }

  return fallback;
}
