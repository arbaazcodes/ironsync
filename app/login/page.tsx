"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import {
  ShieldCheck,
  Lock,
  User,
  KeyRound,
  Mail,
  ArrowRight,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Dumbbell,
  CheckCircle2,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

type LoginTab = "member" | "admin";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const initialTab: LoginTab = tabParam === "admin" ? "admin" : "member";
  const redirectTarget = searchParams.get("next") || null;

  const [activeTab, setActiveTab] = useState<LoginTab>(initialTab);

  // Common Auth Context
  const { user, signInWithEmail, isConfigured, diagnostics } = useAuth();

  // Member Form State (Gym issued ID + 4-digit PIN)
  const [memberId, setMemberId] = useState("");
  const [memberPin, setMemberPin] = useState("");
  const [showMemberPin, setShowMemberPin] = useState(false);
  const [memberLoading, setMemberLoading] = useState(false);
  const [memberError, setMemberError] = useState<string | null>(null);

  // Admin Form State
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  // Sync tab with URL if query parameter changes
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "admin" || tab === "member") {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Check URL error parameter
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "unauthorized_admin") {
      setAdminError("Access denied. Your account does not have administrator privileges.");
    } else if (errorParam) {
      setAdminError("Authentication error. Please sign in with your administrator credentials.");
    }
  }, [searchParams]);

  // If already logged in as admin, redirect to /admin
  useEffect(() => {
    if (!user) return;
    if (activeTab === "admin") {
      router.push(redirectTarget || "/admin");
    }
  }, [user, activeTab, redirectTarget, router]);

  // If already logged in as member, redirect to /member/dashboard
  useEffect(() => {
    let mounted = true;
    async function checkMemberSession() {
      try {
        const res = await fetch("/api/member/session");
        if (res.ok) {
          const data = await res.json();
          if (mounted && data.authenticated && data.member) {
            if (activeTab === "member") {
              router.push(redirectTarget || "/member/dashboard");
            }
          }
        }
      } catch {
        // Not authenticated as member
      }
    }
    checkMemberSession();
    return () => {
      mounted = false;
    };
  }, [activeTab, redirectTarget, router]);

  const handleTabChange = (tab: LoginTab) => {
    setActiveTab(tab);
    setMemberError(null);
    setAdminError(null);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    router.replace(url.pathname + url.search);
  };

  // Handle Member Login (ID + 4-digit PIN)
  const handleMemberLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMemberError(null);

    const cleanId = memberId.trim().toUpperCase();
    const cleanPin = memberPin.trim();

    if (!cleanId) {
      setMemberError("Please enter your Member ID (e.g., IS-2026-0001).");
      return;
    }
    if (!cleanPin || cleanPin.length !== 4 || !/^\d{4}$/.test(cleanPin)) {
      setMemberError("Please enter your valid 4-digit PIN.");
      return;
    }

    setMemberLoading(true);

    try {
      const res = await fetch("/api/member/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId: cleanId, pin: cleanPin }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMemberError(
          data.error || "Authentication failed. Please verify your Member ID and PIN."
        );
        setMemberLoading(false);
        return;
      }

      router.push(redirectTarget || "/member/dashboard");
    } catch (err: any) {
      setMemberError(err?.message || "An unexpected error occurred. Please try again.");
      setMemberLoading(false);
    }
  };

  // Handle Admin Login (Supabase Auth email + password)
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);

    if (!adminEmail.trim()) {
      setAdminError("Please enter your administrator email.");
      return;
    }
    if (!adminPassword) {
      setAdminError("Please enter your password.");
      return;
    }

    setAdminLoading(true);

    try {
      const { error } = await signInWithEmail(adminEmail.trim(), adminPassword);

      if (error) {
        setAdminError(error.message || "Invalid administrator credentials.");
        setAdminLoading(false);
        return;
      }

      router.push(redirectTarget || "/admin");
    } catch (err: any) {
      setAdminError(err?.message || "Failed to authenticate administrator.");
      setAdminLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-primary flex flex-col justify-between relative selection:bg-accent/20 selection:text-primary transition-colors">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-accent/[0.05] dark:bg-accent/[0.08] blur-[140px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="w-full border-b border-border bg-surface/85 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Dumbbell className="w-4 h-4 text-white" strokeWidth={2.4} />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-wider uppercase text-primary">
                Iron<span className="text-accent">Sync</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-surface-elevated text-primary-muted border border-border">
                Portal
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/"
              className="text-xs font-mono text-primary-muted hover:text-primary transition-colors flex items-center gap-1.5"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Authentication Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-10 sm:py-14 z-10">
        <div className="w-full max-w-lg space-y-6">
          {/* Top Platform Badge & Header */}
          <div className="text-center space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface-elevated border border-border text-xs font-mono text-primary-muted shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-accent" />
              <span>Free Gym System</span>
              <span className="text-border">&bull;</span>
              <span className="text-primary font-bold">Sign In</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-primary">
              Choose Your Door
            </h1>
            <p className="text-xs sm:text-sm text-primary-muted max-w-md mx-auto leading-relaxed">
              Select your role below to open the correct portal in seconds.
            </p>
          </div>

          {/* TWO DOORS SELECTOR (High visual clarity for fast ~3s decision) */}
          <div className="grid grid-cols-2 gap-2.5 p-1.5 bg-surface-elevated border border-border rounded-2xl shadow-sm">
            {/* Door 1: Member */}
            <button
              type="button"
              onClick={() => handleTabChange("member")}
              className={`relative p-3.5 sm:p-4 rounded-xl text-left transition-all duration-200 cursor-pointer flex flex-col justify-between border ${
                activeTab === "member"
                  ? "bg-card border-accent shadow-sm ring-1 ring-accent/30"
                  : "border-transparent hover:bg-surface/70 text-primary-muted hover:text-primary"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    activeTab === "member"
                      ? "bg-accent text-white shadow-sm"
                      : "bg-surface border border-border text-primary-muted"
                  }`}
                >
                  <User className="w-4 h-4" />
                </div>
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border transition-colors ${
                    activeTab === "member"
                      ? "bg-accent/10 border-accent/30 text-accent font-bold"
                      : "bg-surface border-border text-primary-dim"
                  }`}
                >
                  ID + PIN
                </span>
              </div>
              <div>
                <div
                  className={`text-sm font-black uppercase tracking-wide transition-colors ${
                    activeTab === "member" ? "text-primary" : "text-primary-muted"
                  }`}
                >
                  Gym Member
                </div>
                <div className="text-[11px] text-primary-dim font-medium leading-snug mt-0.5">
                  Athletes & Workouts
                </div>
              </div>
            </button>

            {/* Door 2: Admin */}
            <button
              type="button"
              onClick={() => handleTabChange("admin")}
              className={`relative p-3.5 sm:p-4 rounded-xl text-left transition-all duration-200 cursor-pointer flex flex-col justify-between border ${
                activeTab === "admin"
                  ? "bg-card border-accent shadow-sm ring-1 ring-accent/30"
                  : "border-transparent hover:bg-surface/70 text-primary-muted hover:text-primary"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    activeTab === "admin"
                      ? "bg-accent text-white shadow-sm"
                      : "bg-surface border border-border text-primary-muted"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border transition-colors ${
                    activeTab === "admin"
                      ? "bg-accent/10 border-accent/30 text-accent font-bold"
                      : "bg-surface border-border text-primary-dim"
                  }`}
                >
                  Email + Pass
                </span>
              </div>
              <div>
                <div
                  className={`text-sm font-black uppercase tracking-wide transition-colors ${
                    activeTab === "admin" ? "text-primary" : "text-primary-muted"
                  }`}
                >
                  Staff & Admin
                </div>
                <div className="text-[11px] text-primary-dim font-medium leading-snug mt-0.5">
                  Owners & Management
                </div>
              </div>
            </button>
          </div>

          {/* Active Card Container */}
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm relative transition-colors space-y-6">
            {/* Active Door Header */}
            {activeTab === "member" ? (
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="space-y-0.5">
                  <div className="text-[11px] font-mono uppercase font-bold text-accent tracking-wider flex items-center gap-1.5">
                    <Dumbbell className="w-3.5 h-3.5" />
                    <span>Member Access Door</span>
                  </div>
                  <h2 className="text-xl font-extrabold uppercase tracking-tight text-primary">
                    Workout & Attendance
                  </h2>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-mono font-bold uppercase">
                  <CheckCircle2 className="w-3 h-3" />
                  Free Gym Access
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="space-y-0.5">
                  <div className="text-[11px] font-mono uppercase font-bold text-accent tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Admin Access Door</span>
                  </div>
                  <h2 className="text-xl font-extrabold uppercase tracking-tight text-primary">
                    Staff & Operations
                  </h2>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-surface-elevated border border-border text-primary-muted text-[10px] font-mono font-bold uppercase">
                  Authorized Only
                </span>
              </div>
            )}

            {/* Contextual Notice */}
            {activeTab === "member" ? (
              <div className="p-3 rounded-xl bg-surface-elevated/70 border border-border text-xs text-primary-muted flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-accent mt-0.5" />
                <p className="leading-relaxed">
                  Enter the Member ID and 4-digit PIN provided by your gym administration.
                </p>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-surface-elevated/70 border border-border text-xs text-primary-muted flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 shrink-0 text-accent mt-0.5" />
                <p className="leading-relaxed">
                  Sign in with your administrator credentials to manage member access, facility check-ins, and gym administration.
                </p>
              </div>
            )}

            {/* Supabase Env Missing Warning (Shown for Admin) */}
            {activeTab === "admin" && !isConfigured && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-rose-600 dark:text-rose-300">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Supabase Configuration Missing</span>
                </div>
                <p className="text-primary-muted leading-relaxed">
                  Administrator authentication requires Supabase environment variables configured in your deployment settings.
                </p>
                <div className="p-2.5 rounded-lg bg-surface-elevated border border-border font-mono text-[11px] text-primary-muted space-y-1">
                  <div className="text-primary-dim font-semibold mb-1">Missing configuration:</div>
                  {diagnostics?.missingUrl && (
                    <div className="text-rose-500 font-bold">
                      &bull; NEXT_PUBLIC_SUPABASE_URL
                    </div>
                  )}
                  {diagnostics?.missingKey && (
                    <div className="text-rose-500 font-bold">
                      &bull; NEXT_PUBLIC_SUPABASE_ANON_KEY
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 1: MEMBER LOGIN (ID + 4-DIGIT PIN) */}
            {activeTab === "member" && (
              <form onSubmit={handleMemberLogin} className="space-y-5">
                {memberError && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2.5 leading-relaxed">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-500" />
                    <span>{memberError}</span>
                  </div>
                )}

                {/* Member ID Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-primary-muted flex items-center justify-between">
                    <span className="font-semibold text-primary">Member ID</span>
                    <span className="text-[10px] text-primary-dim font-normal">e.g., IS-2026-0001</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-primary-dim">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={memberId}
                      onChange={(e) => setMemberId(e.target.value.toUpperCase())}
                      placeholder="IS-2026-0001"
                      required
                      autoComplete="username"
                      className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-xl text-primary font-mono text-sm uppercase placeholder:text-primary-dim/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                    />
                  </div>
                </div>

                {/* PIN Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-primary-muted flex items-center justify-between">
                    <span className="font-semibold text-primary">4-Digit Security PIN</span>
                    <span className="text-[10px] text-primary-dim font-normal">Numeric only</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-primary-dim">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <input
                      type={showMemberPin ? "text" : "password"}
                      inputMode="numeric"
                      maxLength={4}
                      pattern="[0-9]{4}"
                      value={memberPin}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                        setMemberPin(val);
                      }}
                      placeholder="••••"
                      required
                      autoComplete="current-password"
                      className="w-full pl-10 pr-11 py-2.5 bg-surface border border-border rounded-xl text-primary font-mono text-base tracking-widest placeholder:text-primary-dim/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowMemberPin(!showMemberPin)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-primary-dim hover:text-primary transition-colors cursor-pointer"
                      aria-label={showMemberPin ? "Hide PIN" : "Show PIN"}
                    >
                      {showMemberPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-primary-dim font-mono">
                    4-digit PIN assigned upon gym enrollment
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={memberLoading}
                  className="w-full py-3 px-4 bg-accent hover:bg-accent-hover active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {memberLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Enter Member Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Switcher & Help */}
                <div className="pt-3 border-t border-border flex flex-col items-center gap-2 text-center">
                  <p className="text-[11px] text-primary-dim leading-relaxed">
                    Forgot your Member ID or PIN? Inquire at your gym front desk.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleTabChange("admin")}
                    className="text-[11px] font-mono text-primary-muted hover:text-accent transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Staff or gym manager?</span>
                    <span className="underline underline-offset-4 font-semibold">Switch to Admin Portal &rarr;</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: ADMIN LOGIN (EMAIL + PASSWORD) */}
            {activeTab === "admin" && (
              <form onSubmit={handleAdminLogin} className="space-y-5">
                {adminError && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2.5 leading-relaxed">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-500" />
                    <span>{adminError}</span>
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-primary-muted flex items-center justify-between">
                    <span className="font-semibold text-primary">Administrator Email</span>
                    <span className="text-[10px] text-primary-dim font-normal">Staff login</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-primary-dim">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="admin@ironsync.com"
                      required
                      autoComplete="email"
                      className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-xl text-primary text-sm placeholder:text-primary-dim/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-primary-muted flex items-center justify-between">
                    <span className="font-semibold text-primary">Password</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-primary-dim">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showAdminPassword ? "text" : "password"}
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      autoComplete="current-password"
                      className="w-full pl-10 pr-11 py-2.5 bg-surface border border-border rounded-xl text-primary text-sm placeholder:text-primary-dim/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-primary-dim hover:text-primary transition-colors cursor-pointer"
                      aria-label={showAdminPassword ? "Hide password" : "Show password"}
                    >
                      {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={adminLoading || !isConfigured}
                  className="w-full py-3 px-4 bg-accent hover:bg-accent-hover active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {adminLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authenticating Admin...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Admin Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Switcher & Help */}
                <div className="pt-3 border-t border-border flex flex-col items-center gap-2 text-center">
                  <span className="text-[11px] text-primary-dim">
                    Authorized gym operators and managers only.
                  </span>
                  <button
                    type="button"
                    onClick={() => handleTabChange("member")}
                    className="text-[11px] font-mono text-primary-muted hover:text-accent transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>&larr; Are you a gym member?</span>
                    <span className="underline underline-offset-4 font-semibold">Switch to Member Login</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border py-4 px-4 text-center text-xs font-mono text-primary-dim flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6">
        <span>IronSync &bull; Free Gym Management System</span>
        <span className="hidden sm:inline text-border">&bull;</span>
        <span className="text-primary-muted">100% Free &bull; No Credit Card Required</span>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center text-primary">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
