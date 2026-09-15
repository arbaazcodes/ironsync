"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MemberDashboardData } from "@/lib/types/member";
import { DayAttendanceSummary } from "@/lib/types/attendance";
import { AttendanceDots } from "@/components/dashboard/AttendanceDots";
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
} from "lucide-react";

export default function MemberProfilePage() {
  const router = useRouter();
  const [data, setData] = useState<MemberDashboardData | null>(null);
  const [weekSummary, setWeekSummary] = useState<DayAttendanceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const [dashRes, attRes] = await Promise.all([
          fetch("/api/member/dashboard"),
          fetch("/api/member/attendance"),
        ]);

        if (dashRes.ok) {
          const result = await dashRes.json();
          setData(result);
        }

        if (attRes.ok) {
          const attData = await attRes.json();
          setWeekSummary(attData.weekSummary || []);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

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
      <div className="py-24 flex flex-col items-center justify-center text-white/50 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF1E1E]" />
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

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#FF1E1E] uppercase tracking-wider">
            <User className="w-3.5 h-3.5" />
            Gym Athlete Credentials
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">
            Membership Profile
          </h1>
          <p className="text-xs sm:text-sm text-white/50">
            Official enrollment records, access parameters, and membership term.
          </p>
        </div>

        {/* Working Sign Out Button */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="self-start sm:self-auto py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-rose-500/10 border border-white/[0.08] hover:border-rose-500/30 text-white/70 hover:text-rose-400 text-xs font-mono uppercase font-bold tracking-wider flex items-center gap-2 transition-all"
        >
          {loggingOut ? (
            <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
          ) : (
            <LogOut className="w-4 h-4 text-rose-400" />
          )}
          <span>{loggingOut ? "Signing Out..." : "Sign Out"}</span>
        </button>
      </div>

      {/* Main Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#121212] border border-white/[0.08] space-y-6">
        {/* Top Identification Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF1E1E] to-[#990000] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-[#FF1E1E]/20">
              {member.fullName.charAt(0)}
            </div>
            <div>
              <div className="text-lg font-bold text-white uppercase">{member.fullName}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-xs font-mono font-bold text-white">
                  {member.memberId}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[10px] font-mono uppercase text-emerald-400 font-bold">
                  {member.status}
                </span>
              </div>
            </div>
          </div>

          {daysRemaining !== null && (
            <div className="p-3 rounded-2xl bg-black/40 border border-white/[0.06] text-center font-mono">
              <div className="text-[10px] text-white/40 uppercase">Access Valid For</div>
              <div className="text-xl font-bold text-[#FF1E1E]">{daysRemaining} Days</div>
            </div>
          )}
        </div>

        {/* 7-DAY ATTENDANCE STRIP */}
        {weekSummary.length > 0 && (
          <div className="space-y-3 border-b border-white/[0.08] pb-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-sky-400 font-bold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Recent 7-Day Attendance
              </span>
              <span className="text-[10px] font-mono text-white/40">IST Calendar Log</span>
            </div>
            <AttendanceDots summary={weekSummary} />
          </div>
        )}

        {/* Member Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-1">
            <span className="text-white/40 uppercase text-[10px] flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-[#FF1E1E]" /> Phone Number
            </span>
            <div className="text-white font-medium">{member.phone}</div>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-1">
            <span className="text-white/40 uppercase text-[10px] flex items-center gap-1.5">
              <Mail className="w-3 h-3 text-sky-400" /> Email Address
            </span>
            <div className="text-white font-medium">{member.email || "Not registered"}</div>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-1">
            <span className="text-white/40 uppercase text-[10px] flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-emerald-400" /> Membership Start
            </span>
            <div className="text-white font-medium">{member.startDate}</div>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-1">
            <span className="text-white/40 uppercase text-[10px] flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-amber-400" /> Membership Expiry
            </span>
            <div className="text-white font-medium">{member.expiryDate || "Ongoing"}</div>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-1 sm:col-span-2">
            <span className="text-white/40 uppercase text-[10px] flex items-center gap-1.5">
              <Dumbbell className="w-3 h-3 text-[#FF1E1E]" /> Primary Goal & Program
            </span>
            <div className="text-white font-medium uppercase">
              {member.fitnessGoal} &bull; {data?.assignedPlan?.splitName || "Standard Program"}
            </div>
          </div>
        </div>

        {/* Security & Assistance Note */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3 text-xs text-white/50">
          <KeyRound className="w-4 h-4 text-[#FF1E1E] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="text-white font-semibold">Security & Access Management</div>
            <p className="leading-relaxed">
              To update your phone number, renew your membership, or reset your 4-digit PIN, please visit your gym front desk. Your gym administrator will verify your credentials and issue an updated security token.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
