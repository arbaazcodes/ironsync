import crypto from "crypto";
import { createServiceClient } from "../supabase/admin";
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
import { generateBlueprint } from "../engine/index";
import { generateMealPlan } from "../engine/mealGenerator";
import { DietType } from "../types/onboarding";
import { logMemberAction } from "./auditLogService";
import { createNotification } from "./notificationService";

// In-memory fallback store is ONLY used in non-production environments when explicitly enabled
const MEMORY_MEMBERS: Map<string, GymMember> = new Map();

function isMemoryFallbackAllowed(): boolean {
  return (
    process.env.ALLOW_MEMORY_MEMBERS === "true" &&
    process.env.NODE_ENV !== "production"
  );
}

function isUuid(str?: string | null): boolean {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str.trim());
}

function mapRowToMember(row: any): GymMember {
  let parsedNotesProfile: any = {};
  if (row.notes && typeof row.notes === "string" && row.notes.trim().startsWith("{")) {
    try {
      parsedNotesProfile = JSON.parse(row.notes);
    } catch {}
  }

  return {
    id: row.id,
    memberId: row.member_id,
    fullName: row.full_name,
    phone: row.phone,
    email: row.email,
    pinHash: row.pin_hash,
    status: row.status as MemberStatus,
    fitnessGoal: row.fitness_goal,
    planId: row.plan_template_key || row.plan_id || null,
    planTemplateKey: row.plan_template_key || null,
    startDate: row.start_date,
    expiryDate: row.expiry_date,
    dateOfBirth: row.date_of_birth,
    gender: row.gender || parsedNotesProfile.gender || null,
    age: row.age != null ? Number(row.age) : (parsedNotesProfile.age != null ? Number(parsedNotesProfile.age) : null),
    height: row.height != null ? Number(row.height) : (row.height_cm != null ? Number(row.height_cm) : (parsedNotesProfile.height != null ? Number(parsedNotesProfile.height) : null)),
    heightCm: row.height_cm != null ? Number(row.height_cm) : (row.height != null ? Number(row.height) : (parsedNotesProfile.height != null ? Number(parsedNotesProfile.height) : null)),
    weight: row.weight != null ? Number(row.weight) : (row.weight_kg != null ? Number(row.weight_kg) : (parsedNotesProfile.weight != null ? Number(parsedNotesProfile.weight) : null)),
    weightKg: row.weight_kg != null ? Number(row.weight_kg) : (row.weight != null ? Number(row.weight) : (parsedNotesProfile.weight != null ? Number(parsedNotesProfile.weight) : null)),
    experience: row.experience || parsedNotesProfile.experience || "intermediate",
    dietType: row.diet_type || parsedNotesProfile.dietType || "non_vegetarian",
    daysPerWeek: row.days_per_week != null ? Number(row.days_per_week) : (parsedNotesProfile.daysPerWeek != null ? Number(parsedNotesProfile.daysPerWeek) : 4),
    emergencyContact: row.emergency_contact || parsedNotesProfile.emergencyContact || null,
    notes: row.notes,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastLoginAt: row.last_login_at,
  };
}

/**
 * Returns the current maximum sequence number for the given year to safely increment Member IDs.
 * Queries PostgreSQL ordered by member_id descending for fast, non-racy allocation.
 */
export async function getNextMemberSequence(year: number = 2026): Promise<number> {
  const supabase = createServiceClient();
  let maxSeq = 0;

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("members")
        .select("member_id")
        .like("member_id", `IS-${year}-%`)
        .order("member_id", { ascending: false })
        .limit(1);

      if (!error && Array.isArray(data) && data.length > 0) {
        const seq = parseMemberIdSequence(data[0].member_id);
        if (seq && seq > maxSeq) maxSeq = seq;
        return maxSeq + 1;
      } else if (!error && Array.isArray(data) && data.length === 0) {
        return 1;
      } else if (error) {
        console.error("Error querying latest member sequence from Supabase:", error);
      }
    } catch (err) {
      console.error("Failed to query member sequence:", err);
    }
  }

  if (isMemoryFallbackAllowed()) {
    for (const member of MEMORY_MEMBERS.values()) {
      const seq = parseMemberIdSequence(member.memberId);
      if (seq && seq > maxSeq) maxSeq = seq;
    }
    return maxSeq + 1;
  }

  if (!supabase) {
    throw new Error(
      "Supabase service client is not configured. SUPABASE_SERVICE_ROLE_KEY is required for member operations."
    );
  }

  return maxSeq + 1;
}

/**
 * Creates a new gym member and persists directly to Supabase PostgreSQL.
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

  // 1. Generate PIN and secure hash
  const rawPin =
    input.pin && /^\d{4}$/.test(input.pin.trim())
      ? input.pin.trim()
      : generateRandomPin();
  const pinHash = hashPin(rawPin);

  const now = new Date().toISOString();
  const startDate = input.startDate || now.split("T")[0];
  const expiryDate =
    input.expiryDate ||
    new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const assignedPlanId = input.planId || GYM_PLAN_TEMPLATES[0].id;
  const isPlanUuid = isUuid(assignedPlanId);

  // Helper to attempt insert with retry
  let nextSeq = await getNextMemberSequence(2026);
  let memberId = formatMemberId(nextSeq, 2026);

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
    planTemplateKey: isPlanUuid ? null : assignedPlanId,
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

  const supabase = createServiceClient();
  if (!supabase) {
    if (isMemoryFallbackAllowed()) {
      MEMORY_MEMBERS.set(newMember.id, newMember);
      MEMORY_MEMBERS.set(newMember.memberId.toUpperCase(), newMember);
      return { member: newMember, rawPin };
    }
    throw new Error(
      "Cannot create member: Supabase service client is not configured. Please ensure SUPABASE_SERVICE_ROLE_KEY is set."
    );
  }

  // Build insert payload
  const buildPayload = (mId: string, includePlanTemplateKey: boolean = true) => {
    const payload: Record<string, any> = {
      id: newMember.id,
      member_id: mId,
      full_name: newMember.fullName,
      phone: newMember.phone,
      email: newMember.email,
      pin_hash: newMember.pinHash,
      status: newMember.status,
      fitness_goal: newMember.fitnessGoal,
      plan_id: isPlanUuid ? assignedPlanId : null,
      start_date: newMember.startDate,
      expiry_date: newMember.expiryDate,
      date_of_birth: newMember.dateOfBirth,
      gender: newMember.gender,
      notes: newMember.notes,
      created_by: newMember.createdBy,
      created_at: newMember.createdAt,
      updated_at: newMember.updatedAt,
    };

    if (includePlanTemplateKey) {
      payload.plan_template_key = isPlanUuid ? null : assignedPlanId;
    }

    return payload;
  };

  // Attempt database insert with unique-constraint retry and backward-compatible column handling
  let insertSuccess = false;
  let attemptPayload = buildPayload(memberId, true);

  for (let attempt = 0; attempt < 2; attempt++) {
    const { error } = await supabase.from("members").insert(attemptPayload as any);

    if (!error) {
      insertSuccess = true;
      break;
    }

    // Check if error is due to missing plan_template_key column (schema migration pending)
    if (
      error.message?.includes("plan_template_key") ||
      error.code === "42703" ||
      error.code === "PGRST204"
    ) {
      console.warn(
        "public.members table does not have plan_template_key column yet. Retrying without it..."
      );
      attemptPayload = buildPayload(attemptPayload.member_id, false);
      const retryWithoutColumn = await supabase.from("members").insert(attemptPayload as any);
      if (!retryWithoutColumn.error) {
        insertSuccess = true;
        break;
      }
    }

    // Check if error is unique constraint collision on member_id (error code 23505)
    if (error.code === "23505" || error.message?.includes("duplicate key")) {
      console.warn(`Member ID collision for ${memberId}. Incrementing sequence and retrying...`);
      nextSeq = await getNextMemberSequence(2026);
      memberId = formatMemberId(nextSeq, 2026);
      newMember.memberId = memberId;
      attemptPayload = buildPayload(memberId, true);
      continue;
    }

    // Other fatal error
    console.error("Database insert error in createMember:", error);
    if (!isMemoryFallbackAllowed()) {
      throw new Error(`Failed to save member to database: ${error.message}`);
    }
    break;
  }

  if (!insertSuccess && !isMemoryFallbackAllowed()) {
    throw new Error("Failed to persist member in database after retries.");
  }

  // Update memory store if fallback allowed
  if (isMemoryFallbackAllowed()) {
    MEMORY_MEMBERS.set(newMember.id, newMember);
    MEMORY_MEMBERS.set(newMember.memberId.toUpperCase(), newMember);
  }

  return { member: newMember, rawPin };
}

/**
 * Retrieves members for the admin directory with search and status filtering directly from PostgreSQL.
 */
export async function getMembers(
  optionsOrUserId?: any,
  maybeFilters?: { search?: string; status?: MemberStatus | "all"; sortBy?: string; sortOrder?: string }
): Promise<GymMember[]> {
  const filters =
    typeof optionsOrUserId === "object" && optionsOrUserId !== null
      ? optionsOrUserId
      : maybeFilters || {};

  const supabase = createServiceClient();
  let membersList: GymMember[] = [];

  if (supabase) {
    try {
      let query = supabase.from("members").select("*").order("created_at", { ascending: false });

      if (filters?.status && filters.status !== "all") {
        query = query.eq("status", filters.status);
      }

      const { data, error } = await query;
      if (!error && Array.isArray(data)) {
        membersList = data.map(mapRowToMember);
      } else if (error) {
        console.error("Error retrieving members from Supabase:", error);
        if (!isMemoryFallbackAllowed()) {
          throw new Error(`Failed to retrieve members: ${error.message}`);
        }
      }
    } catch (err: any) {
      console.error("Exception fetching members:", err);
      if (!isMemoryFallbackAllowed()) {
        throw err;
      }
    }
  } else if (!isMemoryFallbackAllowed()) {
    throw new Error("Supabase service client is not configured (SUPABASE_SERVICE_ROLE_KEY missing).");
  }

  // Fallback to memory store ONLY if allowed and list is empty
  if (membersList.length === 0 && isMemoryFallbackAllowed()) {
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

  return membersList.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Finds a member by primary UUID or Member ID.
 */
export async function getMemberById(id: string): Promise<GymMember | null> {
  if (!id) return null;

  const supabase = createServiceClient();
  if (supabase) {
    try {
      const isUuidFormat = isUuid(id);
      const query = isUuidFormat
        ? supabase.from("members").select("*").eq("id", id)
        : supabase.from("members").select("*").eq("member_id", id.toUpperCase());

      const { data, error } = await query.maybeSingle();
      if (!error && data) {
        return mapRowToMember(data);
      }
      if (error) {
        console.error(`Error finding member by id ${id}:`, error);
      }
    } catch (err) {
      console.error(`Exception finding member by id ${id}:`, err);
    }
  }

  if (isMemoryFallbackAllowed()) {
    return MEMORY_MEMBERS.get(id) || MEMORY_MEMBERS.get(id.toUpperCase()) || null;
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

  const supabase = createServiceClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("member_id", cleanId)
        .maybeSingle();

      if (!error && data) {
        return mapRowToMember(data);
      }
      if (error) {
        console.error(`Error querying member ${cleanId}:`, error);
      }
    } catch (err) {
      console.error(`Exception querying member ${cleanId}:`, err);
    }
  }

  if (isMemoryFallbackAllowed()) {
    const memoryMatch = MEMORY_MEMBERS.get(cleanId);
    return memoryMatch || null;
  }

  return null;
}

/**
 * Resets a member's PIN in PostgreSQL.
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

  const newPin =
    customPin && /^\d{4}$/.test(customPin.trim())
      ? customPin.trim()
      : generateRandomPin();
  const newPinHash = hashPin(newPin);
  const now = new Date().toISOString();

  member.pinHash = newPinHash;
  member.updatedAt = now;

  const supabase = createServiceClient();
  if (supabase) {
    const { error } = await supabase
      .from("members")
      .update({ pin_hash: newPinHash, updated_at: now })
      .eq("member_id", member.memberId);

    if (error) {
      console.error("Error resetting member PIN in Supabase:", error);
      if (!isMemoryFallbackAllowed()) {
        throw new Error(`Failed to reset PIN in database: ${error.message}`);
      }
    }
  } else if (!isMemoryFallbackAllowed()) {
    throw new Error("Supabase service client is not configured (SUPABASE_SERVICE_ROLE_KEY missing).");
  }

  if (isMemoryFallbackAllowed()) {
    MEMORY_MEMBERS.set(member.id, member);
    MEMORY_MEMBERS.set(member.memberId.toUpperCase(), member);
  }

  return { success: true, member, newPin };
}

/**
 * Updates a member's status ('active' | 'inactive' | 'suspended' | 'expired') in PostgreSQL.
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

  const supabase = createServiceClient();
  if (supabase) {
    const { error } = await supabase
      .from("members")
      .update({ status: newStatus, updated_at: now })
      .eq("member_id", member.memberId);

    if (error) {
      console.error("Error updating member status in Supabase:", error);
      if (!isMemoryFallbackAllowed()) {
        throw new Error(`Failed to update status in database: ${error.message}`);
      }
    }
  } else if (!isMemoryFallbackAllowed()) {
    throw new Error("Supabase service client is not configured.");
  }

  if (isMemoryFallbackAllowed()) {
    MEMORY_MEMBERS.set(member.id, member);
    MEMORY_MEMBERS.set(member.memberId.toUpperCase(), member);
  }

  return member;
}

/**
 * Assigns or switches a plan for a member in PostgreSQL.
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
  const isPlanUuid = isUuid(planId);
  member.planId = planId;
  member.planTemplateKey = isPlanUuid ? null : planId;
  member.updatedAt = now;

  const supabase = createServiceClient();
  if (supabase) {
    const updatePayload: Record<string, any> = {
      plan_id: isPlanUuid ? planId : null,
      plan_template_key: isPlanUuid ? null : planId,
      updated_at: now,
    };

    const { error } = await supabase
      .from("members")
      .update(updatePayload as any)
      .eq("member_id", member.memberId);

    if (error) {
      // Handle missing plan_template_key column fallback
      if (
        error.message?.includes("plan_template_key") ||
        error.code === "42703" ||
        error.code === "PGRST204"
      ) {
        const retry = await supabase
          .from("members")
          .update({ plan_id: isPlanUuid ? planId : null, updated_at: now } as any)
          .eq("member_id", member.memberId);

        if (retry.error && !isMemoryFallbackAllowed()) {
          throw new Error(`Failed to assign plan: ${retry.error.message}`);
        }
      } else if (!isMemoryFallbackAllowed()) {
        throw new Error(`Failed to assign plan in database: ${error.message}`);
      }
    }
  } else if (!isMemoryFallbackAllowed()) {
    throw new Error("Supabase service client is not configured.");
  }

  if (isMemoryFallbackAllowed()) {
    MEMORY_MEMBERS.set(member.id, member);
    MEMORY_MEMBERS.set(member.memberId.toUpperCase(), member);
  }

  return member;
}

/**
 * Updates general fields on a member record in PostgreSQL.
 */
export async function updateMember(
  idOrMemberId: string,
  input: UpdateMemberInput,
  actor?: { id: string; email?: string; type?: "admin" | "member" | "system" }
): Promise<GymMember | null> {
  const member = await resolveMember(idOrMemberId);
  if (!member) return null;

  // Snapshot before data for fields being modified (never log sensitive pin fields)
  const beforeData: Record<string, any> = {};
  const afterData: Record<string, any> = {};
  for (const [key, val] of Object.entries(input)) {
    if (val !== undefined && key !== "pin" && key !== "pinHash") {
      beforeData[key] = (member as any)[key] ?? null;
      afterData[key] = val;
    }
  }

  const now = new Date().toISOString();
  if (input.fullName !== undefined) member.fullName = input.fullName.trim();
  if (input.phone !== undefined) member.phone = input.phone.trim();
  if (input.email !== undefined) member.email = input.email ? input.email.trim() : null;
  if (input.status !== undefined) member.status = input.status;
  if (input.fitnessGoal !== undefined) member.fitnessGoal = input.fitnessGoal;
  if (input.planId !== undefined) {
    member.planId = input.planId;
    member.planTemplateKey = isUuid(input.planId) ? null : input.planId;
  }
  if (input.expiryDate !== undefined) member.expiryDate = input.expiryDate;
  if (input.dateOfBirth !== undefined) member.dateOfBirth = input.dateOfBirth;
  if (input.gender !== undefined) member.gender = input.gender;
  if (input.age !== undefined) member.age = input.age;
  if (input.height !== undefined) member.height = input.height;
  if (input.weight !== undefined) member.weight = input.weight;
  if (input.experience !== undefined) member.experience = input.experience;
  if (input.dietType !== undefined) member.dietType = input.dietType;
  if (input.daysPerWeek !== undefined) member.daysPerWeek = input.daysPerWeek;
  if (input.emergencyContact !== undefined) member.emergencyContact = input.emergencyContact;
  if (input.notes !== undefined) member.notes = input.notes;
  member.updatedAt = now;

  const supabase = createServiceClient();
  if (supabase) {
    const isPlanUuid = input.planId !== undefined ? isUuid(input.planId) : false;
    const dbUpdate: Record<string, any> = {
      full_name: member.fullName,
      phone: member.phone,
      email: member.email,
      status: member.status,
      fitness_goal: member.fitnessGoal,
      expiry_date: member.expiryDate,
      date_of_birth: member.dateOfBirth,
      gender: member.gender,
      age: member.age,
      height: member.height,
      weight: member.weight,
      experience: member.experience,
      diet_type: member.dietType,
      days_per_week: member.daysPerWeek,
      emergency_contact: member.emergencyContact,
      notes: member.notes,
      updated_at: now,
    };

    if (input.planId !== undefined) {
      dbUpdate.plan_id = isPlanUuid ? input.planId : null;
      dbUpdate.plan_template_key = isPlanUuid ? null : input.planId;
    }

    const { error } = await supabase
      .from("members")
      .update(dbUpdate as any)
      .eq("member_id", member.memberId);

    if (error) {
      // Retry without non-standard columns if not yet migrated
      if (
        error.message?.includes("emergency_contact") ||
        error.message?.includes("plan_template_key") ||
        error.code === "42703" ||
        error.code === "PGRST204"
      ) {
        delete dbUpdate.plan_template_key;
        delete dbUpdate.emergency_contact;
        const retry = await supabase
          .from("members")
          .update(dbUpdate as any)
          .eq("member_id", member.memberId);
        if (retry.error && !isMemoryFallbackAllowed()) {
          throw new Error(`Failed to update member: ${retry.error.message}`);
        }
      } else if (!isMemoryFallbackAllowed()) {
        throw new Error(`Failed to update member in database: ${error.message}`);
      }
    }
  } else if (!isMemoryFallbackAllowed()) {
    throw new Error("Supabase service client is not configured.");
  }

  if (isMemoryFallbackAllowed()) {
    MEMORY_MEMBERS.set(member.id, member);
    MEMORY_MEMBERS.set(member.memberId.toUpperCase(), member);
  }

  // Audit Log: Log direct_edit if performed by admin/system
  if (actor) {
    try {
      await logMemberAction({
        memberUuid: member.id,
        memberId: member.memberId,
        action: "direct_edit",
        actorType: actor.type || "admin",
        actorLabel: actor.email || actor.id || "admin",
        beforeData,
        afterData,
      });

      // In-App Notification to Member
      createNotification({
        audience: "member",
        memberUuid: member.id,
        memberId: member.memberId,
        type: "profile_updated",
        title: "Profile Records Updated",
        body: "Gym administration updated your athlete profile records.",
        link: "/member/profile",
      }).catch((notifErr) =>
        console.warn("[NotificationService] Failed to notify member of direct edit:", notifErr)
      );
    } catch (auditErr) {
      console.warn("[MemberService] Failed to log direct_edit audit:", auditErr);
    }
  }

  return member;
}

/**
 * Authenticates a member using Member ID + 4-digit PIN against PostgreSQL.
 * Returns member if successful; returns error object if invalid.
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
      return {
        success: false,
        error: "Your gym membership plan has expired. Please see the front desk.",
      };
    }
    if (member.status === "suspended") {
      return {
        success: false,
        error: "Your membership account is suspended. Please contact gym management.",
      };
    }
    return {
      success: false,
      error: "Your membership account is currently inactive.",
    };
  }

  // Check expiry date if set
  if (member.expiryDate) {
    const today = new Date().toISOString().split("T")[0];
    if (member.expiryDate < today) {
      return {
        success: false,
        error: "Your gym membership plan has expired. Please see the front desk.",
      };
    }
  }

  // Verify PIN against pin_hash
  const isMatch = verifyPin(pin, member.pinHash);
  if (!isMatch) {
    return { success: false, error: "Invalid Member ID or PIN." };
  }

  // Update last_login_at in PostgreSQL
  const now = new Date().toISOString();
  member.lastLoginAt = now;

  const supabase = createServiceClient();
  if (supabase) {
    try {
      await supabase
        .from("members")
        .update({ last_login_at: now })
        .eq("member_id", member.memberId);
    } catch (err) {
      console.warn("Could not update last_login_at:", err);
    }
  }

  if (isMemoryFallbackAllowed()) {
    MEMORY_MEMBERS.set(member.id, member);
    MEMORY_MEMBERS.set(member.memberId.toUpperCase(), member);
  }

  return { success: true, member };
}

/**
 * Retrieves complete Member Dashboard payload (member profile + assigned workout/nutrition plan).
 */
export async function getMemberDashboardData(
  memberId: string
): Promise<MemberDashboardData | null> {
  const member = await getMemberByMemberId(memberId, false);
  if (!member) return null;

  // Resolve assigned plan template or default
  const templateKey = member.planTemplateKey || member.planId || "plan-hypertrophy-ppl";
  const template = getGymPlanTemplate(templateKey) || GYM_PLAN_TEMPLATES[0];

  const diet = (member.dietType as DietType) || "non_vegetarian";
  let blueprint = template.blueprint;

  // If member has specific profile attributes (weight, height, age, diet, days, or custom goal),
  // dynamically calculate the deterministic blueprint from their physical profile!
  if (member.weight || member.height || member.age || member.dietType || member.fitnessGoal) {
    const calculated = generateBlueprint({
      gender: (member.gender as any) || "male",
      age: member.age || 26,
      weightKg: member.weight ? Number(member.weight) : 78,
      heightCm: member.height ? Number(member.height) : 178,
      goal: (member.fitnessGoal as any) || template.goal || "muscle_gain",
      daysPerWeek: member.daysPerWeek || template.trainingDays || 4,
      sessionDuration: 60,
      equipment: "commercial_gym",
      experience: (member.experience as any) || "intermediate",
      dietType: diet,
      mealsPerDay: 4,
      budget: "balanced",
      allergies: [],
      deliverables: ["workout", "nutrition"],
      trainingTime: "evening",
    });
    blueprint = calculated;
  }

  const meals = generateMealPlan(diet, blueprint.macros.calories, 4);
  const { pinHash, ...safeMember } = member;

  return {
    member: safeMember,
    assignedPlan: {
      id: template.id,
      version: 1,
      goal: member.fitnessGoal || template.goal,
      splitName: blueprint.splitName || template.splitName,
      calories: blueprint.macros.calories,
      protein: blueprint.macros.protein,
      carbs: blueprint.macros.carbs,
      fat: blueprint.macros.fat,
      trainingDays: member.daysPerWeek || template.trainingDays,
      schedule: blueprint.schedule,
      recoveryProtocol: blueprint.recoveryProtocol,
      dietStrategyNotes: blueprint.dietStrategyNotes,
      meals,
    },
  };
}
