import { getSupabase } from "../supabase/client";

export type DeliveryChannel = "email" | "push" | "whatsapp";

export interface ReminderPreferences {
  workoutReminderEnabled: boolean;
  workoutReminderTime: string;
  workoutReminderDays: string[];
  checkInReminderEnabled: boolean;
  checkInFrequency: "weekly" | "bi_weekly";
  checkInDay: string;
  checkInTime: string;
  planReviewReminderEnabled: boolean;
  planReviewFrequencyDays: number;
  preferredChannels: DeliveryChannel[];
}

export const DEFAULT_REMINDER_PREFERENCES: ReminderPreferences = {
  workoutReminderEnabled: false,
  workoutReminderTime: "07:00",
  workoutReminderDays: ["MON", "TUE", "THU", "FRI"],
  checkInReminderEnabled: false,
  checkInFrequency: "weekly",
  checkInDay: "SUN",
  checkInTime: "08:00",
  planReviewReminderEnabled: false,
  planReviewFrequencyDays: 30,
  preferredChannels: ["email"],
};

const REMINDERS_CACHE_PREFIX = "ironsync_reminders_";

/**
 * Reads local cached reminder preferences for a user.
 */
function getLocalCachedReminders(userId: string): ReminderPreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${REMINDERS_CACHE_PREFIX}${userId}`);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn("Could not read cached reminders:", err);
  }
  return null;
}

/**
 * Writes reminder preferences to local cache.
 */
function setLocalCachedReminders(userId: string, prefs: ReminderPreferences) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${REMINDERS_CACHE_PREFIX}${userId}`, JSON.stringify(prefs));
  } catch (err) {
    console.warn("Could not write cached reminders:", err);
  }
}

/**
 * Fetches user reminder preferences with fallback to local cache and strict opt-in defaults.
 */
export async function fetchUserReminderPreferences(
  userId: string
): Promise<ReminderPreferences> {
  const cached = getLocalCachedReminders(userId);
  const supabase = getSupabase();

  if (supabase && userId) {
    try {
      const { data, error } = await supabase
        .from("reminder_preferences")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (!error && data) {
        const loaded: ReminderPreferences = {
          workoutReminderEnabled: data.workout_reminder_enabled,
          workoutReminderTime: data.workout_reminder_time || "07:00",
          workoutReminderDays: data.workout_reminder_days || ["MON", "TUE", "THU", "FRI"],
          checkInReminderEnabled: data.check_in_reminder_enabled,
          checkInFrequency: (data.check_in_frequency as "weekly" | "bi_weekly") || "weekly",
          checkInDay: data.check_in_day || "SUN",
          checkInTime: data.check_in_time || "08:00",
          planReviewReminderEnabled: data.plan_review_reminder_enabled,
          planReviewFrequencyDays: data.plan_review_frequency_days || 30,
          preferredChannels: (data.preferred_channels as DeliveryChannel[]) || ["email"],
        };
        setLocalCachedReminders(userId, loaded);
        return loaded;
      }
    } catch (err) {
      console.warn("Could not query Supabase reminder_preferences (using local cache):", err);
    }
  }

  return cached || { ...DEFAULT_REMINDER_PREFERENCES };
}

/**
 * Saves user reminder preferences to local cache and Supabase.
 */
export async function saveUserReminderPreferences(
  userId: string,
  prefs: ReminderPreferences
): Promise<{ success: boolean; error?: string }> {
  // 1. Update local cache immediately
  setLocalCachedReminders(userId, prefs);

  // 2. Persist to Supabase if connected
  const supabase = getSupabase();
  if (supabase && userId) {
    try {
      const { error } = await supabase.from("reminder_preferences").upsert(
        {
          user_id: userId,
          workout_reminder_enabled: prefs.workoutReminderEnabled,
          workout_reminder_time: prefs.workoutReminderTime,
          workout_reminder_days: prefs.workoutReminderDays,
          check_in_reminder_enabled: prefs.checkInReminderEnabled,
          check_in_frequency: prefs.checkInFrequency,
          check_in_day: prefs.checkInDay,
          check_in_time: prefs.checkInTime,
          plan_review_reminder_enabled: prefs.planReviewReminderEnabled,
          plan_review_frequency_days: prefs.planReviewFrequencyDays,
          preferred_channels: prefs.preferredChannels,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

      if (error) {
        console.warn("Supabase reminder_preferences upsert warning:", error.message);
      }
    } catch (err: any) {
      console.warn("Supabase reminder_preferences save error (saved locally):", err?.message || err);
    }
  }

  return { success: true };
}
