"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  Phone,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export function AuthCard() {
  const router = useRouter();
  const {
    user,
    signInWithGoogle,
    signInWithPhone,
    verifyPhoneOtp,
    signInWithEmail,
    signUpWithEmail,
    isConfigured,
  } = useAuth();

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);


  // Mode: "google" | "phone" | "email"
  const [activeTab, setActiveTab] = useState<"google" | "phone" | "email">("google");
  const [isSignUp, setIsSignUp] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // Status
  const [loading, setLoading] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Check URL search params on mount for callback errors safely & track auth started
  useEffect(() => {
    trackEvent("auth_started", { source: "auth_card" });

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const errorParam = params.get("error");
      if (errorParam === "oauth_callback_failed") {
        setErrorMessage("Unable to complete Google sign-in. Please ensure Google Provider is enabled in Supabase, or use Email below.");
      } else if (errorParam) {
        setErrorMessage("Authentication failed. Please try again.");
      }
    }
  }, []);

  // 1. Google OAuth (Primary)
  const handleGoogleAuth = async () => {
    trackEvent("auth_started", { method: "google" });
    setLoading(true);
    setActiveAction("google");
    setErrorMessage(null);
    setSuccessNotice(null);

    const { error } = await signInWithGoogle();
    if (error) {
      if (error.message.toLowerCase().includes("provider is not enabled")) {
        setErrorMessage(
          "Google sign-in is not enabled yet in your Supabase project. Enable Google in Supabase Dashboard -> Authentication -> Providers, or use Email login below."
        );
      } else {
        setErrorMessage(
          isConfigured
            ? error.message || "We couldn't connect with Google. Please check your Supabase OAuth configuration."
            : "Supabase credentials are not configured in .env.local yet. Please see configuration instructions."
        );
      }
      setLoading(false);
      setActiveAction(null);
    }
  };

  // 2. Phone OTP Flow (Secondary)
  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 8) {
      setErrorMessage("Please enter a valid phone number with country code (e.g. +1... or +91...).");
      return;
    }

    setLoading(true);
    setActiveAction("phone-send");
    setErrorMessage(null);
    setSuccessNotice(null);
    const { error } = await signInWithPhone(phoneNumber);
    setLoading(false);
    setActiveAction(null);

    if (error) {
      setErrorMessage(error.message || "We couldn't send the verification code. Please try again.");
    } else {
      setOtpSent(true);
    }
  };

  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      setErrorMessage("Please enter the 6-digit verification code.");
      return;
    }

    setLoading(true);
    setActiveAction("phone-verify");
    setErrorMessage(null);
    setSuccessNotice(null);
    const { error } = await verifyPhoneOtp(phoneNumber, otpCode);
    setLoading(false);
    setActiveAction(null);

    if (error) {
      setErrorMessage("The verification code is invalid or has expired.");
    } else {
      trackEvent("auth_completed", { method: "phone" });
      router.push("/dashboard");
    }
  };

  // 3. Email Authentication (Tertiary)
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setActiveAction("email");
    setErrorMessage(null);
    setSuccessNotice(null);

    if (isSignUp) {
      const { error, requiresEmailConfirmation } = await signUpWithEmail(email, password, displayName);
      setLoading(false);
      setActiveAction(null);
      if (error) {
        setErrorMessage(error.message || "We couldn't create your account. Please try again.");
      } else if (requiresEmailConfirmation) {
        trackEvent("auth_completed", { method: "email", is_sign_up: true, requires_confirmation: true });
        setSuccessNotice(
          `Account created! A confirmation link has been sent to ${email}. Please check your inbox (or spam folder) to confirm your email before signing in.`
        );
      } else {
        trackEvent("auth_completed", { method: "email", is_sign_up: true });
        router.push("/dashboard");
      }
    } else {
      const { error } = await signInWithEmail(email, password);
      setLoading(false);
      setActiveAction(null);
      if (error) {
        const msg = error.message || "";
        if (msg.toLowerCase().includes("email not confirmed")) {
          setErrorMessage(
            "Your email has not been confirmed yet! Please click the confirmation link sent to your email, or disable 'Confirm email' in Supabase Dashboard (Authentication -> Providers -> Email) to sign in without email verification."
          );
        } else if (msg.toLowerCase().includes("invalid login credentials")) {
          setErrorMessage("Invalid email or password. Please verify your credentials or click 'New user? Create an account' below.");
        } else {
          setErrorMessage(msg || "Invalid email or password. Please check your credentials.");
        }
      } else {
        trackEvent("auth_completed", { method: "email", is_sign_up: false });
        router.push("/dashboard");
      }
    }
  };

  return (
    <Card variant="elevated" padding="lg" className="border-border/80 shadow-2xl relative">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-1.5 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
            Save your personalized blueprint.
          </h2>
          <p className="text-xs sm:text-sm text-primary-muted leading-relaxed">
            Create your account to unlock the complete workout, nutrition and recovery plan.
          </p>
        </div>

        {/* Success / Email confirmation notification */}
        {successNotice && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            <div className="space-y-1">
              <p className="font-bold text-emerald-300">Check your inbox</p>
              <p className="leading-relaxed text-emerald-400/90">{successNotice}</p>
              {process.env.NODE_ENV !== "production" && (
                <p className="text-[11px] text-primary-dim pt-1 border-t border-emerald-500/20">
                  Tip: In Supabase Dashboard &rarr; Authentication &rarr; Providers &rarr; Email, you can disable <strong>&quot;Confirm email&quot;</strong> for instant signups without email verification during development.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Error notification */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-medium">{errorMessage}</p>
              {!isConfigured && (
                <p className="text-[11px] text-primary-dim">
                  {process.env.NODE_ENV !== "production" ? (
                    <>Tip: Add your <code className="text-accent font-mono">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="text-accent font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to <code className="text-accent font-mono">.env.local</code>.</>
                  ) : (
                    "Authentication service is currently unavailable. Please try again later."
                  )}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 1. PRIMARY: GOOGLE OAUTH */}
        {/* ========================================================================= */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full h-12 rounded-xl bg-white text-gray-900 font-semibold text-sm flex items-center justify-center gap-3 shadow-md hover:bg-gray-100 transition-all duration-200 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50"
          >
            {loading && activeAction === "google" ? (
              <Loader2 className="w-4 h-4 animate-spin text-gray-900" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
                />
              </svg>
            )}
            <span>{loading && activeAction === "google" ? "Connecting to Google..." : "Continue with Google"}</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-border w-full" />
          <span className="bg-surface-elevated px-3 text-[11px] font-mono uppercase text-primary-dim shrink-0">
            or choose alternative
          </span>
          <div className="border-t border-border w-full" />
        </div>

        {/* Method Switcher Tabs (Secondary & Tertiary) */}
        <div className="flex items-center gap-1.5 p-1 bg-surface rounded-xl border border-border">
          <button
            type="button"
            onClick={() => {
              setActiveTab("phone");
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === "phone"
                ? "bg-surface-elevated text-accent border border-border"
                : "text-primary-muted hover:text-primary"
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Phone OTP</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("email");
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === "email"
                ? "bg-surface-elevated text-accent border border-border"
                : "text-primary-muted hover:text-primary"
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 2. SECONDARY: PHONE OTP */}
        {/* ========================================================================= */}
        {activeTab === "phone" && (
          <div className="space-y-4 pt-1 animate-in fade-in duration-200">
            {!otpSent ? (
              <form onSubmit={handleSendPhoneOtp} className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-primary-dim">
                    Mobile Number with country code
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 9876543210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    className="w-full h-11 px-3.5 rounded-xl bg-surface border border-border text-sm text-primary placeholder:text-primary-dim/50 focus:border-accent focus:ring-1 focus:ring-accent outline-none font-mono"
                  />
                </div>
                <Button
                  type="submit"
                  variant="secondary"
                  size="md"
                  disabled={loading}
                  className="w-full justify-center font-medium"
                >
                  {loading && activeAction === "phone-send" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Sending code...
                    </>
                  ) : (
                    "Send One-Time Code"
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyPhoneOtp} className="space-y-3">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-primary-dim">Enter 6-digit OTP sent to {phoneNumber}</span>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-accent hover:underline text-[11px]"
                    >
                      Change
                    </button>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    required
                    className="w-full h-11 px-3.5 rounded-xl bg-surface border border-border text-center text-lg tracking-[0.3em] font-mono text-primary outline-none focus:border-accent"
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={loading}
                  className="w-full justify-center font-semibold"
                >
                  {loading && activeAction === "phone-verify" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Verifying...
                    </>
                  ) : (
                    "Verify & Unlock Blueprint"
                  )}
                </Button>
              </form>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. TERTIARY: EMAIL */}
        {/* ========================================================================= */}
        {activeTab === "email" && (
          <form onSubmit={handleEmailAuth} className="space-y-3 pt-1 animate-in fade-in duration-200">
            {isSignUp && (
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-primary-dim">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="Alex"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-surface border border-border text-sm text-primary placeholder:text-primary-dim/50 focus:border-accent outline-none"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-primary-dim">
                Email Address
              </label>
              <input
                type="email"
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-11 px-3.5 rounded-xl bg-surface border border-border text-sm text-primary placeholder:text-primary-dim/50 focus:border-accent outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-primary-dim">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full h-11 px-3.5 rounded-xl bg-surface border border-border text-sm text-primary placeholder:text-primary-dim/50 focus:border-accent outline-none"
              />
            </div>

            <Button
              type="submit"
              variant="secondary"
              size="md"
              disabled={loading}
              className="w-full justify-center font-medium mt-2"
            >
              {loading && activeAction === "email" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  {isSignUp ? "Creating account..." : "Signing in..."}
                </>
              ) : isSignUp ? (
                "Create Account & Save Plan"
              ) : (
                "Sign In & View Plan"
              )}
            </Button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs text-primary-dim hover:text-accent transition-colors"
              >
                {isSignUp
                  ? "Already have an account? Sign in"
                  : "New user? Create an account"}
              </button>
            </div>
          </form>
        )}

        {/* Security reassurance */}
        <div className="pt-2 border-t border-border/60 flex items-center justify-center gap-2 text-xs font-mono text-primary-dim">
          <ShieldCheck className="w-4 h-4 text-accent" />
          <span>Encrypted with Row-Level Security</span>
        </div>
      </div>
    </Card>
  );
}
