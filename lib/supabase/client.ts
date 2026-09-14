import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/types/database.types";

let clientInstance: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return Boolean(
    url &&
    key &&
    url.trim().length > 0 &&
    key.trim().length > 0 &&
    !url.includes("your-project") &&
    !key.includes("your-")
  );
}

/**
 * Creates or retrieves the singleton Browser Supabase client.
 * Uses only browser-safe public environment variables and manages cookies automatically.
 */
export function getSupabase() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!clientInstance) {
    clientInstance = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      key!
    );
  }

  return clientInstance;
}

export function createClient() {
  return getSupabase();
}
