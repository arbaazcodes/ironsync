import crypto from "crypto";
import { createServiceClient } from "../supabase/admin";
import {
  MemberChangeRequest,
  ChangeRequestWithMember,
  ChangeRequestStatus,
  AllowedChangeFieldKey,
  ALLOWED_CHANGE_FIELD_KEYS,
} from "../types/changeRequest";
import { getMemberById } from "./memberService";
import { logMemberAction } from "./auditLogService";
import {
  notifyGymAdminNewRequest,
  notifyMemberRequestReviewed,
} from "./emailService";

// In-memory fallback store for non-production environments
const MEMORY_REQUESTS: Map<string, MemberChangeRequest> = new Map();

function isMemoryFallbackAllowed(): boolean {
  return (
    process.env.ALLOW_MEMORY_MEMBERS === "true" &&
    process.env.NODE_ENV !== "production"
  );
}

function mapRowToChangeRequest(row: any): MemberChangeRequest {
  return {
    id: row.id,
    memberUuid: row.member_uuid,
    memberId: row.member_id,
    status: row.status as ChangeRequestStatus,
    requestedFields:
      typeof row.requested_fields === "string"
        ? JSON.parse(row.requested_fields)
        : row.requested_fields || {},
    memberNote: row.member_note || null,
    adminNote: row.admin_note || null,
    reviewedBy: row.reviewed_by || null,
    createdAt: row.created_at,
    reviewedAt: row.reviewed_at || null,
  };
}

/**
 * Creates a new change request for an authenticated member.
 * Strictly enforces that only one pending change request exists per member.
 */
export async function createChangeRequest(
  memberUuid: string,
  memberId: string,
  rawFields: Record<string, any>,
  memberNote?: string | null
): Promise<MemberChangeRequest> {
  // 1. Sanitize requested_fields: allow ONLY allowed keys
  const requestedFields: Partial<Record<AllowedChangeFieldKey, any>> = {};

  for (const key of ALLOWED_CHANGE_FIELD_KEYS) {
    if (rawFields[key] !== undefined && rawFields[key] !== null) {
      const val = rawFields[key];
      if (typeof val === "string") {
        const trimmed = val.trim();
        if (trimmed.length > 0) {
          requestedFields[key] = trimmed;
        }
      } else if (typeof val === "number" && !isNaN(val)) {
        requestedFields[key] = val;
      }
    }
  }

  if (Object.keys(requestedFields).length === 0) {
    throw new Error("No valid change fields provided. Please specify at least one profile attribute to update.");
  }

  const supabase = createServiceClient();
  const now = new Date().toISOString();

  // 2. Check for existing pending request (Enforce 1 pending per member)
  if (supabase) {
    const { data: existingPending, error: checkError } = await supabase
      .from("member_change_requests")
      .select("id, status")
      .eq("member_uuid", memberUuid)
      .eq("status", "pending")
      .maybeSingle();

    if (!checkError && existingPending) {
      throw new Error(
        "You already have a pending change request under review. Gym administration must approve or reject it before you can submit a new one."
      );
    }
  } else if (isMemoryFallbackAllowed()) {
    for (const req of MEMORY_REQUESTS.values()) {
      if (req.memberUuid === memberUuid && req.status === "pending") {
        throw new Error(
          "You already have a pending change request under review. Gym administration must approve or reject it before you can submit a new one."
        );
      }
    }
  } else {
    throw new Error("Supabase service client is not configured.");
  }

  // 3. Create record
  const newRequest: MemberChangeRequest = {
    id: crypto.randomUUID(),
    memberUuid,
    memberId,
    status: "pending",
    requestedFields,
    memberNote: memberNote?.trim() ? memberNote.trim().slice(0, 500) : null,
    adminNote: null,
    reviewedBy: null,
    createdAt: now,
    reviewedAt: null,
  };

  if (supabase) {
    const { error: insertError } = await supabase
      .from("member_change_requests")
      .insert({
        id: newRequest.id,
        member_uuid: newRequest.memberUuid,
        member_id: newRequest.memberId,
        status: newRequest.status,
        requested_fields: newRequest.requestedFields,
        member_note: newRequest.memberNote,
        created_at: newRequest.createdAt,
      });

    if (insertError) {
      console.error("Failed to insert member change request:", insertError);
      if (!isMemoryFallbackAllowed()) {
        throw new Error(`Failed to submit change request: ${insertError.message}`);
      }
    }
  }

  if (isMemoryFallbackAllowed()) {
    MEMORY_REQUESTS.set(newRequest.id, newRequest);
  }

  // 4. Audit Log: Log request_submitted
  try {
    const member = await getMemberById(memberUuid);
    await logMemberAction({
      memberUuid: newRequest.memberUuid,
      memberId: newRequest.memberId,
      action: "request_submitted",
      actorType: "member",
      actorLabel: member?.fullName || newRequest.memberId,
      requestId: newRequest.id,
      afterData: {
        requested_fields: newRequest.requestedFields,
        member_note: newRequest.memberNote,
      },
    });

    // 5. Notify Gym Admin (gracefully skips if RESEND_API_KEY missing)
    notifyGymAdminNewRequest({
      memberUuid: newRequest.memberUuid,
      memberId: newRequest.memberId,
      memberName: member?.fullName || "Member",
      requestedFields: newRequest.requestedFields,
      memberNote: newRequest.memberNote,
      requestId: newRequest.id,
    }).catch((err) =>
      console.warn("[EmailService] Failed to dispatch admin alert:", err)
    );
  } catch (logErr) {
    console.warn("[ChangeRequestService] Failed to log audit or trigger notification:", logErr);
  }

  return newRequest;
}

/**
 * Retrieves change requests for a specific member (pending + history).
 */
export async function getMemberChangeRequests(
  memberUuid: string,
  memberId: string
): Promise<{ pendingRequest: MemberChangeRequest | null; history: MemberChangeRequest[] }> {
  const supabase = createServiceClient();
  let list: MemberChangeRequest[] = [];

  if (supabase) {
    const { data, error } = await supabase
      .from("member_change_requests")
      .select("*")
      .or(`member_uuid.eq.${memberUuid},member_id.eq.${memberId}`)
      .order("created_at", { ascending: false });

    if (!error && Array.isArray(data)) {
      list = data.map(mapRowToChangeRequest);
    } else if (error) {
      console.error("Error querying member change requests:", error);
      if (!isMemoryFallbackAllowed()) {
        throw new Error(`Failed to load change requests: ${error.message}`);
      }
    }
  }

  if (list.length === 0 && isMemoryFallbackAllowed()) {
    for (const req of MEMORY_REQUESTS.values()) {
      if (req.memberUuid === memberUuid || req.memberId === memberId) {
        list.push(req);
      }
    }
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const pendingRequest = list.find((r) => r.status === "pending") || null;
  const history = list.filter((r) => r.status !== "pending");

  return { pendingRequest, history };
}

/**
 * Retrieves change requests for the Admin portal with optional status filter.
 * Includes current member data for each request so admins can view side-by-side diffs.
 */
export async function getAdminChangeRequests(
  statusFilter?: ChangeRequestStatus | "all"
): Promise<ChangeRequestWithMember[]> {
  const supabase = createServiceClient();
  let list: MemberChangeRequest[] = [];

  if (supabase) {
    let query = supabase
      .from("member_change_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (statusFilter && statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    const { data, error } = await query;
    if (!error && Array.isArray(data)) {
      list = data.map(mapRowToChangeRequest);
    } else if (error) {
      console.error("Error querying admin change requests:", error);
      if (!isMemoryFallbackAllowed()) {
        throw new Error(`Failed to load change requests: ${error.message}`);
      }
    }
  }

  if (list.length === 0 && isMemoryFallbackAllowed()) {
    list = Array.from(MEMORY_REQUESTS.values());
    if (statusFilter && statusFilter !== "all") {
      list = list.filter((r) => r.status === statusFilter);
    }
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Enrich each request with current member profile data for old vs requested diff
  const enriched: ChangeRequestWithMember[] = await Promise.all(
    list.map(async (req) => {
      const member = await getMemberById(req.memberUuid);
      const currentMemberData: Partial<Record<AllowedChangeFieldKey, any>> & {
        fullName?: string;
      } = {};

      if (member) {
        currentMemberData.fullName = member.fullName;
        currentMemberData.full_name = member.fullName;
        currentMemberData.phone = member.phone;
        currentMemberData.email = member.email || null;
        currentMemberData.date_of_birth = member.dateOfBirth || null;
        currentMemberData.gender = member.gender || null;
        currentMemberData.height_cm = member.heightCm || member.height || null;
        currentMemberData.weight_kg = member.weightKg || member.weight || null;
        currentMemberData.goal = member.fitnessGoal || null;
        currentMemberData.diet_type = member.dietType || null;
        currentMemberData.experience = member.experience || null;
        currentMemberData.days_per_week = member.daysPerWeek || null;
        currentMemberData.emergency_contact = member.emergencyContact || null;
        currentMemberData.notes = member.notes || null;
      }

      return {
        ...req,
        currentMemberData,
      };
    })
  );

  return enriched;
}

/**
 * Reviews a change request (approve or reject).
 * If approved: updates public.members with only the requested_fields.
 * If rejected: marks request as rejected with admin note.
 */
export async function reviewChangeRequest(
  requestId: string,
  adminUser: { id: string; email?: string },
  action: "approve" | "reject",
  adminNote?: string | null
): Promise<MemberChangeRequest> {
  const supabase = createServiceClient();
  const now = new Date().toISOString();
  const reviewerTag = adminUser.email || adminUser.id;

  let request: MemberChangeRequest | null = null;

  if (supabase) {
    const { data, error } = await supabase
      .from("member_change_requests")
      .select("*")
      .eq("id", requestId)
      .maybeSingle();

    if (!error && data) {
      request = mapRowToChangeRequest(data);
    }
  }

  if (!request && isMemoryFallbackAllowed()) {
    request = MEMORY_REQUESTS.get(requestId) || null;
  }

  if (!request) {
    throw new Error("Change request not found.");
  }

  if (request.status !== "pending") {
    throw new Error(`This change request has already been ${request.status}.`);
  }

  // Fetch current member record for before_data snapshot and contact email
  const member = await getMemberById(request.memberUuid);

  if (action === "approve") {
    // 1. Snapshot current fields before applying
    const beforeData: Record<string, any> = {};
    if (member) {
      for (const key of Object.keys(request.requestedFields)) {
        if (key === "full_name") beforeData[key] = member.fullName;
        else if (key === "phone") beforeData[key] = member.phone;
        else if (key === "email") beforeData[key] = member.email;
        else if (key === "date_of_birth") beforeData[key] = member.dateOfBirth;
        else if (key === "gender") beforeData[key] = member.gender;
        else if (key === "goal") beforeData[key] = member.fitnessGoal;
        else if (key === "diet_type") beforeData[key] = member.dietType;
        else if (key === "experience") beforeData[key] = member.experience;
        else if (key === "days_per_week") beforeData[key] = member.daysPerWeek;
        else if (key === "height_cm") beforeData[key] = member.heightCm || member.height;
        else if (key === "weight_kg") beforeData[key] = member.weightKg || member.weight;
        else if (key === "emergency_contact") beforeData[key] = member.emergencyContact;
        else if (key === "notes") beforeData[key] = member.notes;
        else beforeData[key] = (member as any)[key] ?? null;
      }
    }

    // 2. Build update payload for public.members with requested_fields only
    const fields = request.requestedFields;
    const memberUpdate: Record<string, any> = {
      updated_at: now,
    };

    if (fields.full_name !== undefined) memberUpdate.full_name = fields.full_name;
    if (fields.phone !== undefined) memberUpdate.phone = fields.phone;
    if (fields.email !== undefined) memberUpdate.email = fields.email;
    if (fields.date_of_birth !== undefined) memberUpdate.date_of_birth = fields.date_of_birth;
    if (fields.gender !== undefined) memberUpdate.gender = fields.gender;
    if (fields.goal !== undefined) memberUpdate.fitness_goal = fields.goal;
    if (fields.diet_type !== undefined) memberUpdate.diet_type = fields.diet_type;
    if (fields.experience !== undefined) memberUpdate.experience = fields.experience;
    if (fields.days_per_week !== undefined) memberUpdate.days_per_week = fields.days_per_week;
    if (fields.notes !== undefined) memberUpdate.notes = fields.notes;

    // Both height and height_cm for resilience
    if (fields.height_cm !== undefined) {
      memberUpdate.height = fields.height_cm;
      memberUpdate.height_cm = fields.height_cm;
    }

    // Both weight and weight_kg for resilience
    if (fields.weight_kg !== undefined) {
      memberUpdate.weight = fields.weight_kg;
      memberUpdate.weight_kg = fields.weight_kg;
    }

    if (fields.emergency_contact !== undefined) {
      memberUpdate.emergency_contact = fields.emergency_contact;
    }

    if (supabase) {
      // Execute update on public.members with column fallback handling
      let updateResult = await supabase
        .from("members")
        .update(memberUpdate as any)
        .eq("id", request.memberUuid);

      if (updateResult.error) {
        // If error is due to missing column (e.g. emergency_contact, height_cm, weight_kg)
        if (
          updateResult.error.message?.includes("emergency_contact") ||
          updateResult.error.message?.includes("height_cm") ||
          updateResult.error.message?.includes("weight_kg") ||
          updateResult.error.code === "42703" ||
          updateResult.error.code === "PGRST204"
        ) {
          delete memberUpdate.emergency_contact;
          delete memberUpdate.height_cm;
          delete memberUpdate.weight_kg;
          updateResult = await supabase
            .from("members")
            .update(memberUpdate as any)
            .eq("id", request.memberUuid);
        }
      }

      if (updateResult.error && !isMemoryFallbackAllowed()) {
        throw new Error(`Failed to apply approved updates to member: ${updateResult.error.message}`);
      }

      // Update change request status to approved
      const { error: reqError } = await supabase
        .from("member_change_requests")
        .update({
          status: "approved",
          admin_note: adminNote?.trim() || null,
          reviewed_by: reviewerTag,
          reviewed_at: now,
        })
        .eq("id", requestId);

      if (reqError && !isMemoryFallbackAllowed()) {
        throw new Error(`Failed to update request status: ${reqError.message}`);
      }
    }

    request.status = "approved";
    request.adminNote = adminNote?.trim() || null;
    request.reviewedBy = reviewerTag;
    request.reviewedAt = now;

    // 3. Audit Log: Log request_approved
    try {
      await logMemberAction({
        memberUuid: request.memberUuid,
        memberId: request.memberId,
        action: "request_approved",
        actorType: "admin",
        actorLabel: reviewerTag,
        requestId: request.id,
        beforeData,
        afterData: {
          applied_fields: request.requestedFields,
          admin_note: adminNote?.trim() || null,
        },
      });

      // 4. Notify member via email if email exists
      notifyMemberRequestReviewed({
        memberUuid: request.memberUuid,
        memberId: request.memberId,
        memberName: member?.fullName || "Member",
        memberEmail: member?.email || (request.requestedFields.email as string) || null,
        action: "approve",
        adminNote: adminNote?.trim() || null,
        requestId: request.id,
        requestedFields: request.requestedFields,
      }).catch((err) =>
        console.warn("[EmailService] Failed to notify member of approval:", err)
      );
    } catch (logErr) {
      console.warn("[ChangeRequestService] Failed to log audit or trigger approval email:", logErr);
    }
  } else if (action === "reject") {
    // Strictly validate non-empty reason
    if (!adminNote || !adminNote.trim()) {
      throw new Error("A rejection reason is required before rejecting a change request.");
    }

    const trimmedReason = adminNote.trim();

    if (supabase) {
      const { error: reqError } = await supabase
        .from("member_change_requests")
        .update({
          status: "rejected",
          admin_note: trimmedReason,
          reviewed_by: reviewerTag,
          reviewed_at: now,
        })
        .eq("id", requestId);

      if (reqError && !isMemoryFallbackAllowed()) {
        throw new Error(`Failed to reject request: ${reqError.message}`);
      }
    }

    request.status = "rejected";
    request.adminNote = trimmedReason;
    request.reviewedBy = reviewerTag;
    request.reviewedAt = now;

    // Audit Log: Log request_rejected
    try {
      await logMemberAction({
        memberUuid: request.memberUuid,
        memberId: request.memberId,
        action: "request_rejected",
        actorType: "admin",
        actorLabel: reviewerTag,
        requestId: request.id,
        afterData: {
          rejection_reason: trimmedReason,
          requested_fields: request.requestedFields,
        },
      });

      // Notify member via email if email exists
      notifyMemberRequestReviewed({
        memberUuid: request.memberUuid,
        memberId: request.memberId,
        memberName: member?.fullName || "Member",
        memberEmail: member?.email || null,
        action: "reject",
        adminNote: trimmedReason,
        requestId: request.id,
        requestedFields: request.requestedFields,
      }).catch((err) =>
        console.warn("[EmailService] Failed to notify member of rejection:", err)
      );
    } catch (logErr) {
      console.warn("[ChangeRequestService] Failed to log audit or trigger rejection email:", logErr);
    }
  }

  if (isMemoryFallbackAllowed()) {
    MEMORY_REQUESTS.set(request.id, request);
  }

  return request;
}
