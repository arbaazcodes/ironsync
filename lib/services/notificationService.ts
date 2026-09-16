import crypto from "crypto";
import { createServiceClient } from "../supabase/admin";
import {
  InAppNotification,
  CreateNotificationInput,
  NotificationAudience,
} from "../types/notification";

// In-memory fallback store for notifications (in case of connection issues)
const MEMORY_NOTIFICATIONS: InAppNotification[] = [];

function isMemoryFallbackAllowed(): boolean {
  return (
    process.env.ALLOW_MEMORY_MEMBERS === "true" ||
    process.env.NODE_ENV !== "production"
  );
}

/**
 * Strips any sensitive security tokens or PINs from string fields.
 */
function sanitizeNotificationText(text: string): string {
  if (!text) return "";
  return text.replace(/pin(_hash)?\s*[:=]\s*\S+/gi, "[REDACTED]");
}

function mapRowToNotification(row: any): InAppNotification {
  return {
    id: row.id,
    audience: row.audience as NotificationAudience,
    memberUuid: row.member_uuid || null,
    memberId: row.member_id || null,
    title: row.title,
    body: row.body,
    link: row.link || null,
    type: row.type,
    readAt: row.read_at || null,
    createdAt: row.created_at,
  };
}

/**
 * Writes an in-app notification to public.notifications.
 * Used across admin and member workflows.
 */
export async function createNotification(
  input: CreateNotificationInput
): Promise<InAppNotification> {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const notification: InAppNotification = {
    id,
    audience: input.audience,
    memberUuid: input.memberUuid || null,
    memberId: input.memberId || null,
    title: sanitizeNotificationText(input.title),
    body: sanitizeNotificationText(input.body),
    link: input.link || null,
    type: input.type,
    readAt: null,
    createdAt: now,
  };

  const supabase = createServiceClient();
  if (supabase) {
    try {
      const { error } = await supabase.from("notifications").insert({
        id: notification.id,
        audience: notification.audience,
        member_uuid: notification.memberUuid,
        member_id: notification.memberId,
        title: notification.title,
        body: notification.body,
        link: notification.link,
        type: notification.type,
        created_at: notification.createdAt,
      });

      if (error) {
        console.warn("[NotificationService] Error inserting notification:", error.message);
        if (isMemoryFallbackAllowed()) {
          MEMORY_NOTIFICATIONS.unshift(notification);
        }
      }
    } catch (err: any) {
      console.warn("[NotificationService] Exception inserting notification:", err?.message);
      if (isMemoryFallbackAllowed()) {
        MEMORY_NOTIFICATIONS.unshift(notification);
      }
    }
  } else {
    MEMORY_NOTIFICATIONS.unshift(notification);
  }

  // Trim memory cache
  if (MEMORY_NOTIFICATIONS.length > 200) {
    MEMORY_NOTIFICATIONS.length = 200;
  }

  return notification;
}

/**
 * Retrieves the latest notifications for an audience (admin or member).
 */
export async function getNotifications(params: {
  audience: NotificationAudience;
  memberUuid?: string | null;
  limit?: number;
}): Promise<{ notifications: InAppNotification[]; unreadCount: number }> {
  const { audience, memberUuid, limit = 20 } = params;
  const supabase = createServiceClient();
  let list: InAppNotification[] = [];

  if (supabase) {
    try {
      let query = supabase
        .from("notifications")
        .select("*")
        .eq("audience", audience);

      if (audience === "member" && memberUuid) {
        query = query.eq("member_uuid", memberUuid);
      }

      const { data, error } = await query
        .order("created_at", { ascending: false })
        .limit(limit);

      if (!error && Array.isArray(data)) {
        list = data.map(mapRowToNotification);
      } else if (error) {
        console.warn("[NotificationService] Failed to fetch notifications:", error.message);
      }
    } catch (err: any) {
      console.warn("[NotificationService] Exception fetching notifications:", err?.message);
    }
  }

  if (list.length === 0 && isMemoryFallbackAllowed()) {
    list = MEMORY_NOTIFICATIONS.filter((n) => {
      if (n.audience !== audience) return false;
      if (audience === "member" && memberUuid) {
        return n.memberUuid === memberUuid;
      }
      return true;
    }).slice(0, limit);
  }

  const unreadCount = list.filter((n) => !n.readAt).length;

  return { notifications: list, unreadCount };
}

/**
 * Marks a single notification or all notifications as read.
 */
export async function markNotificationRead(params: {
  id?: string;
  all?: boolean;
  audience: NotificationAudience;
  memberUuid?: string | null;
}): Promise<{ success: boolean }> {
  const { id, all, audience, memberUuid } = params;
  const now = new Date().toISOString();
  const supabase = createServiceClient();

  if (supabase) {
    try {
      if (all) {
        let query = supabase
          .from("notifications")
          .update({ read_at: now })
          .eq("audience", audience)
          .is("read_at", null);

        if (audience === "member" && memberUuid) {
          query = query.eq("member_uuid", memberUuid);
        }

        const { error } = await query;
        if (error) {
          console.warn("[NotificationService] Error marking all as read:", error.message);
        }
      } else if (id) {
        const { error } = await supabase
          .from("notifications")
          .update({ read_at: now })
          .eq("id", id);

        if (error) {
          console.warn("[NotificationService] Error marking notification as read:", error.message);
        }
      }
    } catch (err: any) {
      console.warn("[NotificationService] Exception marking read:", err?.message);
    }
  }

  if (isMemoryFallbackAllowed()) {
    for (const n of MEMORY_NOTIFICATIONS) {
      if (all) {
        if (n.audience === audience && (!memberUuid || n.memberUuid === memberUuid)) {
          if (!n.readAt) n.readAt = now;
        }
      } else if (id && n.id === id) {
        n.readAt = now;
      }
    }
  }

  return { success: true };
}
