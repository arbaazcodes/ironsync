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
  Edit,
  FileEdit,
  FileText,
  Clock3,
  History,
} from "lucide-react";
import { GymMember, MemberStatus, CreateMemberInput } from "@/lib/types/member";
import { AttendanceRecord, DayAttendanceSummary } from "@/lib/types/attendance";
import { ChangeRequestWithMember } from "@/lib/types/changeRequest";
import { AttendanceDots } from "@/components/dashboard/AttendanceDots";
import { GYM_PLAN_TEMPLATES } from "@/lib/data/gymPlans";
import { ChangeRequestsDrawer } from "@/components/admin/ChangeRequestsDrawer";
import { DirectEditMemberModal } from "@/components/admin/DirectEditMemberModal";
import { MemberAuditHistoryModal } from "@/components/admin/MemberAuditHistoryModal";

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

  // Change Requests Drawer State
  const [changeRequests, setChangeRequests] = useState<ChangeRequestWithMember[]>([]);
  const [isChangeDrawerOpen, setIsChangeDrawerOpen] = useState(false);
  const [selectedChangeRequestId, setSelectedChangeRequestId] = useState<string | null>(null);

  // Direct Edit Member Modal State
  const [directEditMember, setDirectEditMember] = useState<GymMember | null>(null);

  // Audit History Modal State
  const [auditMember, setAuditMember] = useState<GymMember | null>(null);

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

  // Fetch Members with Batch Attendance and Change Requests
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const [membersRes, reqRes] = await Promise.all([
        fetch("/api/admin/members?includeAttendance=true"),
        fetch("/api/admin/change-requests"),
      ]);

      if (membersRes.ok) {
        const data = await membersRes.json();
        setMembers(data.members || []);
        if (data.attendance) {
          setAttendanceMap(data.attendance);
        }
      }

      if (reqRes.ok) {
        const reqData = await reqRes.json();
        setChangeRequests(reqData.requests || []);
      }
    } catch (err) {
      console.error("Error fetching members or change requests:", err);
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
    const text = `Member ID: ${credentialsModal.memberId} | PIN: ${credentialsModal.rawPin}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Close and purge plain PIN from client state
  const handleCloseCredentials = () => {
    setCredentialsModal({
      isOpen: false,
      fullName: "",
      memberId: "",
      rawPin: "",
      type: "new",
    });
    setCopied(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-primary">
            Gym Member Roster
          </h1>
          <p className="text-xs sm:text-sm text-primary-muted">
            Create members, assign training blueprints, and manage access credentials.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Change Requests Queue Button */}
          <button
            type="button"
            onClick={() => {
              setSelectedChangeRequestId(null);
              setIsChangeDrawerOpen(true);
            }}
            className="py-2.5 px-4 rounded-xl bg-surface-elevated hover:bg-surface border border-border text-primary font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer relative"
          >
            <FileEdit className="w-4 h-4 text-accent" />
            <span>Change Requests</span>
            {changeRequests.filter((r) => r.status === "pending").length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-accent text-white text-[10px] font-mono font-bold">
                {changeRequests.filter((r) => r.status === "pending").length}
              </span>
            )}
          </button>

          <button
            type="button"
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
            className="py-2.5 px-4 rounded-xl bg-accent hover:bg-accent-hover text-white font-bold text-xs uppercase tracking-wider shadow-accent-glow flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Member</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-card border border-border shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-dim" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, ID, or phone..."
            className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-xl text-xs text-primary placeholder:text-primary-dim focus:outline-none focus:border-accent"
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
                  ? "bg-accent text-white font-bold shadow-sm"
                  : "text-primary-muted hover:text-primary hover:bg-surface-elevated"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Members Table */}
      <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-primary-dim gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-accent" />
            <span className="text-xs font-mono">Querying member database...</span>
          </div>
        ) : members.length === 0 ? (
          <div className="py-20 text-center space-y-4 max-w-sm mx-auto px-4">
            <div className="w-12 h-12 rounded-2xl bg-surface-elevated border border-border flex items-center justify-center mx-auto text-primary-dim">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-primary uppercase tracking-tight">
                No members on the roster yet.
              </h3>
              <p className="text-xs text-primary-muted leading-relaxed">
                Start by adding your first gym member to issue their access credentials.
              </p>
            </div>
            <button
              type="button"
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
              className="py-2.5 px-5 rounded-xl bg-accent hover:bg-accent-hover text-white font-bold text-xs uppercase tracking-wider shadow-accent-glow inline-flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Member</span>
            </button>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Users className="w-8 h-8 mx-auto text-primary-dim" />
            <div className="text-sm font-semibold text-primary">No matching members found</div>
            <p className="text-xs text-primary-muted max-w-xs mx-auto">
              Try clearing your search terms or status filter.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Cards View (< 768px) */}
            <div className="block md:hidden divide-y divide-border/60">
              {filteredMembers.map((member) => {
                const plan = GYM_PLAN_TEMPLATES.find((p) => p.id === member.planId);
                const isResetting = resettingId === member.id;
                const memberPendingReq = changeRequests.find(
                  (r) => (r.memberUuid === member.id || r.memberId === member.memberId) && r.status === "pending"
                );
                const todayIST = new Intl.DateTimeFormat("en-CA", {
                  timeZone: "Asia/Kolkata",
                }).format(new Date());
                const isPresentToday = (attendanceMap[member.id] || []).some(
                  (r) => r.day === todayIST && r.status === "present"
                );
                const isMarking = markingAttendanceId === member.id;

                return (
                  <div key={member.id} className="p-4 space-y-3 bg-card hover:bg-surface-elevated/40 transition-colors">
                    {/* Header: Member ID & Status */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-surface-elevated border border-border text-primary">
                        {member.memberId}
                      </span>

                      <select
                        value={member.status}
                        onChange={(e) => handleUpdateStatus(member.id, e.target.value as MemberStatus)}
                        className={`text-[10px] font-mono uppercase px-2 py-1 rounded-full border bg-surface cursor-pointer focus:outline-none ${
                          member.status === "active"
                            ? "text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                            : member.status === "suspended"
                            ? "text-amber-600 dark:text-amber-400 border-amber-500/30"
                            : "text-rose-500 border-rose-500/30"
                        }`}
                      >
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                        <option value="inactive">Inactive</option>
                        <option value="expired">Expired</option>
                      </select>
                    </div>

                    {/* Athlete Name & Goal */}
                    <div>
                      <div className="font-bold text-sm text-primary flex items-center gap-2 flex-wrap">
                        <span>{member.fullName}</span>
                        {memberPendingReq && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedChangeRequestId(memberPendingReq.id);
                              setIsChangeDrawerOpen(true);
                            }}
                            className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 font-mono text-[9px] font-bold uppercase tracking-wider flex items-center gap-1"
                          >
                            <Clock className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400 animate-pulse" />
                            <span>Pending Edit</span>
                          </button>
                        )}
                      </div>
                      <div className="text-[11px] text-primary-dim uppercase font-mono mt-0.5">
                        Goal: {member.fitnessGoal} &bull; Blueprint: {plan?.name || member.planId || "Default"}
                      </div>
                    </div>

                    {/* Contact & Attendance */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-border/40 text-xs">
                      <div className="flex items-center gap-3 font-mono text-primary-muted text-[11px]">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-primary-dim" />
                          {member.phone}
                        </span>
                      </div>
                      <AttendanceDots
                        summary={getMemberWeekSummary(attendanceMap[member.id] || [])}
                        compact
                      />
                    </div>

                    {/* Actions Row */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/60">
                      {isPresentToday ? (
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Present Today</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleQuickMarkPresent(member)}
                          disabled={isMarking}
                          className="px-3 py-1.5 rounded-xl bg-surface-elevated hover:bg-emerald-500/15 border border-border hover:border-emerald-500/40 text-primary hover:text-emerald-600 font-mono text-xs font-bold flex items-center gap-1.5 transition-all"
                        >
                          {isMarking ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                          ) : (
                            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                          <span>Check In</span>
                        </button>
                      )}

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setDirectEditMember(member)}
                          className="p-2 rounded-xl bg-surface-elevated border border-border text-primary-muted hover:text-primary transition-colors"
                          title="Edit Member"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setAuditMember(member)}
                          className="p-2 rounded-xl bg-surface-elevated border border-border text-primary-muted hover:text-accent transition-colors"
                          title="Audit History"
                        >
                          <History className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleResetPin(member)}
                          disabled={isResetting}
                          className="p-2 rounded-xl bg-surface-elevated border border-border text-primary-muted hover:text-primary transition-colors"
                          title="Reset PIN"
                        >
                          {isResetting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <KeyRound className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View (>= 768px) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-surface text-primary-dim font-mono uppercase text-[10px]">
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
              <tbody className="divide-y divide-border/60">
                {filteredMembers.map((member) => {
                  const plan = GYM_PLAN_TEMPLATES.find((p) => p.id === member.planId);
                  const isResetting = resettingId === member.id;
                  const memberPendingReq = changeRequests.find(
                    (r) => (r.memberUuid === member.id || r.memberId === member.memberId) && r.status === "pending"
                  );

                  return (
                    <tr key={member.id} className="hover:bg-surface-elevated/50 transition-colors">
                      {/* Member ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-primary">
                        <span className="px-2 py-0.5 rounded bg-surface-elevated border border-border">
                          {member.memberId}
                        </span>
                      </td>

                      {/* Athlete Name */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-primary flex items-center gap-2 flex-wrap">
                          <span>{member.fullName}</span>
                          {memberPendingReq && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedChangeRequestId(memberPendingReq.id);
                                setIsChangeDrawerOpen(true);
                              }}
                              className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 font-mono text-[9px] font-bold uppercase tracking-wider hover:bg-amber-500/25 transition-colors cursor-pointer flex items-center gap-1"
                              title="Review Pending Profile Change Request"
                            >
                              <Clock className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400 animate-pulse" />
                              <span>Pending Edit</span>
                            </button>
                          )}
                        </div>
                        <div className="text-[10px] text-primary-dim uppercase font-mono">
                          Goal: {member.fitnessGoal}
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4 font-mono text-primary-muted">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-primary-dim" />
                          {member.phone}
                        </div>
                        {member.email && (
                          <div className="flex items-center gap-1.5 text-[10px] text-primary-dim truncate max-w-[180px]">
                            <Mail className="w-3 h-3 text-primary-dim" />
                            {member.email}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <select
                          value={member.status}
                          onChange={(e) => handleUpdateStatus(member.id, e.target.value as MemberStatus)}
                          className={`text-[10px] font-mono uppercase px-2 py-1 rounded-full border bg-surface cursor-pointer focus:outline-none ${
                            member.status === "active"
                              ? "text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                              : member.status === "suspended"
                              ? "text-amber-600 dark:text-amber-400 border-amber-500/30"
                              : "text-rose-500 border-rose-500/30"
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
                          className="flex items-center gap-1.5 text-primary-muted hover:text-primary hover:underline text-left group"
                          title="Click to change plan"
                        >
                          <Dumbbell className="w-3.5 h-3.5 text-accent" />
                          <span className="truncate max-w-[160px]">
                            {plan?.name || member.planId || "Default Blueprint"}
                          </span>
                        </button>
                      </td>

                      {/* Expiry */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-primary-muted">
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
                                  className="px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold flex items-center gap-1"
                                  title="Member already checked in today"
                                >
                                  <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                  <span className="hidden sm:inline">Present</span>
                                </span>
                              );
                            }

                            return (
                              <button
                                onClick={() => handleQuickMarkPresent(member)}
                                disabled={isMarking}
                                className="px-2 py-1 rounded-lg bg-surface-elevated hover:bg-emerald-500/15 border border-border hover:border-emerald-500/40 text-primary-muted hover:text-emerald-600 dark:hover:text-emerald-400 font-mono text-[10px] font-bold flex items-center gap-1 transition-all"
                                title="Quick Check-In: Mark Present"
                              >
                                {isMarking ? (
                                  <Loader2 className="w-3 h-3 animate-spin text-emerald-600 dark:text-emerald-400" />
                                ) : (
                                  <UserCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                )}
                                <span className="hidden sm:inline">Check In</span>
                              </button>
                            );
                          })()}

                          {/* Review Pending Request Action */}
                          {memberPendingReq && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedChangeRequestId(memberPendingReq.id);
                                setIsChangeDrawerOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25 transition-colors cursor-pointer"
                              title="Review Pending Change Request"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Direct Edit Member Record */}
                          <button
                            type="button"
                            onClick={() => setDirectEditMember(member)}
                            className="p-1.5 rounded-lg bg-surface-elevated border border-border text-primary-muted hover:text-primary hover:bg-surface transition-colors cursor-pointer"
                            title="Directly Edit Member Profile"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {/* Audit History Timeline Action */}
                          <button
                            type="button"
                            onClick={() => setAuditMember(member)}
                            className="p-1.5 rounded-lg bg-surface-elevated border border-border text-primary-muted hover:text-accent hover:bg-surface transition-colors cursor-pointer"
                            title="View Member Audit History"
                          >
                            <History className="w-3.5 h-3.5 text-accent" />
                          </button>

                          {/* Reset PIN Action */}
                          <button
                            type="button"
                            onClick={() => handleResetPin(member)}
                            disabled={isResetting}
                            className="p-1.5 rounded-lg bg-surface-elevated border border-border text-primary-muted hover:text-primary hover:bg-surface transition-colors cursor-pointer"
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
        </>
      )}
    </div>

      {/* MODAL 1: ADD NEW MEMBER */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-lg bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <div className="text-[10px] font-mono text-accent uppercase tracking-wider font-bold">
                  Gym Registration
                </div>
                <h2 className="text-lg font-extrabold uppercase text-primary">Enroll New Member</h2>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-primary-muted hover:text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {addError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{addError}</span>
              </div>
            )}

            <form onSubmit={handleCreateMember} className="space-y-4 text-xs">
              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-mono uppercase text-primary-muted">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. John Doe"
                    className="w-full p-2.5 bg-surface border border-border rounded-xl text-primary focus:outline-none focus:border-accent"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono uppercase text-primary-muted">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 555-0199"
                    className="w-full p-2.5 bg-surface border border-border rounded-xl text-primary focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Email & Custom PIN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-mono uppercase text-primary-muted">Email (Optional)</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full p-2.5 bg-surface border border-border rounded-xl text-primary focus:outline-none focus:border-accent"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono uppercase text-primary-muted flex items-center justify-between">
                    <span>Initial PIN (Optional)</span>
                    <span className="text-[10px] text-primary-dim">Leave empty to auto-generate</span>
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={formData.pin}
                    onChange={(e) =>
                      setFormData({ ...formData, pin: e.target.value.replace(/\D/g, "").slice(0, 4) })
                    }
                    placeholder="Auto 4-digit"
                    className="w-full p-2.5 bg-surface border border-border rounded-xl font-mono text-primary placeholder:text-primary-dim focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Goal & Assigned Plan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-mono uppercase text-primary-muted">Fitness Goal</label>
                  <select
                    value={formData.fitnessGoal}
                    onChange={(e) => setFormData({ ...formData, fitnessGoal: e.target.value })}
                    className="w-full p-2.5 bg-surface border border-border rounded-xl text-primary focus:outline-none focus:border-accent"
                  >
                    <option value="hypertrophy">Muscle Hypertrophy</option>
                    <option value="fat_loss">Fat Loss & Conditioning</option>
                    <option value="strength">Strength & Power</option>
                    <option value="recomp">Athletic Body Recomp</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono uppercase text-primary-muted">Assigned Plan</label>
                  <select
                    value={formData.planId}
                    onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
                    className="w-full p-2.5 bg-surface border border-border rounded-xl text-primary focus:outline-none focus:border-accent"
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
                  <label className="font-mono uppercase text-primary-muted">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full p-2.5 bg-surface border border-border rounded-xl text-primary focus:outline-none focus:border-accent"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono uppercase text-primary-muted">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full p-2.5 bg-surface border border-border rounded-xl text-primary focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="font-mono uppercase text-primary-muted">Internal Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Medical history, locker number, or custom goals..."
                  className="w-full p-2.5 bg-surface border border-border rounded-xl text-primary placeholder:text-primary-dim focus:outline-none focus:border-accent"
                />
              </div>

              <div className="pt-3 border-t border-border flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-border text-primary-muted hover:text-primary hover:bg-surface-elevated transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white font-bold uppercase tracking-wider flex items-center gap-2 shadow-accent-glow transition-all"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-lg">
          <div className="w-full max-w-md bg-card border-2 border-accent rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 mx-auto rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
                <KeyRound className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-extrabold uppercase tracking-tight text-primary">
                {credentialsModal.type === "new" ? "Member Enrolled Successfully" : "PIN Reset Successfully"}
              </h2>
              <p className="text-xs text-primary-muted">
                Deliver these login credentials securely to the athlete.
              </p>
            </div>

            {/* Credentials Card */}
            <div className="p-5 rounded-xl bg-surface-elevated border border-border space-y-3 font-mono">
              <div className="flex justify-between items-center text-xs">
                <span className="text-primary-muted uppercase">Athlete Name:</span>
                <span className="text-primary font-bold">{credentialsModal.fullName}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-primary-muted uppercase">Member ID:</span>
                <span className="text-accent font-extrabold text-sm px-2 py-0.5 rounded bg-accent/10 border border-accent/20">
                  {credentialsModal.memberId}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-primary-muted uppercase">Temporary PIN:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-black text-lg tracking-widest px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                  {credentialsModal.rawPin}
                </span>
              </div>
            </div>

            {/* Security Warning */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5 leading-relaxed">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
              <span>
                This 4-digit PIN is only shown once. Copy and share it directly with the member.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleCopyCredentials}
                className="py-2.5 px-3 rounded-xl bg-surface-elevated hover:bg-surface text-primary font-semibold text-xs flex items-center justify-center gap-2 border border-border transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Copied!" : "Copy Details"}</span>
              </button>

              <button
                type="button"
                onClick={handleCloseCredentials}
                className="py-2.5 px-3 rounded-xl bg-accent hover:bg-accent-hover text-white font-bold text-xs uppercase tracking-wider shadow-accent-glow transition-all cursor-pointer"
              >
                Done / Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: ASSIGN PLAN MODAL */}
      {activeEditMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-base font-bold uppercase text-primary">Assign Training Blueprint</h3>
                <p className="text-xs text-primary-muted">{activeEditMember.fullName} ({activeEditMember.memberId})</p>
              </div>
              <button
                onClick={() => setActiveEditMember(null)}
                className="p-1 rounded-lg text-primary-muted hover:text-primary"
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
                        ? "bg-accent/10 border-accent text-primary"
                        : "bg-surface border-border text-primary hover:border-accent/40"
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs uppercase">{tpl.name}</div>
                      <div className="text-[11px] text-primary-dim font-mono">
                        {tpl.trainingDays} days &bull; {tpl.goal}
                      </div>
                    </div>
                    {isCurrent && <Check className="w-4 h-4 text-accent" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveEditMember(null)}
                className="px-4 py-2 rounded-xl border border-border text-xs text-primary-muted hover:text-primary hover:bg-surface-elevated transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: CHANGE REQUESTS REVIEW DRAWER */}
      <ChangeRequestsDrawer
        isOpen={isChangeDrawerOpen}
        onClose={() => setIsChangeDrawerOpen(false)}
        requests={changeRequests}
        initialSelectedId={selectedChangeRequestId}
        onReviewed={() => {
          fetchMembers();
        }}
      />

      {/* MODAL 5: DIRECT EDIT MEMBER RECORD */}
      {directEditMember && (
        <DirectEditMemberModal
          isOpen={!!directEditMember}
          onClose={() => setDirectEditMember(null)}
          member={directEditMember}
          onSaved={() => {
            fetchMembers();
          }}
        />
      )}

      {/* MODAL 6: MEMBER AUDIT HISTORY TIMELINE */}
      <MemberAuditHistoryModal
        isOpen={auditMember !== null}
        onClose={() => setAuditMember(null)}
        member={auditMember}
      />
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
