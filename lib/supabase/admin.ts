import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database.types";

let serviceClientInstance: SupabaseClient<Database> | null = null;

export function isServiceRoleConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return Boolean(
    url &&
    serviceKey &&
    url.trim().length > 0 &&
    serviceKey.trim().length > 0 &&
    !url.includes("your-project") &&
    serviceKey !== "your-service-role-secret-key-here"
  );
}

/**
 * Creates or retrieves the singleton Server Supabase Service Role client.
 * Uses SUPABASE_SERVICE_ROLE_KEY to perform privileged database operations
 * on the server, completely bypassing Row Level Security (RLS).
 *
 * Configured with persistSession: false and autoRefreshToken: false.
 * NEVER import or invoke this function inside client components.
 */
export function createServiceClient(): SupabaseClient<Database> | null {
  if (!isServiceRoleConfigured()) {
    return null;
  }

  if (!serviceClientInstance) {
    serviceClientInstance = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );
  }

  return serviceClientInstance;
}
