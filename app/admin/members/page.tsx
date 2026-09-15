"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Users,
  Search,
  Filter,
  UserPlus,
  KeyRound,
  ShieldAlert,
  Copy,
  Check,
  Printer,
  X,
  Loader2,
  Calendar,
  Phone,
  Mail,
  Dumbbell,
  AlertCircle,
  Clock,
  Sparkles,
  ExternalLink,
  UserCheck,
} from "lucide-react";
import { GymMember, MemberStatus, CreateMemberInput } from "@/lib/types/member";
import { AttendanceRecord, DayAttendanceSummary } from "@/lib/types/attendance";
import { AttendanceDots } from "@/components/dashboard/AttendanceDots";
import { GYM_PLAN_TEMPLATES } from "@/lib/data/gymPlans";

function MembersManager() {
  const searchParams = useSearchParams();
  const initialAction = searchParams.get("action");

  // Roster State
  const [members, setMembers] = useState<GymMember[]>([]);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceRecord[]>>({});
  const [markingAttendanceId, setMarkingAttendanceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Add Member Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(initialAction === "add");
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateMemberInput>({
    fullName: "",
    phone: "",
    email: "",
    pin: "",
    fitnessGoal: "hypertrophy",
    planId: "plan-hypertrophy-ppl",
    startDate: new Date().toISOString().split("T")[0],
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    dateOfBirth: "",
    gender: "male",
    notes: "",
  });

  // Credentials Modal State (Shown ONCE after create or PIN reset)
  const [credentialsModal, setCredentialsModal] = useState<{
    isOpen: boolean;
    fullName: string;
    memberId: string;
    rawPin: string;
    type: "new" | "reset";
  }>({
    isOpen: false,
    fullName: "",
    memberId: "",
    rawPin: "",
    type: "new",
  });
  const [copied, setCopied] = useState(false);

  // Reset PIN State
  const [resettingId, setResettingId] = useState<string | null>(null);

  // Edit / Plan Change Modal State
  const [activeEditMember, setActiveEditMember] = useState<GymMember | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  // Helper to generate 7-day attendance summary for compact rendering in table
  const getMemberWeekSummary = (records: AttendanceRecord[] = []): DayAttendanceSummary[] => {
    const dates: string[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      dates.push(new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(d));
    }
    const todayIST = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(now);
    const recMap = new Map(records.map((r) => [r.day, r]));

    return dates.map((dateStr) => {
      const d = new Date(dateStr + "T00:00:00Z");
      const dayOfWeek = new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        timeZone: "Asia/Kolkata",
      }).format(d).toUpperCase();
      const existing = recMap.get(dateStr);
      return {
        date: dateStr,
        dayOfWeek,
        formattedDate: dateStr,
        status: existing ? existing.status : "unmarked",
        isToday: dateStr === todayIST,
        isPast: dateStr < todayIST,
        record: existing,
      };
    });
  };

  // Quick Mark Present Handler for Front Desk
  const handleQuickMarkPresent = async (member: GymMember) => {
    if (markingAttendanceId === member.id) return;
    setMarkingAttendanceId(member.id);
    try {
      const res = await fetch(`/api/admin/members/${member.id}/attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "present" }),
      });
      if (res.ok) {
        const result = await res.json();
        const todayIST = new Intl.DateTimeFormat("en-CA", {
          timeZone: "Asia/Kolkata",
        }).format(new Date());

        setAttendanceMap((prev) => {
          const current = prev[member.id] || [];
          const filtered = current.filter((r) => r.day !== todayIST);
          const newRecord: AttendanceRecord = result.record || {
            id: crypto.randomUUID(),
            memberUuid: member.id,
            day: todayIST,
            status: "present",
            source: "admin",
            createdAt: new Date().toISOString(),
          };
          return {
            ...prev,
            [member.id]: [newRecord, ...filtered],
          };
        });
      }
    } catch (err) {
      console.error("Error marking attendance:", err);
    } finally {
      setMarkingAttendanceId(null);
    }
  };

  // Fetch Members with Batch Attendance
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/members?includeAttendance=true");
      if (res.ok) {
        const data = await res.json();
        setMembers(data.members || []);
        if (data.attendance) {
          setAttendanceMap(data.attendance);
        }
      }
    } catch (err) {
      console.error("Error fetching members:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    if (searchParams.get("action") === "add") {
      setIsAddModalOpen(true);
    }
  }, [searchParams]);

  // Filtered list
  const filteredMembers = members.filter((m) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      m.fullName.toLowerCase().includes(q) ||
      m.memberId.toLowerCase().includes(q) ||
      m.phone.includes(q) ||
      (m.email && m.email.toLowerCase().includes(q));

    const matchesStatus = statusFilter === "all" || m.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Handle Create Member
  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);

    if (!formData.fullName.trim()) {
      setAddError("Full name is required.");
      return;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 7) {
      setAddError("A valid phone number is required.");
      return;
    }
    if (formData.pin && !/^\d{4}$/.test(formData.pin.trim())) {
      setAddError("Custom PIN must be exactly 4 digits.");
      return;
    }

    try {
      setAddLoading(true);
      const res = await fetch("/api/admin/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setAddError(data.error || "Failed to create member.");
        setAddLoading(false);
        return;
      }

      setIsAddModalOpen(false);
      setAddLoading(false);

      // Open Credentials Modal
      setCredentialsModal({
        isOpen: true,
        fullName: data.member.fullName,
        memberId: data.member.memberId,
        rawPin: data.rawPin,
        type: "new",
      });

      // Refresh list
      fetchMembers();
    } catch (err: any) {
      setAddError(err?.message || "Server error while creating member.");
      setAddLoading(false);
    }
  };

  // Handle Reset PIN
  const handleResetPin = async (member: GymMember) => {
    if (
      !confirm(
        `Are you sure you want to generate a new PIN for ${member.fullName} (${member.memberId})? The old PIN will immediately stop working.`
      )
    ) {
      return;
    }

    try {
      setResettingId(member.id);
      const res = await fetch(`/api/admin/members/${member.id}/reset-pin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.error || "Failed to reset PIN.");
        setResettingId(null);
        return;
      }

      setResettingId(null);

      // Open Credentials Modal with the newly generated PIN
      setCredentialsModal({
        isOpen: true,
        fullName: member.fullName,
        memberId: member.memberId,
        rawPin: data.newPin,
        type: "reset",
      });
    } catch (err: any) {
      alert(err?.message || "Network error resetting PIN.");
      setResettingId(null);
    }
  };

  // Handle Status Update
  const handleUpdateStatus = async (memberId: string, newStatus: MemberStatus) => {
    try {
      const res = await fetch(`/api/admin/members/${memberId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchMembers();
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // Handle Plan Assignment Update
  const handleUpdatePlan = async (memberId: string, newPlanId: string) => {
    try {
      setEditLoading(true);
      const res = await fetch(`/api/admin/members/${memberId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: newPlanId }),
      });
      if (res.ok) {
        setActiveEditMember(null);
        fetchMembers();
      }
    } catch (err) {
      console.error("Failed to update plan:", err);
    } finally {
      setEditLoading(false);
    }
  };

  // Copy credentials helper
  const handleCopyCredentials = () => {
    const text = `IRONSYNC GYM CREDENTIALS\nMember: ${credentialsModal.fullName}\nMember ID: ${credentialsModal.memberId}\nSecurity PIN: ${credentialsModal.rawPin}\nLogin URL: ${window.location.origin}/login?tab=member`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            Gym Member Roster
          </h1>
          <p className="text-xs sm:text-sm text-white/50">
            Create members, assign training blueprints, and manage access credentials.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              fullName: "",
              phone: "",
              email: "",
              pin: "",
              fitnessGoal: "hypertrophy",
              planId: "plan-hypertrophy-ppl",
              startDate: new Date().toISOString().split("T")[0],
              expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              dateOfBirth: "",
              gender: "male",
              notes: "",
            });
            setIsAddModalOpen(true);
          }}
          className="py-2.5 px-4 rounded-xl bg-[#FF1E1E] hover:bg-[#E01818] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#FF1E1E]/20 flex items-center justify-center gap-2 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          Add New Member
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#121212] border border-white/[0.08] flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, ID, or phone..."
            className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/[0.1] rounded-xl text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF1E1E]"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {["all", "active", "inactive", "suspended", "expired"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors ${
                statusFilter === st
                  ? "bg-white/[0.12] text-white font-bold border border-white/[0.15]"
                  : "text-white/50 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Members Table */}
      <div className="rounded-2xl bg-[#121212] border border-white/[0.08] overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-white/40 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#FF1E1E]" />
            <span className="text-xs font-mono">Querying member database...</span>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Users className="w-8 h-8 mx-auto text-white/30" />
            <div className="text-sm font-semibold text-white">No athletes found</div>
            <p className="text-xs text-white/40 max-w-xs mx-auto">
              {searchQuery || statusFilter !== "all"
                ? "Try clearing your filters or search terms."
                : "Get started by adding your first gym member."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/[0.08] bg-white/[0.02] text-white/50 font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Member ID</th>
                  <th className="py-3.5 px-4 font-semibold">Athlete</th>
                  <th className="py-3.5 px-4 font-semibold">Contact</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold">7-Day Attendance</th>
                  <th className="py-3.5 px-4 font-semibold">Assigned Blueprint</th>
                  <th className="py-3.5 px-4 font-semibold">Valid Until</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredMembers.map((member) => {
                  const plan = GYM_PLAN_TEMPLATES.find((p) => p.id === member.planId);
                  const isResetting = resettingId === member.id;

                  return (
                    <tr key={member.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Member ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        <span className="px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.08]">
                          {member.memberId}
                        </span>
                      </td>

                      {/* Athlete Name */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{member.fullName}</div>
                        <div className="text-[10px] text-white/40 uppercase font-mono">
                          Goal: {member.fitnessGoal}
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4 font-mono text-white/70">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-white/40" />
                          {member.phone}
                        </div>
                        {member.email && (
                          <div className="flex items-center gap-1.5 text-[10px] text-white/40 truncate max-w-[180px]">
                            <Mail className="w-3 h-3 text-white/30" />
                            {member.email}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <select
                          value={member.status}
                          onChange={(e) => handleUpdateStatus(member.id, e.target.value as MemberStatus)}
                          className={`text-[10px] font-mono uppercase px-2 py-1 rounded-full border bg-black cursor-pointer focus:outline-none ${
                            member.status === "active"
                              ? "text-emerald-400 border-emerald-500/30"
                              : member.status === "suspended"
                              ? "text-amber-400 border-amber-500/30"
                              : "text-red-400 border-red-500/30"
                          }`}
                        >
                          <option value="active">Active</option>
                          <option value="suspended">Suspended</option>
                          <option value="inactive">Inactive</option>
                          <option value="expired">Expired</option>
                        </select>
                      </td>

                      {/* 7-Day Attendance Dots */}
                      <td className="py-3.5 px-4">
                        <AttendanceDots
                          summary={getMemberWeekSummary(attendanceMap[member.id] || [])}
                          compact
                        />
                      </td>

                      {/* Assigned Plan */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => setActiveEditMember(member)}
                          className="flex items-center gap-1.5 text-white/80 hover:text-white hover:underline text-left group"
                          title="Click to change plan"
                        >
                          <Dumbbell className="w-3.5 h-3.5 text-[#FF1E1E]" />
                          <span className="truncate max-w-[160px]">
                            {plan?.name || member.planId || "Default Blueprint"}
                          </span>
                        </button>
                      </td>

                      {/* Expiry */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-white/60">
                        {member.expiryDate || "Ongoing"}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Quick Front Desk Attendance Action */}
                          {(() => {
                            const todayIST = new Intl.DateTimeFormat("en-CA", {
                              timeZone: "Asia/Kolkata",
                            }).format(new Date());
                            const isPresentToday = (attendanceMap[member.id] || []).some(
                              (r) => r.day === todayIST && r.status === "present"
                            );
                            const isMarking = markingAttendanceId === member.id;

                            if (isPresentToday) {
                              return (
                                <span
                                  className="px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold flex items-center gap-1"
                                  title="Member already checked in today"
                                >
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="hidden sm:inline">Present</span>
                                </span>
                              );
                            }

                            return (
                              <button
                                onClick={() => handleQuickMarkPresent(member)}
                                disabled={isMarking}
                                className="px-2 py-1 rounded-lg bg-white/[0.04] hover:bg-emerald-500/15 border border-white/[0.08] hover:border-emerald-500/40 text-white/70 hover:text-emerald-400 font-mono text-[10px] font-bold flex items-center gap-1 transition-all"
                                title="Quick Check-In: Mark Present"
                              >
                                {isMarking ? (
                                  <Loader2 className="w-3 h-3 animate-spin text-emerald-400" />
                                ) : (
                                  <UserCheck className="w-3 h-3 text-emerald-400" />
                                )}
                                <span className="hidden sm:inline">Check In</span>
                              </button>
                            );
                          })()}

                          {/* Reset PIN Action */}
                          <button
                            onClick={() => handleResetPin(member)}
                            disabled={isResetting}
                            className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.08] transition-colors"
                            title="Reset 4-Digit Security PIN"
                          >
                            {isResetting ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <KeyRound className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL 1: ADD NEW MEMBER */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#121212] border border-white/[0.12] rounded-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <div className="text-[10px] font-mono text-[#FF1E1E] uppercase tracking-wider">
                  Gym Registration
                </div>
                <h2 className="text-lg font-black uppercase text-white">Enroll New Member</h2>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {addError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{addError}</span>
              </div>
            )}

            <form onSubmit={handleCreateMember} className="space-y-4 text-xs">
              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-mono uppercase text-white/70">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. John Doe"
                    className="w-full p-2.5 bg-black/40 border border-white/[0.1] rounded-xl text-white focus:outline-none focus:border-[#FF1E1E]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono uppercase text-white/70">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 555-0199"
                    className="w-full p-2.5 bg-black/40 border border-white/[0.1] rounded-xl text-white focus:outline-none focus:border-[#FF1E1E]"
                  />
                </div>
              </div>

              {/* Email & Custom PIN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-mono uppercase text-white/70">Email (Optional)</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full p-2.5 bg-black/40 border border-white/[0.1] rounded-xl text-white focus:outline-none focus:border-[#FF1E1E]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono uppercase text-white/70 flex items-center justify-between">
                    <span>Initial PIN (Optional)</span>
                    <span className="text-[10px] text-white/40">Leave empty to auto-generate</span>
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={formData.pin}
                    onChange={(e) =>
                      setFormData({ ...formData, pin: e.target.value.replace(/\D/g, "").slice(0, 4) })
                    }
                    placeholder="Auto 4-digit"
                    className="w-full p-2.5 bg-black/40 border border-white/[0.1] rounded-xl font-mono text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF1E1E]"
                  />
                </div>
              </div>

              {/* Goal & Assigned Plan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-mono uppercase text-white/70">Fitness Goal</label>
                  <select
                    value={formData.fitnessGoal}
                    onChange={(e) => setFormData({ ...formData, fitnessGoal: e.target.value })}
                    className="w-full p-2.5 bg-black/40 border border-white/[0.1] rounded-xl text-white focus:outline-none focus:border-[#FF1E1E]"
                  >
                    <option value="hypertrophy">Muscle Hypertrophy</option>
                    <option value="fat_loss">Fat Loss & Conditioning</option>
                    <option value="strength">Strength & Power</option>
                    <option value="recomp">Athletic Body Recomp</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono uppercase text-white/70">Assigned Plan</label>
                  <select
                    value={formData.planId}
                    onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
                    className="w-full p-2.5 bg-black/40 border border-white/[0.1] rounded-xl text-white focus:outline-none focus:border-[#FF1E1E]"
                  >
                    {GYM_PLAN_TEMPLATES.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.trainingDays}d)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-mono uppercase text-white/70">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full p-2.5 bg-black/40 border border-white/[0.1] rounded-xl text-white focus:outline-none focus:border-[#FF1E1E]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono uppercase text-white/70">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full p-2.5 bg-black/40 border border-white/[0.1] rounded-xl text-white focus:outline-none focus:border-[#FF1E1E]"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="font-mono uppercase text-white/70">Internal Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Medical history, locker number, or custom goals..."
                  className="w-full p-2.5 bg-black/40 border border-white/[0.1] rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF1E1E]"
                />
              </div>

              <div className="pt-3 border-t border-white/[0.08] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/[0.1] text-white/70 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="px-5 py-2.5 rounded-xl bg-[#FF1E1E] hover:bg-[#E01818] text-white font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#FF1E1E]/25"
                >
                  {addLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  Register & Generate ID
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CREDENTIALS POPUP (SHOWN ONCE) */}
      {credentialsModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg">
          <div className="w-full max-w-md bg-[#111111] border-2 border-[#FF1E1E] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#FF1E1E]/10 border border-[#FF1E1E]/30 flex items-center justify-center text-[#FF1E1E]">
                <KeyRound className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight text-white">
                {credentialsModal.type === "new" ? "Member Enrolled Successfully" : "PIN Reset Successfully"}
              </h2>
              <p className="text-xs text-white/60">
                Deliver these login credentials securely to the athlete.
              </p>
            </div>

            {/* Credentials Card */}
            <div className="p-5 rounded-xl bg-black border border-white/[0.12] space-y-3 font-mono">
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/50 uppercase">Athlete Name:</span>
                <span className="text-white font-bold">{credentialsModal.fullName}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/50 uppercase">Member ID:</span>
                <span className="text-[#FF1E1E] font-extrabold text-sm px-2 py-0.5 rounded bg-white/[0.05]">
                  {credentialsModal.memberId}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/50 uppercase">Temporary PIN:</span>
                <span className="text-emerald-400 font-black text-lg tracking-widest px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                  {credentialsModal.rawPin}
                </span>
              </div>
            </div>

            {/* Security Warning */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2.5 leading-relaxed">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>SECURITY PROTOCOL:</strong> This 4-digit PIN is displayed only once. It is stored exclusively as an encrypted scrypt hash. If forgotten, an administrator must generate a new PIN.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleCopyCredentials}
                className="py-2.5 px-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-white font-semibold text-xs flex items-center justify-center gap-2 border border-white/[0.1]"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied to Clipboard!" : "Copy Details"}
              </button>

              <button
                type="button"
                onClick={() => setCredentialsModal({ ...credentialsModal, isOpen: false })}
                className="py-2.5 px-3 rounded-xl bg-[#FF1E1E] hover:bg-[#E01818] text-white font-bold text-xs uppercase tracking-wider"
              >
                Done / Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: ASSIGN PLAN MODAL */}
      {activeEditMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#121212] border border-white/[0.12] rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div>
                <h3 className="text-base font-bold uppercase text-white">Assign Training Blueprint</h3>
                <p className="text-xs text-white/50">{activeEditMember.fullName} ({activeEditMember.memberId})</p>
              </div>
              <button
                onClick={() => setActiveEditMember(null)}
                className="p-1 rounded-lg text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {GYM_PLAN_TEMPLATES.map((tpl) => {
                const isCurrent = activeEditMember.planId === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    onClick={() => handleUpdatePlan(activeEditMember.id, tpl.id)}
                    disabled={editLoading}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                      isCurrent
                        ? "bg-[#FF1E1E]/10 border-[#FF1E1E] text-white"
                        : "bg-black/40 border-white/[0.08] text-white/80 hover:border-white/20"
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs uppercase">{tpl.name}</div>
                      <div className="text-[11px] text-white/50 font-mono">
                        {tpl.trainingDays} days &bull; {tpl.goal}
                      </div>
                    </div>
                    {isCurrent && <Check className="w-4 h-4 text-[#FF1E1E]" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveEditMember(null)}
                className="px-4 py-2 rounded-xl border border-white/[0.1] text-xs text-white/70"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MembersPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 flex justify-center text-white">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF1E1E]" />
        </div>
      }
    >
      <MembersManager />
    </Suspense>
  );
}
