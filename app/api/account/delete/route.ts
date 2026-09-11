import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database.types";

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("your-project")) {
      return NextResponse.json(
        { success: true, message: "Local demo session cleared.", isLocalMode: true },
        { status: 200 }
      );
    }

    // Origin / Host verification defense-in-depth against cross-site request forgery
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    if (origin && host) {
      try {
        const originUrl = new URL(origin);
        if (originUrl.host !== host) {
          return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
        }
      } catch {
        return NextResponse.json({ error: "Malformed request origin." }, { status: 400 });
      }
    }

    const cookieStore = await cookies();
    const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Handled safely in Route Handler
          }
        },
      },
    });

    // 1. Authenticate user from session token
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized session." }, { status: 401 });
    }

    const userId = user.id;

    // 2. Cascade delete all user application data
    // Delete reminder preferences & exports
    await supabase.from("reminder_preferences").delete().eq("user_id", userId);
    await supabase.from("exports").delete().eq("user_id", userId);

    // Delete check-ins
    await supabase.from("check_ins").delete().eq("user_id", userId);

    // Delete workouts and meals for user's plans
    const { data: userPlans } = await supabase
      .from("plans")
      .select("id")
      .eq("user_id", userId);

    if (userPlans && userPlans.length > 0) {
      const planIds = userPlans.map((p) => p.id);
      await supabase.from("plan_meals").delete().in("plan_id", planIds);
      await supabase.from("plan_workouts").delete().in("plan_id", planIds);
    }

    // Delete plans
    await supabase.from("plans").delete().eq("user_id", userId);

    // Delete profile
    await supabase.from("profiles").delete().eq("user_id", userId);

    // 3. Delete auth account if server-side service role key is present
    let authUserDeleted = false;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (serviceRoleKey && !serviceRoleKey.includes("your-service-role-key")) {
      try {
        const adminClient = createClient(supabaseUrl, serviceRoleKey, {
          auth: { autoRefreshToken: false, persistSession: false },
        });
        const { error: deleteAuthError } = await adminClient.auth.admin.deleteUser(userId);
        if (!deleteAuthError) {
          authUserDeleted = true;
        }
      } catch (adminErr) {
        console.warn("Could not delete from auth.users via admin API:", adminErr);
      }
    }

    // 4. Sign out the user's active session
    await supabase.auth.signOut();

    return NextResponse.json(
      {
        success: true,
        message: "Account and associated data deleted successfully.",
        authUserDeleted,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    console.error("Account deletion route error:", errorMsg);
    return NextResponse.json(
      { error: "Failed to delete account. Please try again later." },
      { status: 500 }
    );
  }
}
