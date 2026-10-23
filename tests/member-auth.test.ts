import { beforeEach, expect, it, vi } from "vitest";
import { createServiceClient } from "@/lib/supabase/admin";
import { createMemberSessionToken } from "@/lib/security/memberSession";
import { memberCredentialVersion, verifyActiveMemberSession } from "@/lib/security/memberAuth";
vi.mock("@/lib/supabase/admin", () => ({ createServiceClient: vi.fn() }));
beforeEach(() => { process.env.MEMBER_SESSION_SECRET = "test-only-secret-with-more-than-thirty-two-characters"; });
it.each(["inactive", "suspended", "expired", "active"])("checks live member status: %s", async status => {
  const query = { select: () => query, eq: () => query, maybeSingle: async () => ({ data: { id: "a", member_id: "IS-1", status, pin_hash: "hash", expiry_date: null }, error: null }) };
  vi.mocked(createServiceClient).mockReturnValue({ from: () => query } as never);
  const token = createMemberSessionToken({ id: "a", memberId: "IS-1", fullName: "Test", status: "active", credentialVersion: memberCredentialVersion("hash") });
  expect(Boolean(await verifyActiveMemberSession(token))).toBe(status === "active");
});
it("invalidates old sessions immediately after a PIN reset", async () => {
  const query = { select: () => query, eq: () => query, maybeSingle: async () => ({ data: { id: "a", member_id: "IS-1", status: "active", pin_hash: "new-hash", expiry_date: null }, error: null }) };
  vi.mocked(createServiceClient).mockReturnValue({ from: () => query } as never);
  const token = createMemberSessionToken({ id: "a", memberId: "IS-1", fullName: "Test", status: "active", credentialVersion: memberCredentialVersion("old-hash") });
  expect(await verifyActiveMemberSession(token)).toBeNull();
});
