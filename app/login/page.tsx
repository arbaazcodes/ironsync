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
  CheckCircle2,
  Eye,
  EyeOff,
  Dumbbell,
  Sparkles,
} from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "admin" ? "admin" : "member";
  const redirectTarget = searchParams.get("next") || null;

  const [activeTab, setActiveTab] = useState<"member" | "admin">(initialTab);

  // Member Form State
  const [memberId, setMemberId] = useState("");
  const [memberPin, setMemberPin] = useState("");
  const [showMemberPin, setShowMemberPin] = useState(false);
  const [memberLoading, setMemberLoading] = useState(false);
  const [memberError, setMemberError] = useState<string | null>(null);

  // Admin Form State
  const { user, signInWithEmail, signInWithGoogle, isConfigured } = useAuth();
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  // If already logged in as Admin, redirect to /admin
  useEffect(() => {
    if (user && activeTab === "admin") {
      router.push(redirectTarget || "/admin");
    }
  }, [user, activeTab, redirectTarget, router]);

  // Sync tab with URL if param changes
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "admin" || tab === "member") {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Handle Member Login
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

      // Success: redirect to member dashboard
      router.push(redirectTarget || "/member/dashboard");
    } catch (err: any) {
      setMemberError(err?.message || "Connection error. Please try again.");
      setMemberLoading(false);
    }
  };

  // Handle Admin Login
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);

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

  // Handle Admin Google OAuth
  const handleGoogleLogin = async () => {
    setAdminError(null);
    try {
      setAdminLoading(true);
      const { error } = await signInWithGoogle();
      if (error) {
        setAdminError(error.message);
        setAdminLoading(false);
      }
    } catch (err: any) {
      setAdminError(err?.message || "Google sign in failed.");
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
                Gym Portal
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
      <main className="flex-1 flex items-center justify-center px-4 py-12 z-10">
        <div className="w-full max-w-md space-y-6">
          {/* Top Pill / Platform Badge */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-white/70">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF1E1E]" />
              Secure Dual-Role Authentication
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              {activeTab === "member" ? "Member Access" : "Admin Portal"}
            </h1>
            <p className="text-xs sm:text-sm text-white/50 max-w-sm mx-auto">
              {activeTab === "member"
                ? "Enter your credentials to access your assigned workouts, nutrition blueprint, and coach."
                : "Sign in with your verified administrator credentials to manage gym members and programs."}
            </p>
          </div>

          {/* Role Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-[#121212] border border-white/[0.08] rounded-xl">
            <button
              type="button"
              onClick={() => {
                setActiveTab("member");
                setMemberError(null);
              }}
              className={`py-2.5 px-4 rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === "member"
                  ? "bg-[#FF1E1E] text-white shadow-lg shadow-[#FF1E1E]/25"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <User className="w-4 h-4" />
              Member Login
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("admin");
                setAdminError(null);
              }}
              className={`py-2.5 px-4 rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === "admin"
                  ? "bg-[#FF1E1E] text-white shadow-lg shadow-[#FF1E1E]/25"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Lock className="w-4 h-4" />
              Admin Portal
            </button>
          </div>

          {/* Card Container */}
          <div className="bg-[#121212]/90 border border-white/[0.1] rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative">
            {/* TAB 1: MEMBER LOGIN */}
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
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/40 hover:text-white/80 transition-colors"
                      aria-label={showMemberPin ? "Hide PIN" : "Show PIN"}
                    >
                      {showMemberPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={memberLoading}
                  className="w-full py-3.5 px-4 bg-[#FF1E1E] hover:bg-[#E01818] active:scale-[0.99] text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#FF1E1E]/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

                {/* Helper notice */}
                <div className="pt-2 border-t border-white/[0.06] text-center">
                  <p className="text-[11px] text-white/45 leading-relaxed">
                    Member IDs and PINs are issued directly by your gym administrator upon enrolment.
                    Need assistance? Contact your gym front desk.
                  </p>
                </div>
              </form>
            )}

            {/* TAB 2: ADMIN LOGIN */}
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
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/40 hover:text-white/80 transition-colors"
                      aria-label={showAdminPassword ? "Hide password" : "Show password"}
                    >
                      {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={adminLoading}
                  className="w-full py-3.5 px-4 bg-[#FF1E1E] hover:bg-[#E01818] active:scale-[0.99] text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#FF1E1E]/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

                {/* Google OAuth Option */}
                {isConfigured && (
                  <>
                    <div className="relative my-4 flex items-center justify-center">
                      <div className="border-t border-white/[0.08] w-full" />
                      <span className="bg-[#121212] px-3 text-[11px] font-mono uppercase tracking-wider text-white/40 absolute">
                        or
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={adminLoading}
                      className="w-full py-3 px-4 bg-white/[0.05] hover:bg-white/[0.09] active:scale-[0.99] border border-white/[0.1] text-white font-semibold text-xs tracking-wider rounded-xl transition-all flex items-center justify-center gap-2.5"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      Continue with Google
                    </button>
                  </>
                )}

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
        <span>IronSync Gym Management System &bull; Cryptographically Verified &bull; 2026</span>
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
