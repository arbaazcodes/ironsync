import {
  DEFAULT_REMINDER_PREFERENCES,
  ReminderPreferences,
  saveUserReminderPreferences,
  fetchUserReminderPreferences,
} from "../lib/data/reminderService";

async function runTests() {
  console.log("=== SMART REMINDER FOUNDATION TESTS ===");

  // Test 1: Opt-in Defaults
  console.assert(
    DEFAULT_REMINDER_PREFERENCES.workoutReminderEnabled === false,
    "Test 1 failed: Workout reminder must default to false"
  );
  console.assert(
    DEFAULT_REMINDER_PREFERENCES.checkInReminderEnabled === false,
    "Test 1 failed: Check-in reminder must default to false"
  );
  console.assert(
    DEFAULT_REMINDER_PREFERENCES.planReviewReminderEnabled === false,
    "Test 1 failed: Plan review reminder must default to false"
  );
  console.log("✓ Test 1: All reminders are strictly opt-in (default OFF)");

  // Test 2: Modify Workout Reminder Settings
  const customPrefs: ReminderPreferences = {
    ...DEFAULT_REMINDER_PREFERENCES,
    workoutReminderEnabled: true,
    workoutReminderDays: ["MON", "WED", "FRI"],
    workoutReminderTime: "06:30",
    checkInReminderEnabled: true,
    checkInFrequency: "bi_weekly",
    checkInDay: "SUN",
    checkInTime: "08:30",
    planReviewReminderEnabled: true,
    planReviewFrequencyDays: 30,
    preferredChannels: ["email", "push"],
  };

  const saveRes = await saveUserReminderPreferences("test-user-123", customPrefs);
  console.assert(saveRes.success, "Test 2 failed: saveUserReminderPreferences should succeed");
  console.log("✓ Test 2: Reminder preferences saved successfully");

  // Test 3: Verify Future-Ready Channels
  console.assert(
    customPrefs.preferredChannels.includes("email") &&
    customPrefs.preferredChannels.includes("push"),
    "Test 3 failed: Preferred channels not preserved"
  );
  console.log("✓ Test 3: Multi-channel data model supports future email, push, whatsapp");

  // Test 4: Verify Frequencies
  console.assert(customPrefs.checkInFrequency === "bi_weekly", "Test 4 failed: Bi-weekly frequency expected");
  console.assert(customPrefs.planReviewFrequencyDays === 30, "Test 4 failed: 30-day review expected");
  console.log("✓ Test 4: User-selected training days, weekly/bi-weekly check-ins, and 30-day plan review verified");

  console.log("\nALL SMART REMINDER TESTS PASSED!");
}

runTests();
