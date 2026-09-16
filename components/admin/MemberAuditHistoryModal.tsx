"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  History,
  Loader2,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  User,
  MailX,
  FileEdit,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { GymMember } from "@/lib/types/member";
import { MemberAuditLogEntry } from "@/lib/types/auditLog";
import { CHANGE_FIELD_METADATA, AllowedChangeFieldKey } from "@/lib/types/changeRequest";

interface MemberAuditHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: GymMember | null;
}

export function MemberAuditHistoryModal({
  isOpen,
  onClose,
  member,
}: MemberAuditHistoryModalProps) {
  const [logs, setLogs] = useState<MemberAuditLogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAuditLog = useCallback(async () => {
    if (!member) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/members/${member.id}/audit`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to load member audit history.");
      }
      const data = await res.json();
      setLogs(data.auditLog || []);
    } catch (err: any) {
      console.error("Error fetching audit log:", err);
      setError(err?.message || "Failed to retrieve audit log.");
    } finally {
      setLoading(false);
    }
  }, [member]);

  useEffect(() => {
    if (isOpen && member) {
      fetchAuditLog();
    } else {
      setLogs([]);
      setError(null);
    }
  }, [isOpen, member, fetchAuditLog]);

  if (!isOpen || !member) return null;

  const getActionBadge = (action: string) => {
    switch (action) {
      case "request_submitted":
        return {
          icon: <FileEdit className="w-3.5 h-3.5 text-blue-500" />,
          label: "Request Submitted",
          className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
        };
      case "request_approved":
        return {
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />,
          label: "Request Approved",
          className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
        };
      case "request_rejected":
        return {
          icon: <XCircle className="w-3.5 h-3.5 text-rose-500" />,
          label: "Request Rejected",
          className: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
        };
      case "direct_edit":
        return {
          icon: <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />,
          label: "Direct Admin Edit",
          className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
        };
      case "email_skipped":
        return {
          icon: <MailX className="w-3.5 h-3.5 text-primary-dim" />,
          label: "Email Skipped",
          className: "bg-surface-elevated text-primary-muted border-border",
        };
      default:
        return {
          icon: <Clock className="w-3.5 h-3.5 text-primary-dim" />,
          label: action.replace(/_/g, " "),
          className: "bg-surface-elevated text-primary-muted border-border",
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md">
      <div className="w-full max-w-3xl bg-card border border-border rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-border bg-surface flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-elevated border border-border flex items-center justify-center text-accent shadow-xs">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold uppercase text-primary tracking-tight">
                  Member Audit History
                </h2>
                <span className="px-2 py-0.5 rounded bg-surface-elevated border border-border text-xs font-mono font-bold text-accent">
                  {member.memberId}
                </span>
              </div>
              <p className="text-xs text-primary-muted font-mono">
                {member.fullName} • Immutable timeline of changes & reviews
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchAuditLog}
              disabled={loading}
              title="Refresh timeline"
              className="p-2 rounded-lg text-primary-muted hover:text-primary hover:bg-surface-elevated transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-primary-muted hover:text-primary hover:bg-surface-elevated transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-card space-y-4">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3 text-primary-muted">
              <Loader2 className="w-7 h-7 animate-spin text-accent" />
              <span className="text-xs font-mono uppercase tracking-wider">
                Loading Audit Records...
              </span>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2 font-mono">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : logs.length === 0 ? (
            <div className="py-20 text-center space-y-2 text-primary-dim font-mono text-xs">
              <History className="w-8 h-8 mx-auto opacity-40" />
              <p>No audit records found for this member yet.</p>
              <p className="text-[11px] text-primary-muted">
                Profile submissions, admin reviews, and direct edits will appear here.
              </p>
            </div>
          ) : (
            <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-[2px] before:bg-border">
              {logs.map((log) => {
                const badge = getActionBadge(log.action);
                const eventDate = new Date(log.createdAt);

                return (
                  <div key={log.id} className="relative group">
                    {/* Timeline dot icon */}
                    <div className="absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full bg-card border-2 border-border flex items-center justify-center group-hover:border-accent transition-colors shadow-xs">
                      <div className="w-2 h-2 rounded-full bg-primary-muted group-hover:bg-accent" />
                    </div>

                    {/* Timeline Event Card */}
                    <div className="p-4 rounded-xl bg-surface border border-border hover:border-primary-dim/40 transition-all space-y-3 shadow-xs">
                      {/* Top Bar: Action badge, timestamp, actor */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase border flex items-center gap-1.5 ${badge.className}`}
                          >
                            {badge.icon}
                            <span>{badge.label}</span>
                          </span>

                          <span className="text-[11px] font-mono text-primary-muted flex items-center gap-1">
                            <User className="w-3 h-3 text-primary-dim" />
                            <span>
                              {log.actorType}:{" "}
                              <strong className="text-primary">{log.actorLabel || "System"}</strong>
                            </span>
                          </span>
                        </div>

                        <span className="text-[11px] font-mono text-primary-dim">
                          {eventDate.toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      {/* Event Specific Content */}
                      {log.action === "request_submitted" && log.afterData && (
                        <div className="text-xs space-y-2">
                          <div className="text-[11px] font-mono uppercase text-primary-dim font-bold">
                            Requested Fields:
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-mono text-xs">
                            {log.afterData.requested_fields &&
                              Object.entries(log.afterData.requested_fields).map(([key, val]) => {
                                const meta = CHANGE_FIELD_METADATA[key as AllowedChangeFieldKey];
                                const label = meta ? meta.label : key.replace(/_/g, " ");
                                return (
                                  <div
                                    key={key}
                                    className="p-1.5 rounded bg-surface-elevated border border-border/60 flex items-center justify-between"
                                  >
                                    <span className="text-primary-muted">{label}:</span>
                                    <span className="font-bold text-primary">{String(val)}</span>
                                  </div>
                                );
                              })}
                          </div>
                          {log.afterData.member_note && (
                            <p className="italic text-primary-muted bg-surface-elevated/70 p-2 rounded border border-border/60 text-xs">
                              Note: &ldquo;{log.afterData.member_note}&rdquo;
                            </p>
                          )}
                        </div>
                      )}

                      {log.action === "request_rejected" && (
                        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/25 text-xs space-y-1 font-mono">
                          <span className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400">
                            Rejection Reason:
                          </span>
                          <p className="text-rose-700 dark:text-rose-300 font-semibold italic">
                            &ldquo;
                            {log.afterData?.rejection_reason || "Reason not specified"}
                            &rdquo;
                          </p>
                        </div>
                      )}

                      {(log.action === "request_approved" || log.action === "direct_edit") && (
                        <div className="text-xs space-y-2">
                          <div className="text-[11px] font-mono uppercase text-primary-dim font-bold">
                            Applied Changes:
                          </div>

                          {log.beforeData && log.afterData ? (
                            <div className="border border-border rounded-lg overflow-hidden bg-surface-elevated/40">
                              <table className="w-full text-left text-xs">
                                <thead className="bg-surface-elevated text-[10px] font-mono uppercase text-primary-dim border-b border-border">
                                  <tr>
                                    <th className="p-2">Attribute</th>
                                    <th className="p-2">Previous Value</th>
                                    <th className="p-2 text-emerald-600 dark:text-emerald-400">
                                      New Value
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50 font-mono text-[11px]">
                                  {Object.keys(
                                    log.afterData.applied_fields || log.afterData
                                  ).map((key) => {
                                    if (key === "updated_at" || key === "admin_note") return null;
                                    const meta = CHANGE_FIELD_METADATA[key as AllowedChangeFieldKey];
                                    const label = meta ? meta.label : key.replace(/_/g, " ");
                                    const prevVal = log.beforeData?.[key];
                                    const nextVal =
                                      log.afterData?.applied_fields?.[key] ?? log.afterData?.[key];

                                    return (
                                      <tr key={key}>
                                        <td className="p-2 font-bold text-primary">{label}</td>
                                        <td className="p-2 text-primary-dim">
                                          {prevVal !== undefined && prevVal !== null
                                            ? String(prevVal)
                                            : "—"}
                                        </td>
                                        <td className="p-2 text-emerald-600 dark:text-emerald-400 font-bold">
                                          <div className="flex items-center gap-1">
                                            <ArrowRight className="w-3 h-3 text-emerald-500" />
                                            <span>{String(nextVal)}</span>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <pre className="p-2 rounded bg-surface-elevated border border-border text-[11px] font-mono text-primary overflow-x-auto">
                              {JSON.stringify(log.afterData, null, 2)}
                            </pre>
                          )}

                          {log.afterData?.admin_note && (
                            <p className="text-[11px] font-mono text-primary-muted italic">
                              Admin Note: &ldquo;{log.afterData.admin_note}&rdquo;
                            </p>
                          )}
                        </div>
                      )}

                      {log.action === "email_skipped" && log.afterData && (
                        <div className="text-[11px] font-mono text-primary-muted space-y-1 bg-surface-elevated p-2.5 rounded border border-border">
                          <div>
                            Event: <span className="font-bold text-primary">{log.afterData.event}</span>
                          </div>
                          <div>
                            Reason:{" "}
                            <span className="text-amber-600 dark:text-amber-400">
                              {log.afterData.reason}
                            </span>
                          </div>
                          {log.afterData.recipient && (
                            <div>
                              Recipient: <span>{log.afterData.recipient}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-surface flex items-center justify-between text-xs font-mono text-primary-muted">
          <span>Showing latest {logs.length} events</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-surface-elevated hover:bg-surface border border-border text-primary font-bold uppercase transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
