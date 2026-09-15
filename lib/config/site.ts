/**
 * IronSync Environment-Aware Site Configuration
 *
 * Canonical Production Domain: https://ironsync.online (and www.ironsync.online)
 * Backup Production Domain: https://ironsync-peach.vercel.app
 * Support Email: support@ironsync.online
 */
export const CANONICAL_SITE_URL = "https://ironsync.online";
export const BACKUP_SITE_URL = "https://ironsync-peach.vercel.app";
export const DEFAULT_PRODUCTION_SITE_URL = CANONICAL_SITE_URL;
export const SUPPORT_EMAIL = "support@ironsync.online";

export const siteConfig = {
  name: "IronSync",
  description:
    "Algorithmic fitness blueprints tailored to your schedule, body metrics, gym equipment, and food preferences.",
  url: CANONICAL_SITE_URL,
  supportEmail: SUPPORT_EMAIL,
  links: {
    canonical: CANONICAL_SITE_URL,
    backup: BACKUP_SITE_URL,
  },
};

export function getBasePath(): string {
  return "";
}

export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    const configured = process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
    if (configured.includes("ironsync.vercel.app") && !configured.includes("ironsync-peach")) {
      return CANONICAL_SITE_URL;
    }
    return configured;
  }
  if (typeof window !== "undefined" && window.location.origin) {
    const origin = window.location.origin;
    if (origin.includes("ironsync.vercel.app") && !origin.includes("ironsync-peach")) {
      return CANONICAL_SITE_URL;
    }
    return origin;
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL.replace(/\/$/, "");
    if (vercelUrl.includes("ironsync.vercel.app") && !vercelUrl.includes("ironsync-peach")) {
      return CANONICAL_SITE_URL;
    }
    return `https://${vercelUrl}`;
  }
  if (process.env.VERCEL_URL) {
    const vercelUrl = process.env.VERCEL_URL.replace(/\/$/, "");
    if (vercelUrl.includes("ironsync.vercel.app") && !vercelUrl.includes("ironsync-peach")) {
      return CANONICAL_SITE_URL;
    }
    return `https://${vercelUrl}`;
  }
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }
  return CANONICAL_SITE_URL;
}

/**
 * Returns the canonical OAuth and authentication callback URL for this deployment.
 */
export function getAuthCallbackUrl(): string {
  return `${getSiteUrl()}/auth/callback`;
}
