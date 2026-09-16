export type AuditActorType = "member" | "admin" | "system";

export type AuditActionType =
  | "request_submitted"
  | "request_approved"
  | "request_rejected"
  | "direct_edit"
  | "email_skipped"
  | string;

export interface MemberAuditLogEntry {
  id: string;
  memberUuid: string;
  memberId: string;
  action: AuditActionType;
  actorType: AuditActorType;
  actorLabel: string | null;
  requestId: string | null;
  beforeData: Record<string, any> | null;
  afterData: Record<string, any> | null;
  createdAt: string;
}

export interface CreateAuditLogInput {
  memberUuid: string;
  memberId: string;
  action: AuditActionType;
  actorType: AuditActorType;
  actorLabel?: string | null;
  requestId?: string | null;
  beforeData?: Record<string, any> | null;
  afterData?: Record<string, any> | null;
}
