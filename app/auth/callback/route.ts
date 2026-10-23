import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { safeRedirectPath } from "@/lib/auth/redirect";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const response = NextResponse.redirect(new URL(safeRedirectPath(params.get("next")), request.url));
  response.headers.set("Cache-Control", "no-store");
  const fail = () => NextResponse.redirect(new URL("/auth?mode=signin&error=confirmation_failed", request.url));
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || params.has("error")) return fail();
  const client = createServerClient(url, key, { cookies: {
    getAll: () => request.cookies.getAll(),
    setAll: (cookies) => cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options)),
  } });
  try {
    const code = params.get("code");
    const tokenHash = params.get("token_hash");
    const type = params.get("type");
    const result = code
      ? await client.auth.exchangeCodeForSession(code)
      : tokenHash && (type === "email" || type === "recovery")
        ? await client.auth.verifyOtp({ token_hash: tokenHash, type })
        : null;
    if (!result || result.error || !result.data.user) return fail();
    if (type === "recovery") response.headers.set("Location", new URL("/auth/update-password", request.url).toString());
    return response;
  } catch { return fail(); }
}
