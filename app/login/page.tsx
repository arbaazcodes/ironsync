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
      setMemberError("Please enter your 4-digit security PIN.");
      return;
    }

    try {
      setMemberLoading(true);
      const res = await fetch("/api/member/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId: cleanId, pin: cleanPin }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMemberError(data.error || "Authentication failed. Please check your Member ID and PIN.");
        setMemberLoading(false);
        return;
      }

      router.push(redirectTarget || "/member/dashboard");
    } catch (err: any) {
      setMemberError(err?.message || "Connection error. Please try again.");
      setMemberLoading(false);
    }
  };

  // Handle Admin Login (Supabase signInWithPassword)
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);

    if (!isConfigured) {
      setAdminError("Supabase env missing: Configure Supabase keys to access the admin portal.");
      return;
    }

    const cleanEmail = adminEmail.trim();
    if (!cleanEmail) {
      setAdminError("Please enter your admin email address.");
      return;
    }
    if (!adminPassword) {
      setAdminError("Please enter your admin password.");
      return;
    }

    try {
      setAdminLoading(true);
      const { error } = await signInWithEmail(cleanEmail, adminPassword);

      if (error) {
        setAdminError(error.message || "Invalid email or password.");
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
    <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-between relative overflow-hidden selection:bg-[#FF1E1E]/30 selection:text-white">
      {/* Background cinematic radial lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-[#FF1E1E]/[0.07] blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[350px] bg-[#FF1E1E]/[0.03] blur-[160px] pointer-events-none rounded-full" />

      {/* Header */}
      <header className="w-full border-b border-white/[0.08] bg-[#050505]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF1E1E] to-[#990000] flex items-center justify-center shadow-lg shadow-[#FF1E1E]/20 group-hover:scale-105 transition-transform duration-200">
              <Dumbbell className="w-5 h-5 text-white" strokeWidth={2.4} />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-wider uppercase text-white">
                Iron<span className="text-[#FF1E1E]">Sync</span>
              </span>
              <span className="hidden sm:inline-block ml-2.5 text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-full bg-white/[0.06] text-white/60 border border-white/[0.08]">
                Portal
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="text-xs font-mono text-white/50 hover:text-white transition-colors flex items-center gap-1.5"
          >
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Authentication Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-10 z-10">
        <div className="w-full max-w-md space-y-6">
          {/* Top Pill / Platform Badge */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-white/70">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF1E1E]" />
              Secure Gym Authentication
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              {activeTab === "member" ? "Member Access" : "Admin Portal"}
            </h1>
            <p className="text-xs sm:text-sm text-white/50 max-w-sm mx-auto">
              {activeTab === "member"
                ? "Enter your Member ID and 4-digit PIN issued by your gym front desk."
                : "Sign in with your administrator credentials to manage members and plans."}
            </p>
          </div>

          {/* Two Tabs Only: Member | Admin */}
          <div className="grid grid-cols-2 p-1 bg-[#121212] border border-white/[0.08] rounded-xl gap-1">
            <button
              type="button"
              onClick={() => handleTabChange("member")}
              className={`py-2.5 px-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "member"
                  ? "bg-[#FF1E1E] text-white shadow-lg shadow-[#FF1E1E]/25"
                  : "text-white/60 hover:text-white"
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
                  ? "bg-[#FF1E1E] text-white shadow-lg shadow-[#FF1E1E]/25"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Lock className="w-4 h-4 shrink-0" />
              <span>Admin</span>
            </button>
          </div>

          {/* Card Container */}
          <div className="bg-[#121212]/90 border border-white/[0.1] rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative">
            {/* Supabase Env Missing Warning (Shown for Admin) */}
            {activeTab === "admin" && !isConfigured && (
              <div className="mb-5 p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-red-300">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Supabase Env Missing</span>
                </div>
                <p className="text-white/80 leading-relaxed">
                  Administrator authentication requires Supabase environment variables configured in your deployment settings.
                </p>
                <div className="p-2.5 rounded-lg bg-black/60 border border-white/[0.08] font-mono text-[11px] text-white/70 space-y-1">
                  <div className="text-white/50 font-semibold mb-1">Missing required configuration:</div>
                  {diagnostics?.missingUrl && (
                    <div className="text-red-400 font-bold">
                      &bull; NEXT_PUBLIC_SUPABASE_URL
                    </div>
                  )}
                  {diagnostics?.missingKey && (
                    <div className="text-red-400 font-bold">
                      &bull; NEXT_PUBLIC_SUPABASE_ANON_KEY / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 1: MEMBER LOGIN (ID + 4-DIGIT PIN) */}
            {activeTab === "member" && (
              <form onSubmit={handleMemberLogin} className="space-y-5">
                {memberError && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2.5 leading-relaxed">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{memberError}</span>
                  </div>
                )}

                {/* Member ID Field */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-white/70 flex items-center justify-between">
                    <span>Member ID</span>
                    <span className="text-[10px] text-white/40">Format: IS-YYYY-XXXX</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={memberId}
                      onChange={(e) => setMemberId(e.target.value.toUpperCase())}
                      placeholder="IS-2026-0001"
                      required
                      autoComplete="username"
                      className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/[0.12] rounded-xl text-white font-mono text-sm uppercase placeholder:text-white/25 focus:outline-none focus:border-[#FF1E1E] focus:ring-1 focus:ring-[#FF1E1E] transition-colors"
                    />
                  </div>
                </div>

                {/* PIN Field */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-white/70 flex items-center justify-between">
                    <span>Security PIN</span>
                    <span className="text-[10px] text-white/40">4-digit numeric</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
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
                      className="w-full pl-10 pr-11 py-3 bg-black/40 border border-white/[0.12] rounded-xl text-white font-mono text-base tracking-widest placeholder:text-white/25 focus:outline-none focus:border-[#FF1E1E] focus:ring-1 focus:ring-[#FF1E1E] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowMemberPin(!showMemberPin)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/40 hover:text-white/80 transition-colors cursor-pointer"
                      aria-label={showMemberPin ? "Hide PIN" : "Show PIN"}
                    >
                      {showMemberPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-white/40 font-mono">
                    4-digit PIN from your gym front desk
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={memberLoading}
                  className="w-full py-3.5 px-4 bg-[#FF1E1E] hover:bg-[#E01818] active:scale-[0.99] text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#FF1E1E]/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {memberLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verifying Credentials...
                    </>
                  ) : (
                    <>
                      Enter Gym Portal
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="pt-2 border-t border-white/[0.06] text-center">
                  <p className="text-[11px] text-white/45 leading-relaxed">
                    Member IDs and PINs are issued directly by your gym administrator upon enrollment.
                  </p>
                </div>
              </form>
            )}

            {/* TAB 2: ADMIN LOGIN (EMAIL + PASSWORD) */}
            {activeTab === "admin" && (
              <form onSubmit={handleAdminLogin} className="space-y-5">
                {adminError && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2.5 leading-relaxed">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{adminError}</span>
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-white/70">
                    Administrator Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="admin@ironsync.com"
                      required
                      autoComplete="email"
                      className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/[0.12] rounded-xl text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[#FF1E1E] focus:ring-1 focus:ring-[#FF1E1E] transition-colors"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-white/70 flex items-center justify-between">
                    <span>Password</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showAdminPassword ? "text" : "password"}
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      autoComplete="current-password"
                      className="w-full pl-10 pr-11 py-3 bg-black/40 border border-white/[0.12] rounded-xl text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[#FF1E1E] focus:ring-1 focus:ring-[#FF1E1E] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/40 hover:text-white/80 transition-colors cursor-pointer"
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
                  className="w-full py-3.5 px-4 bg-[#FF1E1E] hover:bg-[#E01818] active:scale-[0.99] text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#FF1E1E]/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {adminLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Authenticating Admin...
                    </>
                  ) : (
                    <>
                      Sign In as Admin
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="pt-2 border-t border-white/[0.06] text-center">
                  <span className="text-[11px] text-white/45">
                    Authorized gym operators and managers only.
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/[0.08] py-4 text-center text-xs font-mono text-white/40">
        <span>IronSync Fitness &bull; Cryptographically Verified &bull; 2026</span>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF1E1E]" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
