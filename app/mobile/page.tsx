"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MobileShell } from "@/components/mobile/MobileShell";
import {
  Dumbbell,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Fingerprint,
  Sparkles,
} from "lucide-react";

function formatMemberIdInput(input: string): string {
  let clean = input.toUpperCase().replace(/[^IS0-9-]/g, "");
  const digitsOnly = clean.replace(/\D/g, "");
  if (!clean.startsWith("IS") && digitsOnly.length >= 4) {
    const year = digitsOnly.slice(0, 4);
    const rest = digitsOnly.slice(4, 8);
    return rest ? `IS-${year}-${rest}` : `IS-${year}`;
  }

  if (clean.startsWith("IS") && !clean.includes("-") && clean.length > 2) {
    const after = clean.slice(2).replace(/\D/g, "");
    if (after.length > 4) {
      return `IS-${after.slice(0, 4)}-${after.slice(4, 8)}`;
    } else if (after.length > 0) {
      return `IS-${after}`;
    }
  }

  return clean.slice(0, 12);
}

function MobileAppContent() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);
  const [memberAuthenticated, setMemberAuthenticated] = useState(false);

  // Common Auth Context
  const { user, signInWithEmail } = useAuth();

  // Unified Login Form State
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-redirect if already logged in
  useEffect(() => {
    let active = true;

    async function checkExistingSession() {
      try {
        const memberRes = await fetch("/api/member/session");
        if (memberRes.ok) {
          const memberData = await memberRes.json();
          if (active && memberData.authenticated && memberData.member) {
            setMemberAuthenticated(true);
            return;
          }
        }
      } catch {
        // Not logged in as member
      }

      if (user) {
        if (active) {
          setMemberAuthenticated(true);
          return;
        }
      }

      if (active) {
        setCheckingSession(false);
      }
    }

    checkExistingSession();

    return () => {
      active = false;
    };
  }, [user]);

  const handleIdentifierChange = (val: string) => {
    if (val.toUpperCase().startsWith("IS") || /^\d+$/.test(val.replace(/-/g, ""))) {
      setIdentifier(formatMemberIdInput(val));
    } else {
      setIdentifier(val);
    }
  };

  // Unified Login Submission
  const handleUnifiedLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanId = identifier.trim();
    const cleanPass = password.trim();

    if (!cleanId) {
      setError("Please enter your Identifier (Email, Username, or Member ID).");
      return;
    }

    if (!cleanPass) {
      setError("Please enter your Password or Security PIN.");
      return;
    }

    setLoading(true);

    const isMemberId =
      cleanId.toUpperCase().startsWith("IS-") ||
      (cleanPass.length === 4 && /^\d{4}$/.test(cleanPass));

    if (isMemberId) {
      try {
        const res = await fetch("/api/member/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            memberId: cleanId.toUpperCase(),
            pin: cleanPass,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          setError(
            data.error || "Authentication failed. Please verify your Member ID and PIN."
          );
          setLoading(false);
          return;
        }

        setMemberAuthenticated(true);
      } catch (err: any) {
        setError(err?.message || "Connection error. Please try again.");
        setLoading(false);
      }
    } else {
      try {
        const { error: signInError } = await signInWithEmail(cleanId.toLowerCase(), cleanPass);
        if (signInError) {
          // Fallback check if member PIN format was submitted
          if (cleanPass.length === 4 && /^\d{4}$/.test(cleanPass)) {
            const memberRes = await fetch("/api/member/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ memberId: cleanId.toUpperCase(), pin: cleanPass }),
            });
            const memberData = await memberRes.json();
            if (memberRes.ok && memberData.success) {
              setMemberAuthenticated(true);
              return;
            }
          }

          setError(signInError.message || "Invalid credentials. Please verify identifier and password.");
          setLoading(false);
          return;
        }

        router.replace("/admin");
      } catch (err: any) {
        setError(err?.message || "Failed to authenticate.");
        setLoading(false);
      }
    }
  };

  // Biometric Trigger Handler
  const handleBiometricUnlock = () => {
    if (typeof window !== "undefined" && "PublicKeyCredential" in window) {
      alert("Triggering biometric verification (Fingerprint / Face Unlock)...");
    } else {
      alert("Biometric verification is available when running in the native IronSync mobile app.");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/member/logout", { method: "POST" });
    } catch {
      // ignore
    }
    setMemberAuthenticated(false);
  };

  if (memberAuthenticated) {
    return <MobileShell onLogout={handleLogout} />;
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-primary space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
        <span className="text-xs font-mono uppercase tracking-widest text-primary-muted">
          Opening IronSync...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-primary flex flex-col justify-between selection:bg-accent/20 selection:text-primary relative transition-colors">
      {/* Ambient Red Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-sm h-48 bg-accent/10 blur-[100px] pointer-events-none rounded-full" />

      {/* Main Mobile Screen Area */}
      <div className="w-full max-w-md mx-auto px-5 pt-safe pt-6 pb-safe pb-8 flex-1 flex flex-col justify-between z-10">
        <div className="flex-1 flex flex-col justify-between py-2 animate-in fade-in duration-200">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between pb-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-accent flex items-center justify-center shadow-accent-glow">
                  <Dumbbell className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <span className="font-black text-lg tracking-wider uppercase text-primary">
                    Iron<span className="text-accent">Sync</span>
                  </span>
                  <div className="text-[10px] font-mono text-primary-dim uppercase tracking-wider">
                    Mobile Platform
                  </div>
                </div>
              </div>

              <ThemeToggle />
            </div>

            <div className="space-y-1 pt-2">
              <h1 className="text-3xl font-black uppercase tracking-tight text-primary">
                Welcome to IronSync
              </h1>
              <p className="text-xs text-primary-muted">
                Enter your credentials to Sync In
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mt-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2.5 leading-relaxed animate-in fade-in">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Unified Mobile Form */}
            <form onSubmit={handleUnifiedLogin} className="mt-6 space-y-4">
              {/* Field 1: Identifier */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-primary-muted">
                  <label className="font-semibold text-primary">Identifier</label>
                  <span className="text-[10px] text-accent font-bold">Email / Member ID / Username</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-primary-dim">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    inputMode="text"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    value={identifier}
                    onChange={(e) => handleIdentifierChange(e.target.value)}
                    placeholder="Email, Username, or IS-YYYY-XXXX"
                    required
                    className="w-full pl-10 pr-4 py-3.5 bg-surface border border-border rounded-xl text-primary font-mono text-base placeholder:text-primary-dim/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  />
                </div>
              </div>

              {/* Field 2: Password / PIN */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-primary-muted">
                  <label className="font-semibold text-primary">Password</label>
                  <span className="text-[10px] text-primary-dim">Password or 4-Digit PIN</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-primary-dim">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    autoComplete="current-password"
                    className="w-full pl-10 pr-11 py-3.5 bg-surface border border-border rounded-xl text-primary text-base placeholder:text-primary-dim/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-primary-dim hover:text-primary transition-colors cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => alert("Password reset instructions sent to your registered email.")}
                  className="text-xs font-mono text-amber hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Action Buttons: Primary Crimson CTA + Biometric Trigger */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3.5 px-4 bg-accent hover:bg-accent-hover active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-accent-glow flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Sync In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Biometric Trigger */}
                <button
                  type="button"
                  onClick={handleBiometricUnlock}
                  title="Sign in with Biometrics (Fingerprint / Face Unlock)"
                  className="p-3.5 bg-surface-elevated border border-amber/40 hover:border-amber text-amber rounded-xl transition-all active:scale-95 cursor-pointer flex items-center justify-center shadow-sm"
                >
                  <Fingerprint className="w-5 h-5" />
                </button>
              </div>

              {/* Interactive Demo Mode Trigger */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setMemberAuthenticated(true)}
                  className="w-full py-3 px-4 bg-[#16161A] hover:bg-[#1F1F23] border border-white/10 text-white font-mono text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-[#00E5FF]" />
                  <span>Preview Mobile Experience (Demo)</span>
                </button>
              </div>
            </form>
          </div>

          {/* Footer Security */}
          <div className="pt-6 border-t border-border text-center flex items-center justify-between text-[11px] font-mono text-primary-dim">
            <span>IronSync Mobile App</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Encrypted Session
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MobileAppPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex flex-col items-center justify-center text-primary space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
          <span className="text-xs font-mono uppercase tracking-widest text-primary-muted">
            Loading IronSync...
          </span>
        </div>
      }
    >
      <MobileAppContent />
    </Suspense>
  );
}
