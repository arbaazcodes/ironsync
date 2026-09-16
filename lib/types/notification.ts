export type NotificationAudience = "admin" | "member";

export type NotificationType =
  | "change_request_submitted"
  | "change_request_approved"
  | "change_request_rejected"
  | "profile_updated"
  | "attendance_marked"
  | "attendance_skipped"
  | string;

export interface InAppNotification {
  id: string;
  audience: NotificationAudience;
  memberUuid: string | null;
  memberId: string | null;
  title: string;
  body: string;
  link: string | null;
  type: NotificationType;
  readAt: string | null;
  createdAt: string;
}

export interface CreateNotificationInput {
  audience: NotificationAudience;
  memberUuid?: string | null;
  memberId?: string | null;
  title: string;
  body: string;
  link?: string | null;
  type: NotificationType;
}
