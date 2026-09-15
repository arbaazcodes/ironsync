import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getPostLoginRedirect } from "@/lib/auth/postLoginRedirect";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  if (error) {
    console.error("Supabase OAuth error returned:", error, errorDescription);
    return NextResponse.redirect(`${origin}/login?error=oauth_callback_failed`);
  }

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      let targetPath = rawNext || "/admin";
      let response = NextResponse.redirect(`${origin}${targetPath}`);

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

        const forwardedHost = request.headers.get("x-forwarded-host");
        const isLocal = process.env.NODE_ENV === "development";
        if (isLocal || !forwardedHost) {
          const redirectRes = NextResponse.redirect(`${origin}${targetPath}`);
          // Copy session cookies
          response.cookies.getAll().forEach((c) => {
            redirectRes.cookies.set(c.name, c.value, c);
          });
          return redirectRes;
        }

        const redirectRes = NextResponse.redirect(`https://${forwardedHost}${targetPath}`);
        response.cookies.getAll().forEach((c) => {
          redirectRes.cookies.set(c.name, c.value, c);
        });
        return redirectRes;
      }

      console.error("Failed to exchange code for session:", exchangeError?.message);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=oauth_callback_failed`);
}
