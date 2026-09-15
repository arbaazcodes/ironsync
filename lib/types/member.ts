import { CalculatedBlueprint, DietType, BudgetTier } from "./onboarding";
import { DayMeal } from "../engine/mealGenerator";

export type MemberStatus = "active" | "inactive" | "suspended" | "expired";

export interface GymMember {
  id: string;
  memberId: string; // "IS-2026-0001"
  fullName: string;
  phone: string;
  email?: string | null;
  pinHash: string; // salt:hash (NEVER exposed to client)
  status: MemberStatus;
  fitnessGoal: string;
  planId?: string | null;
  planTemplateKey?: string | null;
  startDate: string; // ISO date string "YYYY-MM-DD"
  expiryDate?: string | null; // ISO date string "YYYY-MM-DD"
  dateOfBirth?: string | null;
  gender?: string | null;
  age?: number | null;
  height?: number | null;
  weight?: number | null;
  experience?: string | null;
  dietType?: string | null;
  daysPerWeek?: number | null;
  notes?: string | null;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string | null;
}

export interface CreateMemberInput {
  fullName: string;
  phone: string;
  email?: string;
  pin?: string; // Optional 4-digit PIN; if omitted, automatically generated
  fitnessGoal: string;
  planId?: string;
  startDate?: string;
  expiryDate?: string;
  dateOfBirth?: string;
  gender?: string;
  age?: number;
  height?: number;
  weight?: number;
  experience?: string;
  dietType?: string;
  daysPerWeek?: number;
  notes?: string;
}

export interface UpdateMemberInput {
  fullName?: string;
  phone?: string;
  email?: string;
  status?: MemberStatus;
  fitnessGoal?: string;
  planId?: string | null;
  expiryDate?: string | null;
  gender?: string | null;
  age?: number | null;
  height?: number | null;
  weight?: number | null;
  experience?: string | null;
  dietType?: string | null;
  daysPerWeek?: number | null;
  notes?: string | null;
}

export interface MemberSessionPayload {
  id: string;
  memberId: string;
  fullName: string;
  status: MemberStatus;
  planId?: string | null;
  exp: number; // Unix epoch timestamp (seconds)
}

export interface MemberAuthResponse {
  success: boolean;
  member?: {
    id: string;
    memberId: string;
    fullName: string;
    status: MemberStatus;
    planId?: string | null;
    startDate: string;
    expiryDate?: string | null;
  };
  error?: string;
}

export interface MemberDashboardData {
  member: {
    id: string;
    memberId: string;
    fullName: string;
    phone: string;
    email?: string | null;
    status: MemberStatus;
    startDate: string;
    expiryDate?: string | null;
    fitnessGoal: string;
    gender?: string | null;
    age?: number | null;
    height?: number | null;
    weight?: number | null;
    experience?: string | null;
    dietType?: string | null;
    daysPerWeek?: number | null;
  };
  assignedPlan: {
    id: string;
    version: number;
    goal: string;
    splitName: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    trainingDays: number;
    schedule: CalculatedBlueprint["schedule"];
    recoveryProtocol: CalculatedBlueprint["recoveryProtocol"];
    dietStrategyNotes?: string;
    meals?: DayMeal[];
  } | null;
}
