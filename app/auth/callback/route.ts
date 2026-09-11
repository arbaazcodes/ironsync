import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { validateSafeRedirect } from "@/lib/auth/redirect";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next");
  const safeRedirectUrl = validateSafeRedirect(nextParam, origin);

  if (code) {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        // Successfully exchanged code for session in cookies
        return NextResponse.redirect(safeRedirectUrl);
      }
      console.error("OAuth exchange failed:", error.message);
    }
  }

  // If code exchange failed or no code provided, redirect back to auth with error
  return NextResponse.redirect(`${origin}/auth?error=oauth_callback_failed`);
}
