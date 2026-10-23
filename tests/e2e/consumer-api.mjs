// Integration checks against the isolated local Auth/PostgREST fixture and Next dev server.
// Start tests/e2e/supabase-fixture.mjs and the app with fixture env before running.
import assert from "node:assert/strict";
import { createServerClient } from "@supabase/ssr";
const origin = "http://localhost:3100";
const cookies = new Map();
const client = createServerClient(
  "http://127.0.0.1:54329",
  "sb_publishable_fixture",
  {
    cookies: {
      getAll: () => [...cookies].map(([name, value]) => ({ name, value })),
      setAll: (values) =>
        values.forEach(({ name, value }) => cookies.set(name, value)),
    },
  },
);
const login = await client.auth.signInWithPassword({
  email: "other@example.test",
  password: "test-password-123",
});
assert.equal(login.error, null);
const headers = {
  origin,
  "Content-Type": "application/json",
  Cookie: [...cookies].map(([name, value]) => `${name}=${value}`).join("; "),
};
async function request(path, method = "GET", body, extra = {}) {
  const response = await fetch(origin + path, {
    method,
    headers: { ...headers, ...extra },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await response.json();
  return {
    status: response.status,
    data,
    cache: response.headers.get("cache-control"),
  };
}
const initial = await request("/api/program");
assert.equal(initial.status, 200);
assert.equal(initial.cache, "private, no-store");
assert.equal(
  initial.data.programs.length,
  0,
  "The second account must not see the first account's program",
);
const todayLocal = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Kolkata",
}).format(new Date());
const trainingWeekday = new Date(todayLocal + "T12:00:00Z").getUTCDay();
const preferences = {
  goal: "strength",
  age: 30,
  heightCm: 178,
  weightKg: 75,
  sex: "male",
  experience: "intermediate",
  equipment: ["dumbbells"],
  trainingDays: [trainingWeekday, (trainingWeekday + 2) % 7],
  duration: 30,
  activity: "seated",
  diet: "vegan",
  meals: 3,
  allergies: [],
  needsProfessionalGuidance: false,
  timeZone: "Asia/Kolkata",
};
assert.equal(
  (
    await request("/api/program", "POST", {
      preferences: { ...preferences, age: 12 },
      expectedRevision: 0,
    })
  ).status,
  400,
);
assert.equal(
  (
    await request("/api/program", "POST", {
      preferences,
      expectedRevision: 0,
      user_id: "spoofed",
    })
  ).status,
  400,
);
assert.equal(
  (
    await request(
      "/api/program",
      "POST",
      { preferences, expectedRevision: 0 },
      { origin: "https://evil.example" },
    )
  ).status,
  403,
);
const race = await Promise.all([
  request("/api/program", "POST", { preferences, expectedRevision: 0 }),
  request("/api/program", "POST", { preferences, expectedRevision: 0 }),
]);
assert.deepEqual(race.map((r) => r.status).sort(), [200, 409]);
const saved = await request("/api/program");
assert.equal(saved.data.programs.length, 1);
assert.equal(saved.data.revision, 1);
const today = saved.data.programs[0].program.startsOn;
assert.equal(
  (
    await request("/api/program/day", "PUT", {
      day: "2099-01-01",
      status: "skipped",
    })
  ).status,
  400,
);
assert.equal(
  (await request("/api/program/day", "PUT", { day: today, status: "skipped" }))
    .status,
  200,
);
assert.equal((await request("/api/program")).data.overrides[today], "skipped");
assert.equal(
  (await request("/api/program/day", "PUT", { day: today, status: "planned" }))
    .status,
  200,
);
assert.equal((await request("/api/program")).data.overrides[today], "planned");
assert.equal(
  (await request("/api/workouts?from=2026-01-01&to=2026-12-31")).status,
  400,
);
assert.equal(
  (
    await request(
      "/api/workouts?from=2026-10-01T00%3A00%3A00Z&to=2026-11-01T00%3A00%3A00Z",
    )
  ).status,
  200,
);
assert.deepEqual((await request("/api/workouts")).data.sessions, []);
console.log(
  "Consumer API integration passed: auth isolation, validation, origin checks, concurrent save, persisted skip/undo and bounded history.",
);
await client.auth.signOut();
