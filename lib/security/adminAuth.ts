import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface AdminSessionUser { id: string; email?: string; role: "admin" }

/** Administrative privileges require a positive, server-verified allowlist match. */
export async function getAdminUser(): Promise<AdminSessionUser | null> {
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return null;
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    const { data, error: lookupError } = await supabase.from("gym_admins")
      .select("user_id").eq("user_id", user.id).maybeSingle();
    if (lookupError || !data) return null;
    return { id: user.id, email: user.email, role: "admin" };
  } catch { return null; }
}
