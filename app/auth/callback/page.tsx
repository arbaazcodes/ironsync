"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabase } from "@/lib/supabase/client";
import { Loader2, Activity, CheckCircle2, AlertCircle } from "lucide-react";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    let active = true;

    async function processAuth() {
      const code = searchParams.get("code");
      const next = searchParams.get("next") || "/dashboard";
      const error = searchParams.get("error_description") || searchParams.get("error");

      if (error) {
        if (active) {
          setStatus("error");
          setErrorMessage(error);
          setTimeout(() => router.replace("/auth?error=oauth_callback_failed"), 2000);
        }
        return;
      }

      const supabase = getSupabase();
      if (!supabase) {
        // Local mode fallback
        if (active) {
          setStatus("success");
          router.replace(next);
        }
        return;
      }

      try {
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
        } else {
          // Check if session is already populated via implicit hash fragment
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) {
            throw new Error("No session or authorization code provided.");
          }
        }

        if (active) {
          setStatus("success");
          router.replace(next);
        }
      } catch (err: any) {
        console.error("Client OAuth callback failure:", err);
        if (active) {
          setStatus("error");
          setErrorMessage(err?.message || "Authentication failed");
          setTimeout(() => router.replace("/auth?error=oauth_callback_failed"), 2000);
        }
      }
    }

    processAuth();

    return () => {
      active = false;
    };
  }, [searchParams, router]);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 max-w-sm rounded-2xl bg-surface border border-border shadow-2xl">
      <div className="w-12 h-12 rounded-xl bg-surface-elevated border border-border flex items-center justify-center text-accent">
        {status === "processing" && <Loader2 className="w-6 h-6 animate-spin text-accent" />}
        {status === "success" && <CheckCircle2 className="w-6 h-6 text-emerald-400" />}
        {status === "error" && <AlertCircle className="w-6 h-6 text-red-400" />}
      </div>

      <div className="space-y-1">
        <h2 className="text-lg font-bold text-primary">
          {status === "processing" && "Authenticating Session"}
          {status === "success" && "Session Authenticated"}
          {status === "error" && "Authentication Issue"}
        </h2>
        <p className="text-xs text-primary-muted font-mono">
          {status === "processing" && "Syncing credentials with Supabase..."}
          {status === "success" && "Redirecting to your blueprint dashboard..."}
          {status === "error" && (errorMessage || "Redirecting back to login...")}
        </p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen bg-background text-primary flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
            <span className="text-xs font-mono text-primary-dim">Loading session...</span>
          </div>
        }
      >
        <CallbackHandler />
      </Suspense>
    </div>
  );
}
