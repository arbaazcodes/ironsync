import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getPostLoginRedirect } from "@/lib/auth/postLoginRedirect";
import { DEFAULT_PRODUCTION_SITE_URL } from "@/lib/config/site";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // Resolve base origin: preserve current valid host (ironsync.online, ironsync-peach, or localhost),
  // but remap any legacy ironsync.vercel.app to canonical production.
  let baseOrigin = origin;
  const forwardedHost = request.headers.get("x-forwarded-host");
  if (forwardedHost) {
    const proto = request.headers.get("x-forwarded-proto") || "https";
    baseOrigin = `${proto}://${forwardedHost}`;
  }
  if (baseOrigin.includes("ironsync.vercel.app") && !baseOrigin.includes("ironsync-peach")) {
    baseOrigin = DEFAULT_PRODUCTION_SITE_URL;
  }

  if (error) {
    console.error("Supabase OAuth error returned:", error, errorDescription);
    return NextResponse.redirect(`${baseOrigin}/login?error=oauth_callback_failed`);
  }

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      let targetPath = rawNext || "/admin";
      let response = NextResponse.redirect(`${baseOrigin}${targetPath}`);

      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      });

      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      if (!exchangeError && data.user) {
        if (!rawNext) {
          targetPath = await getPostLoginRedirect(data.user.id, supabase);
        }

        const redirectRes = NextResponse.redirect(`${baseOrigin}${targetPath}`);
        response.cookies.getAll().forEach((c) => {
          redirectRes.cookies.set(c.name, c.value, c);
        });
        return redirectRes;
      }

      console.error("Failed to exchange code for session:", exchangeError?.message);
    }
  }

  return NextResponse.redirect(`${baseOrigin}/login?error=oauth_callback_failed`);
}
