"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { getSupabase } from "@/lib/supabase/client";
import { getAuthCallbackUrl } from "@/lib/config/site";
import { safeRedirectPath } from "@/lib/auth/redirect";

export function AuthCard({
  initialMode = "signup",
  next = "/dashboard",
  callbackError = false,
  headingLevel = 1,
}: {
  initialMode?: "signup" | "signin";
  next?: string;
  callbackError?: boolean;
  headingLevel?: 1 | 2;
}) {
  const router = useRouter();
  const { user, isLoading, isConfigured, signUpWithEmail, signInWithEmail } =
    useAuth();
  const [mode, setMode] = useState<"signup" | "signin" | "reset">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(
    callbackError
      ? "This link expired or could not be verified. Sign in or request a new confirmation email."
      : "",
  );
  const [message, setMessage] = useState("");
  const destination = safeRedirectPath(next);
  useEffect(() => {
    if (!isLoading && user) {
      router.replace(destination);
      router.refresh();
    }
  }, [user, isLoading, destination, router]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      if (mode === "reset") {
        const client = getSupabase();
        if (!client) throw new Error("Account service unavailable.");
        const result = await client.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: getAuthCallbackUrl() + "?next=/auth/update-password",
        });
        if (result.error) throw result.error;
        setMessage(
          "If this account exists, a password reset link is on its way. Check your inbox and spam folder.",
        );
      } else {
        const result =
          mode === "signup"
            ? await signUpWithEmail(email, password, name)
            : await signInWithEmail(email, password);
        if (result.error) throw result.error;
        if (result.requiresEmailConfirmation) {
          setMessage(
            "Check your email to confirm your account, then sign in to choose your goals and build your plan.",
          );
        } else {
          router.replace(destination);
          router.refresh();
        }
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not connect. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function resend() {
    if (!email.trim()) {
      setError("Enter your email address first.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const client = getSupabase();
      if (!client) throw new Error("Account service unavailable.");
      const { error } = await client.auth.resend({
        type: "signup",
        email: email.trim(),
        options: { emailRedirectTo: getAuthCallbackUrl() },
      });
      if (error) throw error;
      setMessage("If confirmation is pending, a new link is on its way.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  const Heading = headingLevel === 1 ? "h1" : "h2";
  const input =
    "w-full rounded-xl border border-border bg-background p-3 text-primary";
  return (
    <section className="rounded-2xl border border-border bg-surface p-6 space-y-5">
      <div>
        <Heading className="text-2xl font-bold">
          {mode === "signup"
            ? "Create your IronSync account"
            : mode === "reset"
              ? "Reset your password"
              : "Welcome back"}
        </Heading>
        <p className="mt-2 text-sm text-primary-muted">
          Plan your training and keep every completed set.
        </p>
      </div>
      {!isConfigured && (
        <p role="alert">
          Account service is unavailable. Please try again later.
        </p>
      )}
      <form onSubmit={submit} className="space-y-4">
        {mode === "signup" && (
          <label className="block">
            Name
            <input
              disabled={busy || isLoading}
              className={input}
              autoComplete="name"
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
        )}
        <label className="block">
          Email
          <input
            disabled={busy || isLoading}
            className={input}
            type="email"
            autoComplete="email"
            maxLength={254}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {mode !== "reset" && (
          <label className="block">
            Password
            <input
              disabled={busy || isLoading}
              aria-label="Password"
              aria-describedby={mode === "signup" ? "password-help" : undefined}
              className={input}
              type="password"
              autoComplete={
                mode === "signup" ? "new-password" : "current-password"
              }
              minLength={mode === "signup" ? 12 : 1}
              maxLength={128}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {mode === "signup" && (
              <span id="password-help" className="text-xs text-primary-muted">
                Use at least 12 characters.
              </span>
            )}
          </label>
        )}
        {error && (
          <p role="alert" className="text-red-400">
            {error}
          </p>
        )}
        {message && (
          <p role="status" className="text-accent">
            {message}
          </p>
        )}
        <button
          disabled={busy || isLoading || !isConfigured}
          className="w-full rounded-xl bg-accent p-3 font-bold text-white disabled:opacity-50"
        >
          {busy
            ? "Please wait…"
            : mode === "signup"
              ? "Create account"
              : mode === "reset"
                ? "Send reset link"
                : "Sign in"}
        </button>
      </form>
      <div className="flex flex-wrap gap-4 text-sm">
        <button
          disabled={busy || isLoading}
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError("");
            setMessage("");
          }}
        >
          {mode === "signin"
            ? "Create an account"
            : "Already have an account? Sign in"}
        </button>
        {mode === "signin" && (
          <button
            disabled={busy || isLoading}
            onClick={() => {
              setMode("reset");
              setError("");
              setMessage("");
            }}
          >
            Forgot password?
          </button>
        )}
        <button disabled={busy || isLoading || !isConfigured} onClick={resend}>
          Resend confirmation
        </button>
      </div>
      <p className="text-xs text-primary-muted">
        By creating an account you agree to the{" "}
        <Link href="/terms" className="underline">
          terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline">
          privacy policy
        </Link>
        .
      </p>
    </section>
  );
}
