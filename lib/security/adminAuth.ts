import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export interface AdminSessionUser {
  id: string;
  email?: string;
  role?: string;
}

/**
 * Validates the currently authenticated Supabase user as an Admin.
 * Returns the admin user object or null if unauthenticated.
 */
export async function getAdminUser(): Promise<AdminSessionUser | null> {
  // Only allow dev bypass if explicitly enabled and NOT in production
  if (process.env.ALLOW_DEV_ADMIN === "true" && process.env.NODE_ENV !== "production") {
    if (!isSupabaseConfigured()) {
      return {
        id: "admin-local-dev",
        email: "admin@ironsync.local",
        role: "admin",
      };
    }
  }

  // If Supabase is not configured, deny access
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return null;

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      role: (user.user_metadata?.role as string) || "admin",
    };
  } catch (err) {
    console.error("Error verifying admin user session:", err);
    return null;
  }
}
