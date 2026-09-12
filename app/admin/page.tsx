"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  UserCheck,
  Clock,
  UserPlus,
  ArrowRight,
  TrendingUp,
  Dumbbell,
  Shield,
  Loader2,
  RefreshCw,
  Search,
} from "lucide-react";
import { GymMember } from "@/lib/types/member";
import { GYM_PLAN_TEMPLATES } from "@/lib/data/gymPlans";

export default function AdminOverviewPage() {
  const router = useRouter();
  const [members, setMembers] = useState<GymMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/members");
      if (res.ok) {
        const data = await res.json();
        setMembers(data.members || []);
      }
    } catch (err) {
      console.error("Failed to load members:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const totalMembers = members.length;
  const activeMembers = members.filter((m) => m.status === "active").length;
  
  // Expiring within 30 days
  const now = new Date();
  const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const expiringSoon = members.filter((m) => {
    if (!m.expiryDate) return false;
    const exp = new Date(m.expiryDate);
    return exp >= now && exp <= thirtyDaysLater;
  }).length;

  const newThisMonth = members.filter((m) => {
    const created = new Date(m.createdAt);
    return (
      created.getMonth() === now.getMonth() &&
      created.getFullYear() === now.getFullYear()
    );
  }).length;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#FF1E1E] uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            Operations Command Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">
            Gym Overview
          </h1>
          <p className="text-xs sm:text-sm text-white/50">
            Monitor active athletes, membership statuses, and program allocations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchMembers}
            disabled={loading}
            className="p-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white/70 hover:text-white hover:bg-white/[0.09] transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <Link
            href="/admin/members?action=add"
            className="py-2.5 px-4 rounded-xl bg-[#FF1E1E] hover:bg-[#E01818] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#FF1E1E]/20 flex items-center gap-2 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Add Member
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Members */}
        <div className="p-5 rounded-2xl bg-[#121212] border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between text-white/50 text-xs font-mono uppercase">
            <span>Total Enrolled</span>
            <Users className="w-4 h-4 text-[#FF1E1E]" />
          </div>
          <div className="text-3xl font-black tracking-tight text-white">
            {loading ? <Loader2 className="w-6 h-6 animate-spin text-white/40" /> : totalMembers}
          </div>
          <div className="text-[11px] text-white/40">
            Sequential ID range: IS-2026-0001+
          </div>
        </div>

        {/* Active Members */}
        <div className="p-5 rounded-2xl bg-[#121212] border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between text-white/50 text-xs font-mono uppercase">
            <span>Active Athletes</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black tracking-tight text-emerald-400">
            {loading ? <Loader2 className="w-6 h-6 animate-spin text-white/40" /> : activeMembers}
          </div>
          <div className="text-[11px] text-white/40">
            {totalMembers > 0 ? `${Math.round((activeMembers / totalMembers) * 100)}% retention rate` : "Ready for athletes"}
          </div>
        </div>

        {/* Expiring Soon */}
        <div className="p-5 rounded-2xl bg-[#121212] border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between text-white/50 text-xs font-mono uppercase">
            <span>Expiring (30d)</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black tracking-tight text-amber-400">
            {loading ? <Loader2 className="w-6 h-6 animate-spin text-white/40" /> : expiringSoon}
          </div>
          <div className="text-[11px] text-white/40">Requires renewal contact</div>
        </div>

        {/* New this month */}
        <div className="p-5 rounded-2xl bg-[#121212] border border-white/[0.08] space-y-2">
          <div className="flex items-center justify-between text-white/50 text-xs font-mono uppercase">
            <span>New This Month</span>
            <TrendingUp className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-black tracking-tight text-sky-400">
            {loading ? <Loader2 className="w-6 h-6 animate-spin text-white/40" /> : newThisMonth}
          </div>
          <div className="text-[11px] text-white/40">Onboarded in 2026</div>
        </div>
      </div>

      {/* Program Distribution */}
      <div className="p-6 rounded-2xl bg-[#121212] border border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold uppercase tracking-wider text-white">
              Assigned Training Blueprints
            </h2>
            <p className="text-xs text-white/50">
              Active programs across member profiles
            </p>
          </div>
          <Link
            href="/admin/plans"
            className="text-xs font-mono text-[#FF1E1E] hover:underline flex items-center gap-1"
          >
            Catalog <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {GYM_PLAN_TEMPLATES.map((tpl) => {
            const count = members.filter((m) => m.planId === tpl.id).length;
            return (
              <div
                key={tpl.id}
                className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-1.5"
              >
                <div className="text-xs font-bold text-white uppercase">{tpl.name}</div>
                <div className="text-[11px] text-white/40 font-mono">
                  {tpl.trainingDays} Days/wk &bull; {tpl.goal}
                </div>
                <div className="pt-2 flex items-center justify-between text-xs font-mono">
                  <span className="text-white/60">Assigned:</span>
                  <span className="font-bold text-[#FF1E1E]">{count} members</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Members Section */}
      <div className="p-6 rounded-2xl bg-[#121212] border border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold uppercase tracking-wider text-white">
              Recent Members
            </h2>
            <p className="text-xs text-white/50">
              Latest enrolled gym members and their status
            </p>
          </div>
          <Link
            href="/admin/members"
            className="text-xs font-mono text-white/70 hover:text-white flex items-center gap-1.5"
          >
            View All Members <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-white/40 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#FF1E1E]" />
            <span className="text-xs font-mono">Loading member roster...</span>
          </div>
        ) : members.length === 0 ? (
          <div className="py-12 text-center space-y-3 bg-black/30 rounded-xl border border-dashed border-white/[0.08]">
            <div className="w-12 h-12 mx-auto rounded-full bg-white/[0.04] flex items-center justify-center text-white/40">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-sm font-bold text-white">No Members Enrolled Yet</div>
            <p className="text-xs text-white/50 max-w-sm mx-auto">
              Add your first gym member to generate their official Member ID (IS-2026-0001) and temporary 4-digit PIN.
            </p>
            <Link
              href="/admin/members?action=add"
              className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-[#FF1E1E] text-white text-xs font-bold uppercase tracking-wider"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Add First Member
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] text-white/40 font-mono uppercase text-[10px]">
                  <th className="pb-3 font-semibold">Member ID</th>
                  <th className="pb-3 font-semibold">Athlete Name</th>
                  <th className="pb-3 font-semibold">Phone</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Assigned Plan</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {members.slice(0, 6).map((member) => {
                  const plan = GYM_PLAN_TEMPLATES.find((p) => p.id === member.planId);
                  return (
                    <tr key={member.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 font-mono font-bold text-white/90">
                        {member.memberId}
                      </td>
                      <td className="py-3 font-medium text-white">
                        {member.fullName}
                      </td>
                      <td className="py-3 font-mono text-white/60">
                        {member.phone}
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono uppercase ${
                            member.status === "active"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : member.status === "suspended"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-red-500/10 text-red-400 border border-red-500/20"
                          }`}
                        >
                          {member.status}
                        </span>
                      </td>
                      <td className="py-3 text-white/70">
                        {plan?.name || member.planId || "Default Blueprint"}
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          href={`/admin/members?id=${member.id}`}
                          className="text-[#FF1E1E] hover:underline font-mono text-[11px]"
                        >
                          Manage &rarr;
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
