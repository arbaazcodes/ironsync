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
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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

  // 2. Guard /member routes -> Requires Member Session or Admin Preview
  if (pathname.startsWith("/member")) {
    if (!hasValidMemberSession && !adminUser) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.searchParams.set("tab", "member");
      redirectUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // 3. Handle /dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (adminUser) {
      return response;
    }
    if (hasValidMemberSession) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/member/dashboard";
      return NextResponse.redirect(redirectUrl);
    }
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("next", "/dashboard");
    return NextResponse.redirect(redirectUrl);
  }

  // 4. Handle logged-in user visiting /login
  if (pathname === "/login" && adminUser) {
    const tab = request.nextUrl.searchParams.get("tab");
    if (!tab || tab === "athlete") {
      // Check if user has an active plan in Supabase
      if (supabaseUrl && supabaseKey) {
        try {
          const supabase = createServerClient(supabaseUrl, supabaseKey, {
            cookies: {
              getAll() {
                return request.cookies.getAll();
              },
              setAll() {},
            },
          });
          const { data: plan } = await supabase
            .from("plans")
            .select("id")
            .eq("user_id", adminUser.id)
            .eq("status", "active")
            .limit(1)
            .maybeSingle();

          const redirectUrl = request.nextUrl.clone();
          redirectUrl.pathname = plan ? "/dashboard" : "/onboarding";
          redirectUrl.search = "";
          return NextResponse.redirect(redirectUrl);
        } catch {
          const redirectUrl = request.nextUrl.clone();
          redirectUrl.pathname = "/dashboard";
          redirectUrl.search = "";
          return NextResponse.redirect(redirectUrl);
        }
      }
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
