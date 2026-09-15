import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { verifyMemberSessionTokenEdge } from "@/lib/security/memberSessionEdge";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const pathname = request.nextUrl.pathname;

  // Check Supabase session (Admin Auth)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const rawKey1 = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const rawKey2 = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  const supabaseKey =
    (rawKey1 && (rawKey1.startsWith("eyJ") || rawKey1.startsWith("sb_publishable")) ? rawKey1 : null) ||
    (rawKey2 && (rawKey2.startsWith("eyJ") || rawKey2.startsWith("sb_publishable")) ? rawKey2 : null);

  let adminUser = null;

  if (supabaseUrl && supabaseKey) {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();
    adminUser = user;

    // Do not treat every Supabase user as admin if gym_admins exists
    if (adminUser) {
      try {
        const { data: gymAdmin, error: adminErr } = await (supabase as any)
          .from("gym_admins")
          .select("user_id")
          .eq("user_id", adminUser.id)
          .maybeSingle();

        // If gym_admins table exists without query error, user must be present in it
        if (!adminErr && !gymAdmin) {
          adminUser = null;
        }
      } catch {
        // gym_admins table doesn't exist, proceed with current admin auth
      }
    }
  }

  // Member session cookie check (timing-safe HMAC-SHA256 verification)
  const memberCookie = request.cookies.get("ironsync_member_session")?.value;
  const memberSession = await verifyMemberSessionTokenEdge(memberCookie);
  const hasValidMemberSession = memberSession !== null;

  // 1. Guard /admin routes -> Requires Admin Auth
  if (pathname.startsWith("/admin")) {
    if (!adminUser) {
      // If user is a member trying to access /admin, redirect to member dashboard
      if (hasValidMemberSession) {
        const memberDashUrl = request.nextUrl.clone();
        memberDashUrl.pathname = "/member/dashboard";
        return NextResponse.redirect(memberDashUrl);
      }
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.searchParams.set("tab", "admin");
      redirectUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // 2. Guard /member routes -> Requires valid member cookie
  if (pathname.startsWith("/member")) {
    if (!hasValidMemberSession) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.searchParams.set("tab", "member");
      redirectUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // 3. Handle /dashboard routes -> Route to Member or Admin dashboard
  if (pathname.startsWith("/dashboard")) {
    if (hasValidMemberSession) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/member/dashboard";
      return NextResponse.redirect(redirectUrl);
    }
    if (adminUser) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/admin";
      return NextResponse.redirect(redirectUrl);
    }
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("tab", "member");
    return NextResponse.redirect(redirectUrl);
  }

  // 4. Handle /onboarding route -> Skip/hide public onboarding for active sessions
  if (pathname.startsWith("/onboarding")) {
    if (hasValidMemberSession) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/member/dashboard";
      return NextResponse.redirect(redirectUrl);
    }
    if (adminUser) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/admin";
      return NextResponse.redirect(redirectUrl);
    }
  }

  // 5. Handle logged-in user visiting /login
  if (pathname === "/login") {
    const tab = request.nextUrl.searchParams.get("tab");

    // If logged in member visits /login with tab=member (or default tab):
    if (hasValidMemberSession && (!tab || tab === "member")) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/member/dashboard";
      redirectUrl.search = "";
      return NextResponse.redirect(redirectUrl);
    }

    // If logged in admin visits /login with tab=admin (or default tab if not a member):
    if (adminUser && (tab === "admin" || (!tab && !hasValidMemberSession))) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/admin";
      redirectUrl.search = "";
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images, png, jpg, svg, webp, etc.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
