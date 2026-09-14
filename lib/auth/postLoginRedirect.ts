import { getSupabase } from "@/lib/supabase/client";

/**
 * Determines the post-login destination for an authenticated athlete:
 * - Returning user with active plan in Supabase -> /dashboard
 * - New user without an active plan -> /onboarding
 */
export async function getPostLoginRedirect(
  userId?: string | null,
  supabaseClient?: any
): Promise<string> {
  if (!userId) {
    return "/onboarding";
  }

  const supabase = supabaseClient || getSupabase();
  if (!supabase) {
    return "/dashboard";
  }

  try {
    const { data, error } = await supabase
      .from("plans")
      .select("id")
      .eq("user_id", userId)
      .eq("status", "active")
      .limit(1);

    if (!error && Array.isArray(data) && data.length > 0) {
      return "/dashboard";
    }
  } catch (err) {
    console.warn("Could not check active plan for user in postLoginRedirect:", err);
  }

  return "/onboarding";
}
