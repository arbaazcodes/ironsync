import { createHmac, timingSafeEqual } from "node:crypto";
import { createServiceClient } from "@/lib/supabase/admin";
import { getMemberSessionSecret, verifyMemberSessionToken } from "./memberSession";

/** Bind legacy PIN sessions to the current stored credential without exposing its hash. */
export function memberCredentialVersion(pinHash: string): string {
  const secret = getMemberSessionSecret();
  if (!secret) throw new Error("Member authentication is unavailable");
  return createHmac("sha256", secret).update("pin-version:" + pinHash).digest("hex");
}
export async function verifyActiveMemberSession(token: string) {
  const payload = verifyMemberSessionToken(token);
  if (!payload) return null;
  const client = createServiceClient();
  if (!client) return null;
  const { data: member, error } = await client.from("members")
    .select("id, member_id, status, expiry_date, pin_hash").eq("id", payload.id).maybeSingle();
  if (error || !member || member.member_id !== payload.memberId || member.status !== "active") return null;
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
  if (member.expiry_date && member.expiry_date < today) return null;
  const current = Buffer.from(memberCredentialVersion(member.pin_hash), "hex");
  const supplied = Buffer.from(payload.credentialVersion, "hex");
  return supplied.length === current.length && timingSafeEqual(supplied, current) ? payload : null;
}
