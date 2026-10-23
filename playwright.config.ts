import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e", timeout: 120000, workers: 1,
  use: { baseURL: "http://localhost:3100", viewport: { width: 390, height: 844 }, trace: "retain-on-failure" },
  webServer: [
    { command: "node tests/e2e/supabase-fixture.mjs", url: "http://127.0.0.1:54329/health", reuseExistingServer: false, timeout: 30000 },
    { command: "npm run dev -- --port 3100", url: "http://localhost:3100/auth", reuseExistingServer: false, timeout: 120000,
      env: { NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54329", NEXT_PUBLIC_SUPABASE_ANON_KEY: "sb_publishable_test_fixture_only",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test_fixture_only", SUPABASE_SERVICE_ROLE_KEY: "test-fixture-no-production-access",
        MEMBER_SESSION_SECRET: "test-fixture-secret-at-least-thirty-two-characters", NEXT_PUBLIC_SITE_URL: "http://localhost:3100" } },
  ],
});
