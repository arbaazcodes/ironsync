import {
  trackEvent,
  getAnalyticsEventLog,
  clearAnalyticsEventLog,
  getFunnelMetrics,
  sanitizeProperties,
  isForbiddenKey,
  registerAnalyticsProvider,
  unregisterAnalyticsProvider,
  AnalyticsProvider,
  AnalyticsEventName,
} from "../lib/analytics";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASS: ${message}`);
}

console.log("\n=======================================================");
console.log("RUNNING IRONSYNC PRODUCT ANALYTICS TESTS");
console.log("=======================================================\n");

// -----------------------------------------------------------------------------
// TEST 1: Privacy Sanitizer - Forbidden Keys Detection & Stripping
// -----------------------------------------------------------------------------
console.log("--- TEST 1: Privacy Sanitizer Stripping Forbidden Keys ---");

assert(isForbiddenKey("weight"), "weight should be forbidden");
assert(isForbiddenKey("weightKg"), "weightKg should be forbidden");
assert(isForbiddenKey("weight_kg"), "weight_kg should be forbidden");
assert(isForbiddenKey("heightCm"), "heightCm should be forbidden");
assert(isForbiddenKey("bmi"), "bmi should be forbidden");
assert(isForbiddenKey("body_fat"), "body_fat should be forbidden");
assert(isForbiddenKey("allergies"), "allergies should be forbidden");
assert(isForbiddenKey("medical_information"), "medical_information should be forbidden");
assert(isForbiddenKey("injuries"), "injuries should be forbidden");
assert(isForbiddenKey("password"), "password should be forbidden");
assert(isForbiddenKey("otp"), "otp should be forbidden");
assert(isForbiddenKey("token"), "token should be forbidden");
assert(isForbiddenKey("phoneNumber"), "phoneNumber should be forbidden");
assert(isForbiddenKey("email"), "email should be forbidden");

const dirtyPayload = {
  goal: "muscle_gain",
  days_per_week: 4,
  customized: true,
  // Sensitive forbidden fields:
  weightKg: 85.5,
  heightCm: 180,
  bmi: 26.4,
  allergies: ["peanuts", "shellfish"],
  dietary_restrictions: ["no dairy"],
  medical_history: "asthma",
  password: "supersecret123!",
  otp: "894123",
  auth_token: "jwt.header.payload",
  user_email: "athlete@example.com",
};

const sanitized = sanitizeProperties(dirtyPayload);

assert(sanitized.goal === "muscle_gain", "Permitted property 'goal' is preserved");
assert(sanitized.days_per_week === 4, "Permitted property 'days_per_week' is preserved");
assert(sanitized.customized === true, "Permitted boolean 'customized' is preserved");

assert(!("weightKg" in sanitized), "weightKg was stripped");
assert(!("heightCm" in sanitized), "heightCm was stripped");
assert(!("bmi" in sanitized), "bmi was stripped");
assert(!("allergies" in sanitized), "allergies was stripped");
assert(!("dietary_restrictions" in sanitized), "dietary_restrictions was stripped");
assert(!("medical_history" in sanitized), "medical_history was stripped");
assert(!("password" in sanitized), "password was stripped");
assert(!("otp" in sanitized), "otp was stripped");
assert(!("auth_token" in sanitized), "auth_token was stripped");
assert(!("user_email" in sanitized), "user_email was stripped");

// -----------------------------------------------------------------------------
// TEST 2: Event Dispatching & Mock Provider
// -----------------------------------------------------------------------------
console.log("\n--- TEST 2: Event Dispatching & Mock Provider ---");

clearAnalyticsEventLog();

const capturedEvents: { name: string; props: any }[] = [];
const mockProvider: AnalyticsProvider = {
  name: "test_mock",
  track: (name, props) => {
    capturedEvents.push({ name, props });
  },
};

registerAnalyticsProvider(mockProvider);

trackEvent("landing_view", { referrer: "google" });
trackEvent("blueprint_started", { entry_source: "hero_cta" });
trackEvent("goal_selected", { goal: "muscle_gain" });
trackEvent("body_step_completed", { gender: "male", has_target_weight: true, weightKg: 80 }); // weightKg should be stripped!
trackEvent("training_step_completed", { experience: "intermediate", days_per_week: 4 });
trackEvent("nutrition_step_completed", { diet_type: "high_protein", allergies: ["dairy"] }); // allergies should be stripped!
trackEvent("deliverable_selected", { deliverables: ["workout", "nutrition"] });
trackEvent("blueprint_generated", { split_name: "Upper Lower 4-Day" });
trackEvent("blueprint_preview_viewed", { goal: "muscle_gain" });
trackEvent("auth_started", { source: "preview_cta" });
trackEvent("auth_completed", { method: "google" });
trackEvent("plan_saved", { plan_id: "plan-123", version: 1 });
trackEvent("dashboard_viewed", { plan_version: 1 });
trackEvent("workout_viewed", { day_idx: 0 });
trackEvent("nutrition_viewed", { meal_count: 4 });
trackEvent("pdf_generated", { plan_version: 1 });
trackEvent("share_card_generated", { action: "download" });
trackEvent("check_in_completed", { has_notes: false, weightKg: 81.2 }); // weightKg should be stripped!
trackEvent("plan_recalibration_started", { source: "progress_page" });

assert(capturedEvents.length === 19, `All 19 required events were dispatched (got ${capturedEvents.length})`);

// Verify sensitive properties were sanitized in mock provider
const bodyStepEvent = capturedEvents.find((e) => e.name === "body_step_completed");
assert(bodyStepEvent?.props.gender === "male", "body_step_completed preserved gender");
assert(!("weightKg" in (bodyStepEvent?.props || {})), "body_step_completed stripped weightKg");

const checkInEvent = capturedEvents.find((e) => e.name === "check_in_completed");
assert(checkInEvent?.props.has_notes === false, "check_in_completed preserved has_notes");
assert(!("weightKg" in (checkInEvent?.props || {})), "check_in_completed stripped weightKg");

unregisterAnalyticsProvider("test_mock");

// -----------------------------------------------------------------------------
// TEST 3: Funnel Metrics & Conversion Calculation
// -----------------------------------------------------------------------------
console.log("\n--- TEST 3: Funnel Conversion & Drop-off Analysis ---");

clearAnalyticsEventLog();

// Simulate 100 landings, 70 onboarding started, 50 completed, 45 generated, 30 auth started, 25 auth completed, 20 plans saved
for (let i = 0; i < 100; i++) trackEvent("landing_view");
for (let i = 0; i < 70; i++) trackEvent("blueprint_started");
for (let i = 0; i < 50; i++) trackEvent("deliverable_selected");
for (let i = 0; i < 45; i++) trackEvent("blueprint_generated");
for (let i = 0; i < 30; i++) trackEvent("auth_started");
for (let i = 0; i < 25; i++) trackEvent("auth_completed");
for (let i = 0; i < 20; i++) trackEvent("plan_saved");

const funnel = getFunnelMetrics();

console.log("Calculated Funnel:");
for (const stage of funnel.stages) {
  console.log(
    `  Step ${stage.stepNumber}: ${stage.label} -> Count: ${stage.count} | Conv prev: ${stage.conversionFromPrevious}% | Conv overall: ${stage.conversionFromFirst}% | Dropoff: ${stage.dropoffCount} (${stage.dropoffRate}%)`
  );
}

assert(funnel.stages.length === 7, "Funnel contains 7 canonical steps");
assert(funnel.totalStarted === 100, "Funnel started with 100 users");
assert(funnel.totalCompleted === 20, "Funnel completed with 20 plans saved");
assert(funnel.overallConversionRate === 20, "Overall conversion rate is 20%");

// Check step 2 (onboarding_started)
assert(funnel.stages[1].count === 70, "Onboarding started count is 70");
assert(funnel.stages[1].conversionFromPrevious === 70, "Step 2 conversion from previous is 70%");
assert(funnel.stages[1].dropoffCount === 30, "Step 2 drop-off count is 30");

// Check step 7 (plan_saved)
assert(funnel.stages[6].count === 20, "Plan saved count is 20");
assert(funnel.stages[6].conversionFromPrevious === 80, "Step 7 conversion from auth_completed (20/25) is 80%");

console.log("\n=======================================================");
console.log("ALL ANALYTICS TESTS PASSED SUCCESSFULLY! ✅");
console.log("=======================================================\n");
