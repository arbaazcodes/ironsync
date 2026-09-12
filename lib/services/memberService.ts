import crypto from "crypto";
import { getSupabase } from "../supabase/client";
import {
  GymMember,
  CreateMemberInput,
  UpdateMemberInput,
  MemberStatus,
  MemberDashboardData,
} from "../types/member";
import {
  hashPin,
  verifyPin,
  generateRandomPin,
  formatMemberId,
  parseMemberIdSequence,
} from "../security/pinSecurity";
import { getGymPlanTemplate, GYM_PLAN_TEMPLATES } from "../data/gymPlans";
import { generateMealPlan } from "../engine/mealGenerator";

// In-memory fallback cache to ensure zero-downtime during testing, local runs, or initial setup
const MEMORY_MEMBERS: Map<string, GymMember> = new Map();

/**
 * Returns the current maximum sequence number for the given year to safely increment Member IDs.
 */
export async function getNextMemberSequence(year: number = 2026): Promise<number> {
  const supabase = getSupabase();
  let maxSeq = 0;

  // 1. Check database if connected
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("members")
        .select("member_id")
        .like("member_id", `IS-${year}-%`);

      if (!error && Array.isArray(data)) {
        for (const row of data) {
          const seq = parseMemberIdSequence(row.member_id);
          if (seq && seq > maxSeq) maxSeq = seq;
        }
      }
    } catch (err) {
      // Fall through to memory store
    }
  }

  // 2. Check in-memory store
  for (const member of MEMORY_MEMBERS.values()) {
    const seq = parseMemberIdSequence(member.memberId);
    if (seq && seq > maxSeq) maxSeq = seq;
  }

  return maxSeq + 1;
}

/**
 * Creates a new gym member.
 * Returns the created member and the raw temporary PIN (displayed ONCE to the admin).
 */
export async function createMember(
  input: CreateMemberInput,
  adminUserId?: string | null
): Promise<{ member: GymMember; rawPin: string }> {
  const fullName = input.fullName?.trim();
  const phone = input.phone?.trim();

  if (!fullName) {
    throw new Error("Full name is required.");
  }
  if (!phone || phone.length < 7) {
    throw new Error("A valid phone number is required.");
  }

  // 1. Generate next Member ID on server
  const nextSeq = await getNextMemberSequence(2026);
  const memberId = formatMemberId(nextSeq, 2026);

  // 2. Generate or validate PIN
  const rawPin = input.pin && /^\d{4}$/.test(input.pin.trim())
    ? input.pin.trim()
    : generateRandomPin();

  // 3. Hash PIN securely (NEVER store plaintext)
  const pinHash = hashPin(rawPin);

  const now = new Date().toISOString();
  const startDate = input.startDate || now.split("T")[0];
  // Default expiry date: 1 year from start date if omitted
  const expiryDate = input.expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const assignedPlanId = input.planId || GYM_PLAN_TEMPLATES[0].id;

  const newMember: GymMember = {
    id: crypto.randomUUID(),
    memberId,
    fullName,
    phone,
    email: input.email?.trim() || null,
    pinHash,
    status: "active",
    fitnessGoal: input.fitnessGoal || "muscle_gain",
    planId: assignedPlanId,
    startDate,
    expiryDate,
    dateOfBirth: input.dateOfBirth || null,
    gender: input.gender || null,
    notes: input.notes?.trim() || null,
    createdBy: adminUserId || null,
    createdAt: now,
    updatedAt: now,
    lastLoginAt: null,
  };

  // 4. Persist to Supabase if available
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.from("members").insert({
        id: newMember.id,
        member_id: newMember.memberId,
        full_name: newMember.fullName,
        phone: newMember.phone,
        email: newMember.email,
        pin_hash: newMember.pinHash,
        status: newMember.status,
        fitness_goal: newMember.fitnessGoal,
        plan_id: newMember.planId?.startsWith("plan-") ? null : newMember.planId,
        start_date: newMember.startDate,
        expiry_date: newMember.expiryDate,
        date_of_birth: newMember.dateOfBirth,
        gender: newMember.gender,
        notes: newMember.notes,
        created_by: newMember.createdBy,
        created_at: newMember.createdAt,
        updated_at: newMember.updatedAt,
      });
    } catch (err) {
      console.warn("Could not insert member into Supabase table (using memory cache fallback):", err);
    }
  }

  // 5. Store in memory fallback
  MEMORY_MEMBERS.set(newMember.id, newMember);
  MEMORY_MEMBERS.set(newMember.memberId.toUpperCase(), newMember);

  return { member: newMember, rawPin };
}

/**
 * Retrieves members for the admin directory with search and status filtering.
 */
export async function getMembers(
  optionsOrUserId?: any,
  maybeFilters?: { search?: string; status?: MemberStatus | "all"; sortBy?: string; sortOrder?: string }
): Promise<GymMember[]> {
  const filters =
    typeof optionsOrUserId === "object" && optionsOrUserId !== null
      ? optionsOrUserId
      : maybeFilters || {};

  const supabase = getSupabase();
  let membersList: GymMember[] = [];

  if (supabase) {
    try {
      let query = supabase.from("members").select("*").order("created_at", { ascending: false });

      if (filters?.status && filters.status !== "all") {
        query = query.eq("status", filters.status);
      }

      const { data, error } = await query;
      if (!error && Array.isArray(data)) {
        membersList = data.map((row: any) => ({
          id: row.id,
          memberId: row.member_id,
          fullName: row.full_name,
          phone: row.phone,
          email: row.email,
          pinHash: row.pin_hash,
          status: row.status,
          fitnessGoal: row.fitness_goal,
          planId: row.plan_id,
          startDate: row.start_date,
          expiryDate: row.expiry_date,
          dateOfBirth: row.date_of_birth,
          gender: row.gender,
          notes: row.notes,
          createdBy: row.created_by,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          lastLoginAt: row.last_login_at,
        }));
      }
    } catch (err) {
      // Use memory fallback
    }
  }

  // Fallback / merge with memory store
  if (membersList.length === 0) {
    const uniqueMap = new Map<string, GymMember>();
    for (const member of MEMORY_MEMBERS.values()) {
      uniqueMap.set(member.id, member);
    }
    membersList = Array.from(uniqueMap.values());
  }

  // Apply search query filter
  if (filters?.search) {
    const q = filters.search.toLowerCase().trim();
    membersList = membersList.filter(
      (m) =>
        m.fullName.toLowerCase().includes(q) ||
        m.memberId.toLowerCase().includes(q) ||
        m.phone.toLowerCase().includes(q) ||
        (m.email && m.email.toLowerCase().includes(q))
    );
  }

  // Apply status filter
  if (filters?.status && filters.status !== "all") {
    membersList = membersList.filter((m) => m.status === filters.status);
  }

  return membersList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Finds a member by primary UUID or Member ID.
 */
export async function getMemberById(id: string): Promise<GymMember | null> {
  if (!id) return null;

  // Check in-memory store
  const mem = MEMORY_MEMBERS.get(id) || MEMORY_MEMBERS.get(id.toUpperCase());
  if (mem) return mem;

  const supabase = getSupabase();
  if (supabase) {
    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      const query = isUuid
        ? supabase.from("members").select("*").eq("id", id)
        : supabase.from("members").select("*").eq("member_id", id.toUpperCase());

      const { data, error } = await query.maybeSingle();
      if (!error && data) {
        return {
          id: data.id,
          memberId: data.member_id,
          fullName: data.full_name,
          phone: data.phone,
          email: data.email,
          pinHash: data.pin_hash,
          status: data.status as MemberStatus,
          fitnessGoal: data.fitness_goal,
          planId: data.plan_id,
          startDate: data.start_date,
          expiryDate: data.expiry_date,
          dateOfBirth: data.date_of_birth,
          gender: data.gender,
          notes: data.notes,
          createdBy: data.created_by,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          lastLoginAt: data.last_login_at,
        };
      }
    } catch (err) {
      // Memory fallback
    }
  }

  return null;
}

/**
 * Resolves a member by either UUID id or Member ID (e.g. "IS-2026-0001").
 */
async function resolveMember(idOrMemberId: string): Promise<GymMember | null> {
  if (!idOrMemberId) return null;
  const byId = await getMemberById(idOrMemberId);
  if (byId) return byId;
  return getMemberByMemberId(idOrMemberId, true);
}

/**
 * Finds a member by Member ID (case-insensitive) e.g. "IS-2026-0001".
 */
export async function getMemberByMemberId(
  memberId: string,
  includePinHash: boolean = false
): Promise<GymMember | null> {
  if (!memberId) return null;
  const cleanId = memberId.trim().toUpperCase();

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("member_id", cleanId)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          memberId: data.member_id,
          fullName: data.full_name,
          phone: data.phone,
          email: data.email,
          pinHash: data.pin_hash,
          status: data.status as MemberStatus,
          fitnessGoal: data.fitness_goal,
          planId: data.plan_id,
          startDate: data.start_date,
          expiryDate: data.expiry_date,
          dateOfBirth: data.date_of_birth,
          gender: data.gender,
          notes: data.notes,
          createdBy: data.created_by,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          lastLoginAt: data.last_login_at,
        };
      }
    } catch (err) {
      // Memory fallback
    }
  }

  const memoryMatch = MEMORY_MEMBERS.get(cleanId);
  return memoryMatch || null;
}

/**
 * Resets a member's PIN.
 * Generates a new 4-digit PIN, updates pin_hash, invalidates the old PIN.
 * Returns the raw new PIN to be displayed ONCE to the admin.
 */
export async function resetMemberPin(
  idOrMemberId: string,
  customPin?: string
): Promise<{ success: boolean; member: GymMember; newPin: string }> {
  const member = await resolveMember(idOrMemberId);
  if (!member) {
    throw new Error("Member not found.");
  }

  const newPin = customPin && /^\d{4}$/.test(customPin.trim())
    ? customPin.trim()
    : generateRandomPin();
  const newPinHash = hashPin(newPin);
  const now = new Date().toISOString();

  member.pinHash = newPinHash;
  member.updatedAt = now;

  MEMORY_MEMBERS.set(member.id, member);
  MEMORY_MEMBERS.set(member.memberId.toUpperCase(), member);

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase
        .from("members")
        .update({ pin_hash: newPinHash, updated_at: now })
        .eq("member_id", member.memberId);
    } catch (err) {
      // Handled
    }
  }

  return { success: true, member, newPin };
}

/**
 * Updates a member's status ('active' | 'inactive' | 'suspended' | 'expired').
 */
export async function updateMemberStatus(
  idOrMemberId: string,
  newStatus: MemberStatus,
  adminUserId?: string | null
): Promise<GymMember> {
  const member = await resolveMember(idOrMemberId);
  if (!member) {
    throw new Error("Member not found.");
  }

  const now = new Date().toISOString();
  member.status = newStatus;
  member.updatedAt = now;

  MEMORY_MEMBERS.set(member.id, member);
  MEMORY_MEMBERS.set(member.memberId.toUpperCase(), member);

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase
        .from("members")
        .update({ status: newStatus, updated_at: now })
        .eq("member_id", member.memberId);
    } catch (err) {
      // Handled
    }
  }

  return member;
}

/**
 * Assigns or switches a plan for a member.
 */
export async function assignPlanToMember(
  idOrMemberId: string,
  planId: string,
  adminUserId?: string | null
): Promise<GymMember> {
  const member = await resolveMember(idOrMemberId);
  if (!member) {
    throw new Error("Member not found.");
  }

  const now = new Date().toISOString();
  member.planId = planId;
  member.updatedAt = now;

  MEMORY_MEMBERS.set(member.id, member);
  MEMORY_MEMBERS.set(member.memberId.toUpperCase(), member);

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase
        .from("members")
        .update({ plan_id: planId.startsWith("plan-") ? null : planId, updated_at: now })
        .eq("member_id", member.memberId);
    } catch (err) {
      // Handled
    }
  }

  return member;
}

/**
 * Updates general fields on a member record.
 */
export async function updateMember(
  idOrMemberId: string,
  input: UpdateMemberInput
): Promise<GymMember | null> {
  const member = await resolveMember(idOrMemberId);
  if (!member) return null;

  const now = new Date().toISOString();
  if (input.fullName !== undefined) member.fullName = input.fullName.trim();
  if (input.phone !== undefined) member.phone = input.phone.trim();
  if (input.email !== undefined) member.email = input.email ? input.email.trim() : null;
  if (input.status !== undefined) member.status = input.status;
  if (input.fitnessGoal !== undefined) member.fitnessGoal = input.fitnessGoal;
  if (input.planId !== undefined) member.planId = input.planId;
  if (input.expiryDate !== undefined) member.expiryDate = input.expiryDate;
  if (input.notes !== undefined) member.notes = input.notes;
  member.updatedAt = now;

  MEMORY_MEMBERS.set(member.id, member);
  MEMORY_MEMBERS.set(member.memberId.toUpperCase(), member);

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase
        .from("members")
        .update({
          full_name: member.fullName,
          phone: member.phone,
          email: member.email,
          status: member.status,
          fitness_goal: member.fitnessGoal,
          plan_id: member.planId?.startsWith("plan-") ? null : member.planId,
          expiry_date: member.expiryDate,
          notes: member.notes,
          updated_at: now,
        })
        .eq("member_id", member.memberId);
    } catch (err) {
      // Handled
    }
  }

  return member;
}

/**
 * Authenticates a member using Member ID + 4-digit PIN.
 * Returns member if successful; throws or returns null if invalid.
 */
export async function authenticateMember(
  memberId: string,
  pin: string
): Promise<{ success: boolean; member?: GymMember; error?: string }> {
  if (!memberId || !pin) {
    return { success: false, error: "Member ID and PIN are required." };
  }

  const member = await getMemberByMemberId(memberId, true);
  if (!member) {
    return { success: false, error: "Invalid Member ID or PIN." };
  }

  // Check member status
  if (member.status !== "active") {
    if (member.status === "expired") {
      return { success: false, error: "Your gym membership plan has expired. Please see the front desk." };
    }
    if (member.status === "suspended") {
      return { success: false, error: "Your membership account is suspended. Please contact gym management." };
    }
    return { success: false, error: "Your membership account is currently inactive." };
  }

  // Check expiry date if set
  if (member.expiryDate) {
    const today = new Date().toISOString().split("T")[0];
    if (member.expiryDate < today) {
      return { success: false, error: "Your gym membership plan has expired. Please see the front desk." };
    }
  }

  // Verify PIN against pin_hash
  const isMatch = verifyPin(pin, member.pinHash);
  if (!isMatch) {
    return { success: false, error: "Invalid Member ID or PIN." };
  }

  // Update last_login_at
  const now = new Date().toISOString();
  member.lastLoginAt = now;
  MEMORY_MEMBERS.set(member.id, member);
  MEMORY_MEMBERS.set(member.memberId.toUpperCase(), member);

  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase
        .from("members")
        .update({ last_login_at: now })
        .eq("member_id", member.memberId);
    } catch (err) {
      // Handled
    }
  }

  return { success: true, member };
}

/**
 * Retrieves complete Member Dashboard payload (member profile + assigned workout/nutrition plan).
 */
export async function getMemberDashboardData(memberId: string): Promise<MemberDashboardData | null> {
  const member = await getMemberByMemberId(memberId, false);
  if (!member) return null;

  // Resolve assigned plan template or default
  const template = getGymPlanTemplate(member.planId || "plan-hypertrophy-ppl") || GYM_PLAN_TEMPLATES[0];
  const meals = generateMealPlan("non_vegetarian", template.calories, 4);

  return {
    member: {
      id: member.id,
      memberId: member.memberId,
      fullName: member.fullName,
      phone: member.phone,
      email: member.email,
      status: member.status,
      startDate: member.startDate,
      expiryDate: member.expiryDate,
      fitnessGoal: member.fitnessGoal,
    },
    assignedPlan: {
      id: template.id,
      version: 1,
      goal: template.goal,
      splitName: template.splitName,
      calories: template.calories,
      protein: template.protein,
      carbs: template.carbs,
      fat: template.fat,
      trainingDays: template.trainingDays,
      schedule: template.blueprint.schedule,
      recoveryProtocol: template.blueprint.recoveryProtocol,
      dietStrategyNotes: template.blueprint.dietStrategyNotes,
      meals,
    },
  };
}
