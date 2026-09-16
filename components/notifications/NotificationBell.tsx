"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCheck,
  Loader2,
  FileEdit,
  CheckCircle2,
  XCircle,
  UserCheck,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { getSupabase } from "@/lib/supabase/client";
import { InAppNotification, NotificationAudience } from "@/lib/types/notification";

interface NotificationBellProps {
  audience: NotificationAudience;
  memberUuid?: string | null;
}

function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSec < 45) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

export function NotificationBell({ audience, memberUuid }: NotificationBellProps) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 1. Initial Load & Manual Refresh
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) return;
      const data = await res.json();
      if (data.success && Array.isArray(data.notifications)) {
        setNotifications(data.notifications);
        setUnreadCount(typeof data.unreadCount === "number" ? data.unreadCount : 0);
      }
    } catch (err) {
      console.warn("[NotificationBell] Failed to load notifications:", err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // 2. Realtime Listener via Browser Supabase Client (Anon Key)
  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    const channelName =
      audience === "admin"
        ? "realtime:notifications:admin"
        : `realtime:notifications:member:${memberUuid || "all"}`;

    const filter =
      audience === "admin"
        ? "audience=eq.admin"
        : memberUuid
        ? `member_uuid=eq.${memberUuid}`
        : "audience=eq.member";

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter,
        },
        (payload) => {
          const row = payload.new as any;
          const newNotification: InAppNotification = {
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

          setNotifications((prev) => {
            if (prev.some((n) => n.id === newNotification.id)) return prev;
            return [newNotification, ...prev].slice(0, 20);
          });
          setUnreadCount((prev) => prev + 1);
        }
      )
      .subscribe();

    // 3. Fallback Polling every 60s
    const pollInterval = setInterval(() => {
      fetchNotifications();
    }, 60000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(pollInterval);
    };
  }, [audience, memberUuid, fetchNotifications]);

  // 4. Click Outside Listener to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // 5. Handle Click on Notification Item
  const handleItemClick = async (item: InAppNotification) => {
    // If unread, mark read in background
    if (!item.readAt) {
      fetch("/api/notifications/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id }),
      }).catch((err) => console.warn("Failed to mark notification read:", err));

      setNotifications((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, readAt: new Date().toISOString() } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }

    setIsOpen(false);

    if (item.link) {
      router.push(item.link);
    }
  };

  // 6. Handle Mark All As Read
  const handleMarkAllRead = async () => {
    if (unreadCount === 0 || markingAll) return;
    setMarkingAll(true);

    try {
      await fetch("/api/notifications/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });

      const now = new Date().toISOString();
      setNotifications((prev) => prev.map((n) => ({ ...n, readAt: n.readAt || now })));
      setUnreadCount(0);
    } catch (err) {
      console.warn("Failed to mark all notifications read:", err);
    } finally {
      setMarkingAll(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "change_request_submitted":
        return <FileEdit className="w-3.5 h-3.5 text-blue-500" />;
      case "change_request_approved":
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
      case "change_request_rejected":
        return <XCircle className="w-3.5 h-3.5 text-rose-500" />;
      case "attendance_marked":
        return <UserCheck className="w-3.5 h-3.5 text-emerald-500" />;
      case "profile_updated":
        return <Sparkles className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-accent" />;
    }
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Notifications"
        aria-expanded={isOpen}
        className="relative p-2 rounded-xl bg-surface border border-border hover:border-primary-dim/40 text-primary-muted hover:text-primary transition-colors cursor-pointer flex items-center justify-center shadow-xs"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-accent text-white text-[10px] font-mono font-black rounded-full flex items-center justify-center shadow-xs ring-2 ring-background animate-in zoom-in-50 duration-200">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 max-w-[calc(100vw-32px)] bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Dropdown Header */}
          <div className="p-3.5 border-b border-border bg-surface flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase text-primary">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-accent/15 text-accent text-[10px] font-mono font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                disabled={markingAll}
                className="text-[11px] font-mono text-primary-muted hover:text-accent flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
              >
                {markingAll ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <CheckCheck className="w-3 h-3" />
                )}
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-border/60 bg-card">
            {notifications.length === 0 ? (
              <div className="py-12 text-center text-primary-dim text-xs font-mono space-y-1.5">
                <Bell className="w-6 h-6 mx-auto opacity-30" />
                <div>No notifications yet</div>
                <div className="text-[10px] text-primary-muted">
                  New updates and requests will appear here in real-time.
                </div>
              </div>
            ) : (
              notifications.map((item) => {
                const isUnread = !item.readAt;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleItemClick(item)}
                    className={`w-full text-left p-3.5 transition-colors flex items-start gap-3 cursor-pointer group ${
                      isUnread
                        ? "bg-accent/[0.04] hover:bg-accent/[0.08]"
                        : "hover:bg-surface-elevated/60"
                    }`}
                  >
                    {/* Type Icon Badge */}
                    <div className="w-7 h-7 rounded-lg bg-surface-elevated border border-border flex items-center justify-center shrink-0 mt-0.5 group-hover:border-accent/40 transition-colors">
                      {getTypeIcon(item.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-xs truncate ${
                            isUnread ? "font-extrabold text-primary" : "font-medium text-primary-muted"
                          }`}
                        >
                          {item.title}
                        </span>
                        <span className="text-[10px] font-mono text-primary-dim shrink-0">
                          {formatRelativeTime(item.createdAt)}
                        </span>
                      </div>

                      <p className="text-xs text-primary-muted line-clamp-2 leading-relaxed font-sans">
                        {item.body}
                      </p>

                      {item.link && (
                        <div className="text-[10px] font-mono text-accent flex items-center gap-1 pt-0.5">
                          <span>View details</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>

                    {/* Unread Indicator Dot */}
                    {isUnread && (
                      <div className="w-2 h-2 rounded-full bg-accent shrink-0 mt-1.5 shadow-xs" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
