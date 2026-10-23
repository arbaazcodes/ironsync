import { describe, it, expect, vi, beforeEach } from "vitest";
import { safeRedirectPath } from "@/lib/auth/redirect";
import { getAdminUser } from "@/lib/security/adminAuth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createMemberSessionToken, verifyMemberSessionToken } from "@/lib/security/memberSession";
import { verifyMemberSessionTokenEdge } from "@/lib/security/memberSessionEdge";
import { createHmac } from "node:crypto";
vi.mock("@/lib/supabase/server", () => ({ createServerSupabaseClient: vi.fn() }));
beforeEach(() => { vi.clearAllMocks(); process.env.MEMBER_SESSION_SECRET = "test-only-secret-with-more-than-thirty-two-characters"; });
describe("authorization", () => {
  it.each(["https://evil.test", "//evil.test", "/\\evil.test", "/%5cevil.test", "/%2f%2fevil.test", "/%0aevil.test", "javascript:alert(1)", "/%ZZ"])("rejects unsafe redirects: %s", input => {
    expect(safeRedirectPath(input)).toBe("/dashboard");
  });
  it("preserves safe internal destinations", () => expect(safeRedirectPath("/dashboard/workout?day=2")).toBe("/dashboard/workout?day=2"));
  it.each([{ data: null, error: null }, { data: null, error: { message: "relation missing" } }, { data: { user_id: "a" }, error: { message: "permission denied" } }])("fails closed on an absent or failed admin lookup", async lookup => {
    const query = { select: () => query, eq: () => query, maybeSingle: async () => lookup };
    vi.mocked(createServerSupabaseClient).mockResolvedValue({ auth: { getUser: async () => ({ data: { user: { id: "a", user_metadata: { role: "admin" } } }, error: null }) }, from: () => query } as never);
    expect(await getAdminUser()).toBeNull();
  });
  it("requires a positive allowlist match and ignores metadata roles", async () => {
    const query = { select: () => query, eq: () => query, maybeSingle: async () => ({ data: { user_id: "a" }, error: null }) };
    vi.mocked(createServerSupabaseClient).mockResolvedValue({ auth: { getUser: async () => ({ data: { user: { id: "a", user_metadata: { role: "superuser" } } }, error: null }) }, from: () => query } as never);
    expect(await getAdminUser()).toMatchObject({ id: "a", role: "admin" });
  });
  it("verifies valid member signatures in Node and Edge and rejects tampering", async () => {
    const token = createMemberSessionToken({ id: "a", memberId: "IS-1", fullName: "Test", status: "active", planId: null, credentialVersion: "a".repeat(64) });
    expect(verifyMemberSessionToken(token)?.id).toBe("a");
    expect((await verifyMemberSessionTokenEdge(token))?.id).toBe("a");
    expect(verifyMemberSessionToken(token + "x")).toBeNull();
  });
  it.each([undefined, 0, "99999999999", Math.floor(Date.now() / 1000)])("rejects missing, invalid or expired expiration: %s", async exp => {
    const payload = Buffer.from(JSON.stringify({ id: "a", memberId: "IS-1", fullName: "Test", exp })).toString("base64url");
    const token = payload + "." + createHmac("sha256", process.env.MEMBER_SESSION_SECRET!).update(payload).digest("base64url");
    expect(verifyMemberSessionToken(token)).toBeNull();
    expect(await verifyMemberSessionTokenEdge(token)).toBeNull();
  });
});
