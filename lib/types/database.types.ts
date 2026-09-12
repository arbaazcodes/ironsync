import { WorkoutExercise } from "./onboarding";
import { DayMeal } from "../engine/mealGenerator";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          updated_at: string;
          display_name: string | null;
          goal: string | null;
          gender: string | null;
          age: number | null;
          height: number | null;
          weight: number | null;
          target_weight: number | null;
          experience: string | null;
          equipment: string | null;
          days_per_week: number | null;
          session_duration: number | null;
          training_time: string | null;
          diet_type: string | null;
          meals_per_day: number | null;
          budget: string | null;
          food_restrictions: string[] | null;
        };
        Insert: {
          id: string;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
          display_name?: string | null;
          goal?: string | null;
          gender?: string | null;
          age?: number | null;
          height?: number | null;
          weight?: number | null;
          target_weight?: number | null;
          experience?: string | null;
          equipment?: string | null;
          days_per_week?: number | null;
          session_duration?: number | null;
          training_time?: string | null;
          diet_type?: string | null;
          meals_per_day?: number | null;
          budget?: string | null;
          food_restrictions?: string[] | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
          display_name?: string | null;
          goal?: string | null;
          gender?: string | null;
          age?: number | null;
          height?: number | null;
          weight?: number | null;
          target_weight?: number | null;
          experience?: string | null;
          equipment?: string | null;
          days_per_week?: number | null;
          session_duration?: number | null;
          training_time?: string | null;
          diet_type?: string | null;
          meals_per_day?: number | null;
          budget?: string | null;
          food_restrictions?: string[] | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      plans: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          updated_at: string;
          version: number;
          goal: string;
          calories: number;
          protein: number;
          carbs: number;
          fat: number;
          training_days: number;
          status: "active" | "archived";
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
          updated_at?: string;
          version?: number;
          goal: string;
          calories: number;
          protein: number;
          carbs: number;
          fat: number;
          training_days: number;
          status?: "active" | "archived";
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
          version?: number;
          goal?: string;
          calories?: number;
          protein?: number;
          carbs?: number;
          fat?: number;
          training_days?: number;
          status?: "active" | "archived";
        };
        Relationships: [
          {
            foreignKeyName: "plans_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      plan_workouts: {
        Row: {
          id: string;
          plan_id: string;
          day: string;
          title: string;
          exercise_data: WorkoutExercise[] | Json;
        };
        Insert: {
          id?: string;
          plan_id: string;
          day: string;
          title: string;
          exercise_data: WorkoutExercise[] | Json;
        };
        Update: {
          id?: string;
          plan_id?: string;
          day?: string;
          title?: string;
          exercise_data?: WorkoutExercise[] | Json;
        };
        Relationships: [
          {
            foreignKeyName: "plan_workouts_plan_id_fkey";
            columns: ["plan_id"];
            isOneToOne: false;
            referencedRelation: "plans";
            referencedColumns: ["id"];
          }
        ];
      };
      plan_meals: {
        Row: {
          id: string;
          plan_id: string;
          meal_type: string;
          meal_data: DayMeal | Json;
        };
        Insert: {
          id?: string;
          plan_id: string;
          meal_type: string;
          meal_data: DayMeal | Json;
        };
        Update: {
          id?: string;
          plan_id?: string;
          meal_type?: string;
          meal_data?: DayMeal | Json;
        };
        Relationships: [
          {
            foreignKeyName: "plan_meals_plan_id_fkey";
            columns: ["plan_id"];
            isOneToOne: false;
            referencedRelation: "plans";
            referencedColumns: ["id"];
          }
        ];
      };
      check_ins: {
        Row: {
          id: string;
          user_id: string;
          plan_id: string | null;
          weight_kg: number;
          created_at: string;
          notes: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_id?: string | null;
          weight_kg: number;
          created_at?: string;
          notes?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan_id?: string | null;
          weight_kg?: number;
          created_at?: string;
          notes?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "check_ins_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "check_ins_plan_id_fkey";
            columns: ["plan_id"];
            isOneToOne: false;
            referencedRelation: "plans";
            referencedColumns: ["id"];
          }
        ];
      };
      exports: {
        Row: {
          id: string;
          user_id: string;
          plan_id: string | null;
          type: "pdf" | "share_card";
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_id?: string | null;
          type: "pdf" | "share_card";
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan_id?: string | null;
          type?: "pdf" | "share_card";
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "exports_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "exports_plan_id_fkey";
            columns: ["plan_id"];
            isOneToOne: false;
            referencedRelation: "plans";
            referencedColumns: ["id"];
          }
        ];
      };
      reminder_preferences: {
        Row: {
          id: string;
          user_id: string;
          workout_reminder_enabled: boolean;
          workout_reminder_time: string;
          workout_reminder_days: string[];
          check_in_reminder_enabled: boolean;
          check_in_frequency: "weekly" | "bi_weekly";
          check_in_day: string;
          check_in_time: string;
          plan_review_reminder_enabled: boolean;
          plan_review_frequency_days: number;
          preferred_channels: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          workout_reminder_enabled?: boolean;
          workout_reminder_time?: string;
          workout_reminder_days?: string[];
          check_in_reminder_enabled?: boolean;
          check_in_frequency?: "weekly" | "bi_weekly";
          check_in_day?: string;
          check_in_time?: string;
          plan_review_reminder_enabled?: boolean;
          plan_review_frequency_days?: number;
          preferred_channels?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          workout_reminder_enabled?: boolean;
          workout_reminder_time?: string;
          workout_reminder_days?: string[];
          check_in_reminder_enabled?: boolean;
          check_in_frequency?: "weekly" | "bi_weekly";
          check_in_day?: string;
          check_in_time?: string;
          plan_review_reminder_enabled?: boolean;
          plan_review_frequency_days?: number;
          preferred_channels?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reminder_preferences_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      members: {
        Row: {
          id: string;
          member_id: string;
          full_name: string;
          phone: string;
          email: string | null;
          pin_hash: string;
          status: string;
          fitness_goal: string;
          plan_id: string | null;
          start_date: string;
          expiry_date: string | null;
          date_of_birth: string | null;
          gender: string | null;
          notes: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
          last_login_at: string | null;
        };
        Insert: {
          id?: string;
          member_id: string;
          full_name: string;
          phone: string;
          email?: string | null;
          pin_hash: string;
          status?: string;
          fitness_goal?: string;
          plan_id?: string | null;
          start_date?: string;
          expiry_date?: string | null;
          date_of_birth?: string | null;
          gender?: string | null;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
          last_login_at?: string | null;
        };
        Update: {
          id?: string;
          member_id?: string;
          full_name?: string;
          phone?: string;
          email?: string | null;
          pin_hash?: string;
          status?: string;
          fitness_goal?: string;
          plan_id?: string | null;
          start_date?: string;
          expiry_date?: string | null;
          date_of_birth?: string | null;
          gender?: string | null;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
          last_login_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type PlanRow = Database["public"]["Tables"]["plans"]["Row"];
export type PlanWorkoutRow = Database["public"]["Tables"]["plan_workouts"]["Row"];
export type PlanMealRow = Database["public"]["Tables"]["plan_meals"]["Row"];
export type CheckInRow = Database["public"]["Tables"]["check_ins"]["Row"];
export type ExportRow = Database["public"]["Tables"]["exports"]["Row"];
export type ReminderPreferencesRow = Database["public"]["Tables"]["reminder_preferences"]["Row"];


