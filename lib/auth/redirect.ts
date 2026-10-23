export function safeRedirectPath(next: string | null, fallback = "/dashboard/workout"): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return fallback;
  try {
    const decoded = decodeURIComponent(next);
    if (/[\\\x00-\x20]/.test(decoded) || decoded.startsWith("//")) return fallback;
    const url = new URL(next, "https://ironsync.invalid");
    if (url.origin !== "https://ironsync.invalid") return fallback;
    return url.pathname + url.search + url.hash;
  } catch { return fallback; }
}
export function validateSafeRedirect(next: string | null, origin: string): string {
  return new URL(safeRedirectPath(next), origin).toString();
}
