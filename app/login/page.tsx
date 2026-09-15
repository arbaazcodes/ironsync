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
      {/* Header */}
      <header className="w-full border-b border-border bg-surface/85 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center shadow-sm">
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
      <main className="flex-1 flex items-center justify-center px-4 py-12 z-10">
        <div className="w-full max-w-md space-y-6">
          {/* Top Pill / Platform Badge */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-elevated border border-border text-xs font-mono text-primary-muted shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-accent" />
              Secure Gym Authentication
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-primary">
              {activeTab === "member" ? "Member Access" : "Admin Portal"}
            </h1>
            <p className="text-xs sm:text-sm text-primary-muted max-w-sm mx-auto">
              {activeTab === "member"
                ? "Enter your Member ID and 4-digit PIN issued by your gym front desk."
                : "Sign in with your administrator credentials to manage members and plans."}
            </p>
          </div>

          {/* Two Tabs Only: Member | Admin */}
          <div className="grid grid-cols-2 p-1 bg-surface-elevated border border-border rounded-xl gap-1 shadow-sm">
            <button
              type="button"
              onClick={() => handleTabChange("member")}
              className={`py-2.5 px-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "member"
                  ? "bg-accent text-white shadow-sm"
                  : "text-primary-muted hover:text-primary"
              }`}
            >
              <User className="w-4 h-4 shrink-0" />
              <span>Member</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange("admin")}
              className={`py-2.5 px-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "admin"
                  ? "bg-accent text-white shadow-sm"
                  : "text-primary-muted hover:text-primary"
              }`}
            >
              <Lock className="w-4 h-4 shrink-0" />
              <span>Admin</span>
            </button>
          </div>

          {/* Card Container */}
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm relative transition-colors">
            {/* Supabase Env Missing Warning (Shown for Admin) */}
            {activeTab === "admin" && !isConfigured && (
              <div className="mb-5 p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 text-xs space-y-2">
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
                    <span>Member ID</span>
                    <span className="text-[10px] text-primary-dim">Format: IS-YYYY-XXXX</span>
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
                      className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-xl text-primary font-mono text-sm uppercase placeholder:text-primary-dim focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                    />
                  </div>
                </div>

                {/* PIN Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-primary-muted flex items-center justify-between">
                    <span>Security PIN</span>
                    <span className="text-[10px] text-primary-dim">4-digit numeric</span>
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
                      className="w-full pl-10 pr-11 py-2.5 bg-surface border border-border rounded-xl text-primary font-mono text-base tracking-widest placeholder:text-primary-dim focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
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
                    4-digit PIN issued by your gym front desk
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
                      <span>Enter Gym Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="pt-2 border-t border-border text-center">
                  <p className="text-[11px] text-primary-dim leading-relaxed">
                    Member IDs and PINs are issued directly by your gym administrator upon enrollment.
                  </p>
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
                  <label className="text-xs font-mono uppercase tracking-wider text-primary-muted">
                    Administrator Email
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
                      className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-xl text-primary text-sm placeholder:text-primary-dim focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-primary-muted flex items-center justify-between">
                    <span>Password</span>
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
                      className="w-full pl-10 pr-11 py-2.5 bg-surface border border-border rounded-xl text-primary text-sm placeholder:text-primary-dim focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
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
                      <span>Sign In as Admin</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="pt-2 border-t border-border text-center">
                  <span className="text-[11px] text-primary-dim">
                    Authorized gym operators and managers only.
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border py-4 text-center text-xs font-mono text-primary-dim">
        <span>IronSync &bull; Gym Management & Athlete System</span>
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
