export type ChangeRequestStatus = "pending" | "approved" | "rejected";

export type AllowedChangeFieldKey =
  | "full_name"
  | "phone"
  | "email"
  | "date_of_birth"
  | "gender"
  | "height_cm"
  | "weight_kg"
  | "goal"
  | "diet_type"
  | "experience"
  | "days_per_week"
  | "notes"
  | "emergency_contact";

export const ALLOWED_CHANGE_FIELD_KEYS: AllowedChangeFieldKey[] = [
  "full_name",
  "phone",
  "email",
  "date_of_birth",
  "gender",
  "height_cm",
  "weight_kg",
  "goal",
  "diet_type",
  "experience",
  "days_per_week",
  "notes",
  "emergency_contact",
];

export const CHANGE_FIELD_METADATA: Record<
  AllowedChangeFieldKey,
  { label: string; unit?: string; type: "text" | "number" | "date" | "select" }
> = {
  full_name: { label: "Full Name", type: "text" },
  phone: { label: "Phone Number", type: "text" },
  email: { label: "Email Address", type: "text" },
  date_of_birth: { label: "Date of Birth", type: "date" },
  gender: { label: "Gender", type: "select" },
  height_cm: { label: "Height", unit: "cm", type: "number" },
  weight_kg: { label: "Weight", unit: "kg", type: "number" },
  goal: { label: "Fitness Goal", type: "select" },
  diet_type: { label: "Diet Type", type: "select" },
  experience: { label: "Experience Level", type: "select" },
  days_per_week: { label: "Training Days / Week", unit: "days", type: "number" },
  emergency_contact: { label: "Emergency Contact", type: "text" },
  notes: { label: "Member Notes", type: "text" },
};

export interface MemberChangeRequest {
  id: string;
  memberUuid: string;
  memberId: string;
  status: ChangeRequestStatus;
  requestedFields: Partial<Record<AllowedChangeFieldKey, any>>;
  memberNote?: string | null;
  adminNote?: string | null;
  reviewedBy?: string | null;
  createdAt: string;
  reviewedAt?: string | null;
}

export interface ChangeRequestWithMember extends MemberChangeRequest {
  currentMemberData?: Partial<Record<AllowedChangeFieldKey, any>> & {
    fullName?: string;
  };
}
