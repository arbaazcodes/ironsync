import { getSupabase } from "@/lib/supabase/client";

/**
 * Determines the post-login destination for an authenticated Supabase user:
 * In IronSync, Supabase Auth is strictly for Admins -> /admin.
 */
export async function getPostLoginRedirect(
  userId?: string | null,
  supabaseClient?: any
): Promise<string> {
  return "/admin/members";
}
