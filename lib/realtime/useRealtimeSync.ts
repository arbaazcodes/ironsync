"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { getSupabase } from "@/lib/supabase/client";

export type RealtimeSyncTable =
  | "members"
  | "attendance"
  | "member_change_requests"
  | "notifications"
  | "audit_logs";

export interface UseRealtimeSyncOptions {
  tables: RealtimeSyncTable[];
  onSync: () => void | Promise<void>;
  filter?: string;
  channelName?: string;
  debounceMs?: number;
  pollingIntervalMs?: number;
  enabled?: boolean;
}

export interface UseRealtimeSyncReturn {
  isConnected: boolean;
  lastSyncedAt: Date | null;
  syncNow: () => void;
}

/**
 * Universal Real-Time Web <-> Mobile Synchronization Hook.
 * 
 * Subscribes to Supabase postgres_changes for specified tables.
 * Employs:
 * - Debounced synchronization to coalesce rapid mutations
 * - Window visibility revalidation (foregrounding the app triggers sync)
 * - Network reconnect recovery ('online' event triggers sync)
 * - Heartbeat / fallback polling for guaranteed eventual consistency
 */
export function useRealtimeSync({
  tables,
  onSync,
  filter,
  channelName,
  debounceMs = 400,
  pollingIntervalMs = 25000,
  enabled = true,
}: UseRealtimeSyncOptions): UseRealtimeSyncReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  const onSyncRef = useRef(onSync);
  onSyncRef.current = onSync;

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedSync = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(async () => {
      try {
        await onSyncRef.current();
        setLastSyncedAt(new Date());
      } catch (err) {
        console.warn("[useRealtimeSync] Sync callback error:", err);
      }
    }, debounceMs);
  }, [debounceMs]);

  const syncNow = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    Promise.resolve(onSyncRef.current())
      .then(() => setLastSyncedAt(new Date()))
      .catch((err) => console.warn("[useRealtimeSync] Manual sync error:", err));
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // 1. Supabase Realtime Channel
    const supabase = getSupabase();
    let channel: any = null;

    if (supabase) {
      const generatedChannelName =
        channelName ||
        `sync:${tables.sort().join("+")}:${filter || "all"}:${Math.random().toString(36).substring(2, 7)}`;

      channel = supabase.channel(generatedChannelName);

      tables.forEach((table) => {
        channel.on(
          "postgres_changes" as any,
          {
            event: "*",
            schema: "public",
            table,
            ...(filter ? { filter } : {}),
          },
          () => {
            debouncedSync();
          }
        );
      });

      channel.subscribe((status: string) => {
        if (status === "SUBSCRIBED") {
          setIsConnected(true);
        } else if (status === "CLOSED" || status === "CHANNEL_ERROR") {
          setIsConnected(false);
        }
      });
    }

    // 2. Foreground / Visibility Revalidation
    const handleVisibilityChange = () => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        debouncedSync();
      }
    };

    // 3. Online Reconnect Recovery
    const handleOnline = () => {
      debouncedSync();
    };

    if (typeof window !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("online", handleOnline);
    }

    // 4. Background Heartbeat Polling
    let pollingTimer: NodeJS.Timeout | null = null;
    if (pollingIntervalMs > 0) {
      pollingTimer = setInterval(() => {
        if (typeof document === "undefined" || document.visibilityState === "visible") {
          debouncedSync();
        }
      }, pollingIntervalMs);
    }

    return () => {
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (pollingTimer) {
        clearInterval(pollingTimer);
      }
      if (typeof window !== "undefined") {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        window.removeEventListener("online", handleOnline);
      }
      setIsConnected(false);
    };
  }, [tables, filter, channelName, debounceMs, pollingIntervalMs, enabled, debouncedSync]);

  return { isConnected, lastSyncedAt, syncNow };
}
