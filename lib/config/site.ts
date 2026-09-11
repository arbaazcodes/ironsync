/**
 * IronSync Environment-Aware Site Configuration
 *
 * Dynamically resolves the application base URL and authentication callback URL across:
 * 1. Browser runtime: window.location.origin
 * 2. Explicit custom domain: process.env.NEXT_PUBLIC_SITE_URL (e.g. https://ironsync.fit)
 * 3. Vercel deployment: process.env.VERCEL_PROJECT_PRODUCTION_URL or process.env.VERCEL_URL
 * 4. Local development: http://localhost:3000
 */
export function getBasePath(): string {
  return "";
}

export function getSiteUrl(): string {
  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL.replace(/\/$/, "")}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }
  return "http://localhost:3000";
}

/**
 * Returns the canonical OAuth and authentication callback URL for this deployment.
 */
export function getAuthCallbackUrl(): string {
  return `${getSiteUrl()}/auth/callback`;
}

