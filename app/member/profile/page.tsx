"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MemberDashboardData } from "@/lib/types/member";
import { DayAttendanceSummary } from "@/lib/types/attendance";
import { MemberChangeRequest, CHANGE_FIELD_METADATA, AllowedChangeFieldKey } from "@/lib/types/changeRequest";
import { AttendanceDots } from "@/components/dashboard/AttendanceDots";
import { ChangeRequestModal } from "@/components/member/ChangeRequestModal";
import {
  User,
  ShieldCheck,
  Calendar,
  Phone,
  Mail,
  Clock,
  Dumbbell,
  KeyRound,
  Loader2,
  LogOut,
  CheckCircle2,
  FileEdit,
  AlertCircle,
  Clock3,
  HeartHandshake,
  Activity,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

export default function MemberProfilePage() {
  const router = useRouter();
  const [data, setData] = useState<MemberDashboardData | null>(null);
  const [weekSummary, setWeekSummary] = useState<DayAttendanceSummary[]>([]);
  const [pendingRequest, setPendingRequest] = useState<MemberChangeRequest | null>(null);
  const [requestHistory, setRequestHistory] = useState<MemberChangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
  const [dismissRejectedNotice, setDismissRejectedNotice] = useState(false);

  const loadProfileData = useCallback(async () => {
    try {
      const [dashRes, attRes, reqRes] = await Promise.all([
        fetch("/api/member/dashboard"),
        fetch("/api/member/attendance"),
        fetch("/api/member/change-request"),
      ]);

      if (dashRes.ok) {
        const result = await dashRes.json();
        setData(result);
      }

      if (attRes.ok) {
        const attData = await attRes.json();
        setWeekSummary(attData.weekSummary || []);
      }

      if (reqRes.ok) {
        const reqData = await reqRes.json();
        setPendingRequest(reqData.pendingRequest || null);
        setRequestHistory(reqData.history || []);
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/member/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      router.push("/login?tab=member");
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-primary-muted space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
        <span className="text-xs font-mono uppercase tracking-wider">
          Loading Athlete Profile...
        </span>
      </div>
    );
  }

  const member = data?.member;
  if (!member) return null;

  // Calculate days remaining
  let daysRemaining: number | null = null;
  if (member.expiryDate) {
    const diff = new Date(member.expiryDate).getTime() - new Date().getTime();
    daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  // Latest rejected request if any and no pending request
  const latestRejected =
    !pendingRequest && !dismissRejectedNotice
      ? requestHistory.find((r) => r.status === "rejected") || null
      : null;

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header with Title & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-accent uppercase tracking-wider font-bold">
            <User className="w-3.5 h-3.5" />
            Gym Athlete Credentials
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-primary mt-1">
            Membership Profile
          </h1>
          <p className="text-xs sm:text-sm text-primary-muted">
            Official enrollment records, access parameters, and membership term.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Change Request CTA / Pending Status Badge */}
          {pendingRequest ? (
            <div className="py-2 px-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2">
              <Clock3 className="w-3.5 h-3.5 animate-pulse text-amber-600 dark:text-amber-400" />
              <span>Review Pending</span>
            </div>
          ) : (
            <button
              onClick={() => setIsChangeModalOpen(true)}
              className="py-2.5 px-4 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-mono uppercase font-bold tracking-wider flex items-center gap-2 shadow-accent-glow transition-all cursor-pointer"
            >
              <FileEdit className="w-4 h-4" />
              <span>Request a Change</span>
            </button>
          )}

          {/* Working Sign Out Button */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="py-2.5 px-4 rounded-xl bg-surface-elevated hover:bg-rose-500/10 border border-border hover:border-rose-500/30 text-primary-muted hover:text-rose-500 text-xs font-mono uppercase font-bold tracking-wider flex items-center gap-2 transition-all cursor-pointer"
          >
            {loggingOut ? (
              <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
            ) : (
              <LogOut className="w-4 h-4 text-rose-500" />
            )}
            <span>{loggingOut ? "Signing Out..." : "Sign Out"}</span>
          </button>
        </div>
      </div>

      {/* PENDING REQUEST BANNER */}
      {pendingRequest && (
        <div className="p-5 sm:p-6 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 space-y-3.5 shadow-sm animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-500/20 pb-3">
            <div className="flex items-center gap-2.5 text-amber-800 dark:text-amber-300 font-bold text-sm">
              <Clock3 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Request Pending — Wait for Gym Approval</span>
            </div>
            <span className="text-[11px] font-mono text-amber-700/80 dark:text-amber-400/80">
              Submitted: {new Date(pendingRequest.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] font-mono text-amber-800/80 dark:text-amber-300/80 uppercase font-semibold">
              Requested Modifications:
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(pendingRequest.requestedFields).map(([key, val]) => {
                const meta = CHANGE_FIELD_METADATA[key as AllowedChangeFieldKey];
                const label = meta ? meta.label : key.replace(/_/g, " ");
                const unit = meta?.unit ? ` ${meta.unit}` : "";
                return (
                  <div
                    key={key}
                    className="px-3 py-1.5 rounded-lg bg-surface border border-amber-500/30 text-xs font-mono text-primary flex items-center gap-1.5 shadow-xs"
                  >
                    <span className="text-primary-muted">{label}:</span>
                    <span className="font-bold text-accent">
                      {String(val).toUpperCase()}
                      {unit}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {pendingRequest.memberNote && (
            <div className="text-xs text-primary-muted italic bg-surface/80 p-2.5 rounded-lg border border-amber-500/20">
              &ldquo;{pendingRequest.memberNote}&rdquo;
            </div>
          )}

          <p className="text-xs text-primary-muted leading-relaxed">
            Your gym administrator will verify these updates. Once approved, your athlete profile and workout/nutrition calibration will update automatically.
          </p>
        </div>
      )}

      {/* RECENTLY REJECTED REQUEST NOTICE */}
      {latestRejected && (
        <div className="p-5 rounded-2xl bg-rose-500/10 border-2 border-rose-500/30 space-y-3.5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-500/20 pb-2.5">
            <div className="flex items-center gap-2 font-bold text-rose-600 dark:text-rose-400 uppercase font-mono text-sm">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
              <span>Rejected: {latestRejected.adminNote || "Reason not provided by front desk"}</span>
            </div>
            <button
              onClick={() => setDismissRejectedNotice(true)}
              className="text-primary-dim hover:text-primary font-mono text-[11px] underline cursor-pointer self-start sm:self-auto"
            >
              Dismiss
            </button>
          </div>

          <p className="text-xs text-primary-muted leading-relaxed">
            Your previous change request was reviewed and declined by the gym administration. You can adjust your details and submit a new request below.
          </p>

          <button
            onClick={() => setIsChangeModalOpen(true)}
            className="py-2 px-3.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-mono uppercase font-bold tracking-wider flex items-center gap-2 shadow-sm transition-all cursor-pointer w-fit"
          >
            <FileEdit className="w-3.5 h-3.5" />
            <span>Submit a New Request</span>
          </button>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-6">
        {/* Top Identification Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-accent text-white flex items-center justify-center font-black text-xl shadow-accent-glow">
              {member.fullName.charAt(0)}
            </div>
            <div>
              <div className="text-lg font-bold text-primary uppercase">{member.fullName}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2.5 py-0.5 rounded-full bg-surface-elevated border border-border text-xs font-mono font-bold text-primary">
                  {member.memberId}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[10px] font-mono uppercase text-emerald-600 dark:text-emerald-400 font-bold">
                  {member.status}
                </span>
              </div>
            </div>
          </div>

          {daysRemaining !== null && (
            <div className="p-3 rounded-2xl bg-surface-elevated border border-border text-center font-mono">
              <div className="text-[10px] text-primary-dim uppercase">Access Valid For</div>
              <div className="text-xl font-bold text-accent">{daysRemaining} Days</div>
            </div>
          )}
        </div>

        {/* 7-DAY ATTENDANCE STRIP */}
        {weekSummary.length > 0 && (
          <div className="space-y-3 border-b border-border pb-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-sky-600 dark:text-sky-400 font-bold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Recent 7-Day Attendance
              </span>
              <span className="text-[10px] font-mono text-primary-dim">IST Calendar Log</span>
            </div>
            <AttendanceDots summary={weekSummary} />
          </div>
        )}

        {/* Member Details Grid - Read-Only Official Records */}
        <div className="space-y-4">
          <div className="text-xs font-mono uppercase font-bold text-primary-muted tracking-wider">
            Official Membership & Contact Records
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            {/* Phone Number */}
            <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-1">
              <span className="text-primary-dim uppercase text-[10px] flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-accent" /> Phone Number
              </span>
              <div className="text-primary font-medium">{member.phone}</div>
            </div>

            {/* Email Address */}
            <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-1">
              <span className="text-primary-dim uppercase text-[10px] flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-sky-500" /> Email Address
              </span>
              <div className="text-primary font-medium">{member.email || "Not registered"}</div>
            </div>

            {/* Membership Start */}
            <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-1">
              <span className="text-primary-dim uppercase text-[10px] flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Membership Start
              </span>
              <div className="text-primary font-medium">{member.startDate}</div>
            </div>

            {/* Membership Expiry */}
            <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-1">
              <span className="text-primary-dim uppercase text-[10px] flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-amber-500" /> Membership Expiry
              </span>
              <div className="text-primary font-medium">{member.expiryDate || "Ongoing"}</div>
            </div>

            {/* Body Metrics: Weight & Height */}
            <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-1">
              <span className="text-primary-dim uppercase text-[10px] flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-rose-500" /> Body Metrics
              </span>
              <div className="text-primary font-medium">
                {member.weightKg || member.weight ? `${member.weightKg || member.weight} kg` : "—"} &bull;{" "}
                {member.heightCm || member.height ? `${member.heightCm || member.height} cm` : "—"}
              </div>
            </div>

            {/* Date of Birth & Gender */}
            <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-1">
              <span className="text-primary-dim uppercase text-[10px] flex items-center gap-1.5">
                <User className="w-3 h-3 text-indigo-500" /> Gender & DOB
              </span>
              <div className="text-primary font-medium uppercase">
                {member.gender || "—"} &bull; {member.dateOfBirth || "—"}
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-1">
              <span className="text-primary-dim uppercase text-[10px] flex items-center gap-1.5">
                <HeartHandshake className="w-3 h-3 text-emerald-500" /> Emergency Contact
              </span>
              <div className="text-primary font-medium">
                {member.emergencyContact || "None on file"}
              </div>
            </div>

            {/* Diet & Training Frequency */}
            <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-1">
              <span className="text-primary-dim uppercase text-[10px] flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-500" /> Diet & Frequency
              </span>
              <div className="text-primary font-medium uppercase">
                {(member.dietType || "non_vegetarian").replace(/_/g, " ")} &bull; {member.daysPerWeek || 4} days/wk
              </div>
            </div>

            {/* Primary Goal & Program */}
            <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-1 sm:col-span-2">
              <span className="text-primary-dim uppercase text-[10px] flex items-center gap-1.5">
                <Dumbbell className="w-3 h-3 text-accent" /> Primary Goal & Program
              </span>
              <div className="text-primary font-medium uppercase">
                {member.fitnessGoal.replace(/_/g, " ")} &bull; {data?.assignedPlan?.splitName || "Standard Program"} &bull; Level: {member.experience || "Intermediate"}
              </div>
            </div>

            {/* Member Notes if any */}
            {member.notes && (
              <div className="p-4 rounded-xl bg-surface-elevated border border-border space-y-1 sm:col-span-2">
                <span className="text-primary-dim uppercase text-[10px]">Staff & Athlete Notes</span>
                <div className="text-primary font-sans text-xs">{member.notes}</div>
              </div>
            )}
          </div>
        </div>

        {/* Security & Assistance Note */}
        <div className="p-4 rounded-2xl bg-surface border border-border flex items-start gap-3 text-xs text-primary-muted">
          <KeyRound className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="text-primary font-semibold">Security & Access Management</div>
            <p className="leading-relaxed">
              Official records can be updated via the &ldquo;Request a Change&rdquo; workflow above. For PIN resets or gym membership renewals, visit the front desk to be verified by a gym administrator.
            </p>
          </div>
        </div>
      </div>

      {/* Change Request Modal Form */}
      <ChangeRequestModal
        isOpen={isChangeModalOpen}
        onClose={() => setIsChangeModalOpen(false)}
        member={member}
        onSuccess={() => {
          loadProfileData();
        }}
      />
    </div>
  );
}
