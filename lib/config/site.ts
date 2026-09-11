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
  const isProduction = process.env.NODE_ENV === "production";
  return process.env.NEXT_PUBLIC_BASE_PATH ?? (isProduction ? "/ironsync" : "");
}

export function getSiteUrl(): string {
  const basePath = getBasePath();
  if (typeof window !== "undefined" && window.location.origin) {
    return `${window.location.origin}${basePath}`;
  }
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return `${process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")}${basePath}`;
  }
  return `https://arbaazcodes.github.io/ironsync`;
}

/**
 * Returns the canonical OAuth and authentication callback URL for this deployment.
 */
export function getAuthCallbackUrl(): string {
  return `${getSiteUrl()}/auth/callback`;
}

