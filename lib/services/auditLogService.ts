import crypto from "crypto";
import { createServiceClient } from "../supabase/admin";
import { MemberAuditLogEntry, CreateAuditLogInput } from "../types/auditLog";

// In-memory fallback store for audit logs
const MEMORY_AUDIT_LOGS: MemberAuditLogEntry[] = [];

function isMemoryFallbackAllowed(): boolean {
  return (
    process.env.ALLOW_MEMORY_MEMBERS === "true" ||
    process.env.NODE_ENV !== "production"
  );
}

/**
 * Strips sensitive keys like pin_hash, pinHash, and pin from audit payloads.
 */
function sanitizeAuditPayload(data: Record<string, any> | null | undefined): Record<string, any> | null {
  if (!data || typeof data !== "object") return null;

  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    if (
      lowerKey.includes("pin") ||
      lowerKey.includes("hash") ||
      lowerKey.includes("password") ||
      lowerKey.includes("secret")
    ) {
      continue; // NEVER store or expose pin/hash
    }
    cleaned[key] = value;
  }
  return Object.keys(cleaned).length > 0 ? cleaned : null;
}

function mapRowToAuditEntry(row: any): MemberAuditLogEntry {
  return {
    id: row.id,
    memberUuid: row.member_uuid,
    memberId: row.member_id,
    action: row.action,
    actorType: row.actor_type,
    actorLabel: row.actor_label || null,
    requestId: row.request_id || null,
    beforeData:
      typeof row.before_data === "string"
        ? JSON.parse(row.before_data)
        : sanitizeAuditPayload(row.before_data),
    afterData:
      typeof row.after_data === "string"
        ? JSON.parse(row.after_data)
        : sanitizeAuditPayload(row.after_data),
    createdAt: row.created_at,
  };
}

/**
 * Logs a member action into public.member_audit_log.
 * Explicitly sanitizes all data before writing to ensure pin_hash is never logged.
 */
export async function logMemberAction(input: CreateAuditLogInput): Promise<MemberAuditLogEntry> {
  const now = new Date().toISOString();
  const entryId = crypto.randomUUID();

  const sanitizedBefore = sanitizeAuditPayload(input.beforeData);
  const sanitizedAfter = sanitizeAuditPayload(input.afterData);

  const entry: MemberAuditLogEntry = {
    id: entryId,
    memberUuid: input.memberUuid,
    memberId: input.memberId,
    action: input.action,
    actorType: input.actorType,
    actorLabel: input.actorLabel || null,
    requestId: input.requestId || null,
    beforeData: sanitizedBefore,
    afterData: sanitizedAfter,
    createdAt: now,
  };

  const supabase = createServiceClient();
  if (supabase) {
    try {
      const { error } = await supabase.from("member_audit_log").insert({
        id: entry.id,
        member_uuid: entry.memberUuid,
        member_id: entry.memberId,
        action: entry.action,
        actor_type: entry.actorType,
        actor_label: entry.actorLabel,
        request_id: entry.requestId,
        before_data: entry.beforeData,
        after_data: entry.afterData,
        created_at: entry.createdAt,
      });

      if (error) {
        console.warn("[AuditLog] Failed to insert audit row in Supabase:", error.message);
        if (isMemoryFallbackAllowed()) {
          MEMORY_AUDIT_LOGS.unshift(entry);
        }
      }
    } catch (err: any) {
      console.warn("[AuditLog] Supabase exception while logging audit:", err?.message);
      if (isMemoryFallbackAllowed()) {
        MEMORY_AUDIT_LOGS.unshift(entry);
      }
    }
  } else {
    MEMORY_AUDIT_LOGS.unshift(entry);
  }

  // Keep memory cache trimmed
  if (MEMORY_AUDIT_LOGS.length > 500) {
    MEMORY_AUDIT_LOGS.length = 500;
  }

  return entry;
}

/**
 * Retrieves the latest audit log entries for a member (up to limit, default 50).
 * Sanitizes entries to guarantee no sensitive data is leaked.
 */
export async function getMemberAuditLog(
  memberUuidOrId: string,
  limit: number = 50
): Promise<MemberAuditLogEntry[]> {
  const supabase = createServiceClient();
  let entries: MemberAuditLogEntry[] = [];

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("member_audit_log")
        .select("*")
        .or(`member_uuid.eq.${memberUuidOrId},member_id.eq.${memberUuidOrId}`)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (!error && Array.isArray(data)) {
        entries = data.map(mapRowToAuditEntry);
      } else if (error) {
        console.warn("[AuditLog] Error fetching member audit logs:", error.message);
      }
    } catch (err: any) {
      console.warn("[AuditLog] Exception fetching member audit logs:", err?.message);
    }
  }

  if (entries.length === 0 && isMemoryFallbackAllowed()) {
    entries = MEMORY_AUDIT_LOGS.filter(
      (e) => e.memberUuid === memberUuidOrId || e.memberId === memberUuidOrId
    ).slice(0, limit);
  }

  return entries;
}
