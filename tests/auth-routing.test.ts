import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "@/app/auth/callback/route";
import { middleware } from "@/middleware";
import { createServerClient } from "@supabase/ssr";
vi.mock("@supabase/ssr", () => ({ createServerClient: vi.fn() }));
beforeEach(() => {
  vi.clearAllMocks();
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_test";
});
describe("public authentication routing", () => {
  it("carries session cookies through callback and ignores injected hosts/external destinations", async () => {
    vi.mocked(createServerClient).mockImplementation((_url, _key, options: any) => ({
      auth: { exchangeCodeForSession: async () => {
        options.cookies.setAll([{ name: "session-test", value: "cookie", options: { httpOnly: true, path: "/" } }]);
        return { data: { user: { id: "a" } }, error: null };
      } },
    } as never));
    const response = await GET(new NextRequest("https://app.test/auth/callback?code=valid&next=//evil.test", { headers: { "x-forwarded-host": "evil.test" } }));
    expect(response.headers.get("location")).toBe("https://app.test/dashboard");
    expect(response.cookies.get("session-test")?.value).toBe("cookie");
    expect(response.headers.get("cache-control")).toBe("no-store");
  });
  it("supports email recovery token verification without a same-browser PKCE verifier", async () => {
    const verify = vi.fn().mockResolvedValue({ data: { user: { id: "a" } }, error: null });
    vi.mocked(createServerClient).mockReturnValue({ auth: { verifyOtp: verify } } as never);
    const response = await GET(new NextRequest("https://app.test/auth/callback?token_hash=hash&type=recovery"));
    expect(verify).toHaveBeenCalledWith({ token_hash: "hash", type: "recovery" });
    expect(response.headers.get("location")).toBe("https://app.test/auth/update-password");
  });
  it("returns failed confirmations to the public sign-in page", async () => {
    vi.mocked(createServerClient).mockReturnValue({ auth: { exchangeCodeForSession: async () => ({ error: { message: "Expired" } }) } } as never);
    expect((await GET(new NextRequest("https://app.test/auth/callback?code=expired"))).headers.get("location")).toContain("/auth?mode=signin&error=confirmation_failed");
  });
  it("allows a verified consumer into workouts while denying admin access on lookup failure", async () => {
    const query = { select: () => query, eq: () => query, maybeSingle: async () => ({ data: null, error: { message: "missing" } }) };
    vi.mocked(createServerClient).mockReturnValue({ auth: { getUser: async () => ({ data: { user: { id: "a" } }, error: null }) }, from: () => query } as never);
    expect((await middleware(new NextRequest("https://app.test/dashboard/workout"))).headers.get("location")).toBeNull();
    expect((await middleware(new NextRequest("https://app.test/admin/members"))).headers.get("location")).toContain("/login?tab=admin");
  });
  it("leaves signup public, requires login for onboarding and preserves refresh cookies on redirects", async () => {
    vi.mocked(createServerClient).mockImplementation((_url, _key, options: any) => ({
      auth: { getUser: async () => {
        options.cookies.setAll([{ name: "refresh-test", value: "new", options: { path: "/" } }]);
        return { data: { user: null }, error: null };
      } },
    } as never));
    expect((await middleware(new NextRequest("https://app.test/auth"))).headers.get("location")).toBeNull();
    expect((await middleware(new NextRequest("https://app.test/onboarding"))).headers.get("location")).toContain("/auth?mode=signin");
    const response = await middleware(new NextRequest("https://app.test/dashboard/workout"));
    expect(response.headers.get("location")).toContain("/auth?mode=signin");
    expect(response.cookies.get("refresh-test")?.value).toBe("new");
  });
  it("rejects cross-origin mutations before contacting authentication services", async () => {
    const response = await middleware(new NextRequest("https://app.test/api/member/login", { method: "POST", headers: { origin: "https://evil.test" } }));
    expect(response.status).toBe(403);
    expect(createServerClient).not.toHaveBeenCalled();
  });
});
