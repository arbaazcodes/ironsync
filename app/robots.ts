import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/admin", "/member", "/dashboard", "/auth", "/login", "/mobile", "/onboarding"] }, sitemap: "https://www.ironsync.online/sitemap.xml" };
}
