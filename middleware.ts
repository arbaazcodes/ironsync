import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { verifyMemberSessionTokenEdge } from "@/lib/security/memberSessionEdge";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const path = request.nextUrl.pathname;
  const origin = request.headers.get("origin");
  if (path.startsWith("/api/") && !["GET", "HEAD", "OPTIONS"].includes(request.method) && origin && origin !== request.nextUrl.origin) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  let signedIn = false;
  let isAdmin = false;
  if (url && key) {
    const client = createServerClient(url, key, { cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookies) => {
        cookies.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    } });
    try {
      const { data: { user }, error } = await client.auth.getUser();
      signedIn = !error && Boolean(user);
      if (signedIn && user && (path.startsWith("/admin") || request.nextUrl.searchParams.get("tab") === "admin")) {
        const result = await client.from("gym_admins").select("user_id").eq("user_id", user.id).maybeSingle();
        isAdmin = !result.error && Boolean(result.data);
      }
    } catch { /* Authentication and role lookup fail closed. */ }
  }
  function redirect(target: string) {
    const next = NextResponse.redirect(new URL(target, request.url));
    response.cookies.getAll().forEach((cookie) => next.cookies.set(cookie));
    return next;
  }
  if (path.startsWith("/admin") && !isAdmin) {
    return redirect("/login?tab=admin&error=unauthorized_admin&next=" + encodeURIComponent(path));
  }
  if (path.startsWith("/member") || (path === "/login" && request.nextUrl.searchParams.get("tab") === "member")) {
    const member = await verifyMemberSessionTokenEdge(request.cookies.get("ironsync_member_session")?.value);
    if (path.startsWith("/member") && !member) return redirect("/login?tab=member&next=" + encodeURIComponent(path));
    if (path === "/login" && member) return redirect("/member/dashboard");
  }
  if ((path.startsWith("/dashboard") || path.startsWith("/onboarding")) && !signedIn) {
    return redirect("/auth?mode=signin&next=" + encodeURIComponent(path + request.nextUrl.search));
  }
  if (path === "/login") {
    const tab = request.nextUrl.searchParams.get("tab");
    if (tab === "admin" && isAdmin) return redirect("/admin/members");
    if (tab !== "admin" && tab !== "member") {
      return redirect("/auth?mode=signin&next=" + encodeURIComponent(request.nextUrl.searchParams.get("next") || "/dashboard"));
    }
  }
  // Sign in before collecting preferences. APIs authorize their own data access.
  if (path.startsWith("/dashboard") || path.startsWith("/admin") || path.startsWith("/member")) response.headers.set("Cache-Control", "private, no-store");
  return response;
}
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"] };
