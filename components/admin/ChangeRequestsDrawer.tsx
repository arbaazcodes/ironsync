"use client";

import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  AlertCircle,
  FileText,
  User,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";
import {
  ChangeRequestWithMember,
  ChangeRequestStatus,
  CHANGE_FIELD_METADATA,
  AllowedChangeFieldKey,
} from "@/lib/types/changeRequest";

interface ChangeRequestsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  requests: ChangeRequestWithMember[];
  initialSelectedId?: string | null;
  onReviewed: () => void;
}

export function ChangeRequestsDrawer({
  isOpen,
  onClose,
  requests,
  initialSelectedId,
  onReviewed,
}: ChangeRequestsDrawerProps) {
  const [filter, setFilter] = useState<ChangeRequestStatus | "all">("pending");
  const [selectedId, setSelectedId] = useState<string | null>(
    initialSelectedId || requests.find((r) => r.status === "pending")?.id || requests[0]?.id || null
  );
  const [adminNote, setAdminNote] = useState("");
  const [actionLoading, setActionLoading] = useState<"approve" | "reject" | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredRequests = requests.filter((r) => {
    if (filter === "all") return true;
    return r.status === filter;
  });

  const activeRequest =
    requests.find((r) => r.id === selectedId) || filteredRequests[0] || null;

  const handleReview = async (action: "approve" | "reject") => {
    if (!activeRequest) return;

    if (action === "reject" && !adminNote.trim()) {
      setActionError("Please provide a reason before rejecting this change request.");
      return;
    }

    setActionError(null);
    setActionSuccess(null);
    setActionLoading(action);

    try {
      const res = await fetch(`/api/admin/change-requests/${activeRequest.id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          adminNote: adminNote.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Failed to ${action} change request.`);
      }

      setActionSuccess(
        action === "approve"
          ? "Request approved successfully. Member profile has been updated."
          : "Request rejected."
      );
      setAdminNote("");
      onReviewed();
    } catch (err: any) {
      setActionError(err?.message || "An unexpected error occurred.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md">
      <div className="w-full max-w-4xl bg-card border border-border rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-border bg-surface flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase text-accent">
                Administration Queue
              </span>
              <span className="px-2 py-0.5 rounded-full bg-surface-elevated border border-border text-[10px] font-mono font-bold text-primary">
                {requests.filter((r) => r.status === "pending").length} Pending
              </span>
            </div>
            <h2 className="text-lg font-extrabold uppercase text-primary">
              Member Profile Change Requests
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-primary-muted hover:text-primary hover:bg-surface-elevated transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tab Bar */}
        <div className="px-5 py-2.5 border-b border-border bg-surface-elevated flex items-center gap-2 overflow-x-auto text-xs font-mono uppercase">
          {(["pending", "approved", "rejected", "all"] as const).map((tab) => {
            const count =
              tab === "all"
                ? requests.length
                : requests.filter((r) => r.status === tab).length;

            return (
              <button
                key={tab}
                onClick={() => {
                  setFilter(tab);
                  const matching = requests.filter((r) => (tab === "all" ? true : r.status === tab));
                  if (matching.length > 0) setSelectedId(matching[0].id);
                }}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  filter === tab
                    ? "bg-accent text-white font-bold shadow-xs"
                    : "text-primary-muted hover:text-primary hover:bg-surface"
                }`}
              >
                <span>{tab}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Content Split: Left List + Right Detail */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border overflow-hidden">
          {/* Left Column: Request List */}
          <div className="md:col-span-1 overflow-y-auto p-3 space-y-2 bg-surface/50 max-h-[30vh] md:max-h-none">
            {filteredRequests.length === 0 ? (
              <div className="py-12 text-center text-xs text-primary-muted font-mono space-y-1">
                <Clock className="w-6 h-6 mx-auto text-primary-dim opacity-60" />
                <div>No {filter} requests found</div>
              </div>
            ) : (
              filteredRequests.map((req) => {
                const isSelected = activeRequest?.id === req.id;
                const fieldCount = Object.keys(req.requestedFields).length;

                return (
                  <button
                    key={req.id}
                    onClick={() => {
                      setSelectedId(req.id);
                      setActionError(null);
                      setActionSuccess(null);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                      isSelected
                        ? "bg-card border-accent shadow-sm"
                        : "bg-surface-elevated/70 border-border hover:border-primary-dim/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-primary">
                        {req.memberId}
                      </span>
                      <span
                        className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full font-bold ${
                          req.status === "pending"
                            ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30"
                            : req.status === "approved"
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                            : "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30"
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    <div className="font-semibold text-xs text-primary truncate">
                      {req.currentMemberData?.fullName || "Member"}
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-primary-dim">
                      <span>{fieldCount} field{fieldCount === 1 ? "" : "s"}</span>
                      <span>
                        {new Date(req.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Right Column: Diff Review & Decision Form */}
          <div className="md:col-span-2 p-5 sm:p-6 overflow-y-auto space-y-5 bg-card">
            {!activeRequest ? (
              <div className="py-20 text-center text-primary-dim text-xs font-mono">
                Select a change request on the left to review.
              </div>
            ) : (
              <>
                {/* Header Information */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold uppercase text-primary">
                        {activeRequest.currentMemberData?.fullName || "Gym Member"}
                      </h3>
                      <span className="px-2 py-0.5 rounded bg-surface-elevated border border-border text-xs font-mono font-bold text-accent">
                        {activeRequest.memberId}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-primary-muted mt-0.5">
                      Submitted on{" "}
                      {new Date(activeRequest.createdAt).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>

                  <span
                    className={`self-start sm:self-auto text-xs font-mono uppercase px-3 py-1 rounded-full font-bold ${
                      activeRequest.status === "pending"
                        ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30"
                        : activeRequest.status === "approved"
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                        : "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30"
                    }`}
                  >
                    Status: {activeRequest.status}
                  </span>
                </div>

                {/* Member's note if attached */}
                {activeRequest.memberNote && (
                  <div className="p-3.5 rounded-xl bg-surface-elevated border border-border text-xs space-y-1">
                    <span className="text-[10px] font-mono uppercase text-primary-dim font-bold flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-accent" /> Member Note
                    </span>
                    <p className="text-primary italic leading-relaxed">
                      &ldquo;{activeRequest.memberNote}&rdquo;
                    </p>
                  </div>
                )}

                {/* DIFF TABLE: OLD VALUE VS REQUESTED VALUE */}
                <div className="space-y-2">
                  <div className="text-xs font-mono uppercase font-bold text-primary-muted flex items-center justify-between">
                    <span>Field Comparison</span>
                    <span className="text-[10px] text-primary-dim">Old Value &rarr; Requested Value</span>
                  </div>

                  <div className="border border-border rounded-xl overflow-hidden bg-surface">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-surface-elevated border-b border-border text-[10px] font-mono uppercase text-primary-dim">
                        <tr>
                          <th className="py-2.5 px-3 font-semibold">Attribute</th>
                          <th className="py-2.5 px-3 font-semibold">Current Value (Old)</th>
                          <th className="py-2.5 px-3 font-semibold text-accent">Requested Value (New)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {Object.entries(activeRequest.requestedFields).map(([key, newVal]) => {
                          const meta = CHANGE_FIELD_METADATA[key as AllowedChangeFieldKey];
                          const label = meta ? meta.label : key.replace(/_/g, " ");
                          const unit = meta?.unit ? ` ${meta.unit}` : "";
                          const oldVal =
                            activeRequest.currentMemberData?.[key as AllowedChangeFieldKey];

                          return (
                            <tr key={key} className="hover:bg-surface-elevated/40 transition-colors">
                              <td className="py-2.5 px-3 font-mono font-bold text-primary">
                                {label}
                              </td>
                              <td className="py-2.5 px-3 font-mono text-primary-dim">
                                {oldVal !== null && oldVal !== undefined && String(oldVal).trim() !== ""
                                  ? `${String(oldVal)}${unit}`
                                  : "—"}
                              </td>
                              <td className="py-2.5 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                <div className="flex items-center gap-1.5">
                                  <ArrowRight className="w-3 h-3 text-emerald-500" />
                                  <span>
                                    {String(newVal)}
                                    {unit}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Review Audit History if already reviewed */}
                {activeRequest.status !== "pending" && (
                  <div className="p-4 rounded-xl bg-surface-elevated border border-border text-xs space-y-1.5 font-mono">
                    <div className="text-[10px] uppercase text-primary-dim font-bold">
                      Audit Log
                    </div>
                    <div className="text-primary">
                      Reviewed by: <span className="font-bold">{activeRequest.reviewedBy || "Admin"}</span>
                    </div>
                    {activeRequest.reviewedAt && (
                      <div className="text-primary-muted text-[11px]">
                        At: {new Date(activeRequest.reviewedAt).toLocaleString()}
                      </div>
                    )}
                    {activeRequest.adminNote && (
                      <div className="pt-1 text-primary-muted italic">
                        Admin Note: &ldquo;{activeRequest.adminNote}&rdquo;
                      </div>
                    )}
                  </div>
                )}

                {/* Action Feedback Messages */}
                {actionError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{actionError}</span>
                  </div>
                )}

                {actionSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{actionSuccess}</span>
                  </div>
                )}

                 {/* Decision Form (Only if status is pending) */}
                {activeRequest.status === "pending" && (
                  <div className="pt-3 border-t border-border space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase text-primary-muted flex items-center justify-between">
                        <span>Admin Decision Note</span>
                        <span className="text-[10px] text-primary-dim">
                          {adminNote.trim() ? "Visible to member" : "Required to reject request"}
                        </span>
                      </label>
                      <input
                        type="text"
                        value={adminNote}
                        onChange={(e) => setAdminNote(e.target.value)}
                        placeholder="Type verification notes, or type mandatory reason to reject..."
                        className="w-full p-2.5 bg-surface border border-border rounded-xl text-primary text-xs focus:outline-none focus:border-accent"
                      />
                      {!adminNote.trim() && (
                        <p className="text-[11px] font-mono text-amber-600 dark:text-amber-400">
                          * A rejection reason is required before rejecting this request.
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Reject Button (Strictly disabled until admin types reason) */}
                      <button
                        type="button"
                        disabled={actionLoading !== null || !adminNote.trim()}
                        onClick={() => handleReview("reject")}
                        title={
                          !adminNote.trim()
                            ? "Please enter a rejection reason above to reject this request."
                            : "Reject this change request with the entered reason."
                        }
                        className="py-2.5 px-4 rounded-xl bg-surface-elevated hover:bg-rose-500/15 border border-border hover:border-rose-500/30 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {actionLoading === "reject" ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        <span>Reject Request</span>
                      </button>

                      {/* Approve Button */}
                      <button
                        type="button"
                        disabled={actionLoading !== null}
                        onClick={() => handleReview("approve")}
                        className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                      >
                        {actionLoading === "approve" ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                        <span>Approve & Apply</span>
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
