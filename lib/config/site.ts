/**
 * IronSync Environment-Aware Site Configuration
 *
 * Dynamically resolves the application base URL and authentication callback URL across:
 * 1. Browser runtime: window.location.origin
 * 2. Explicit site URL: process.env.NEXT_PUBLIC_SITE_URL (canonical: https://ironsync-peach.vercel.app)
 * 3. Vercel deployment: process.env.NEXT_PUBLIC_VERCEL_URL or process.env.VERCEL_URL
 * 4. Local development: http://localhost:3000
 */
export const DEFAULT_PRODUCTION_SITE_URL = "https://ironsync-peach.vercel.app";

export function getBasePath(): string {
  return "";
}

export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    const configured = process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
    if (configured.includes("ironsync.vercel.app") && !configured.includes("ironsync-peach")) {
      return DEFAULT_PRODUCTION_SITE_URL;
    }
    return configured;
  }
  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL.replace(/\/$/, "")}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }
  return DEFAULT_PRODUCTION_SITE_URL;
}

/**
 * Returns the canonical OAuth and authentication callback URL for this deployment.
 */
export function getAuthCallbackUrl(): string {
  return `${getSiteUrl()}/auth/callback`;
}
