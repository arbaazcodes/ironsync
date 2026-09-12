"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Dumbbell,
  Apple,
  User,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  Menu,
  X,
  Loader2,
  Sparkles,
} from "lucide-react";
import { GymMember } from "@/lib/types/member";

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [member, setMember] = useState<Partial<GymMember> | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function loadSession() {
      try {
        const res = await fetch("/api/member/session");
        if (!res.ok) {
          router.push("/login?tab=member");
          return;
        }
        const data = await res.json();
        if (!data.authenticated || !data.member) {
          router.push("/login?tab=member");
          return;
        }
        setMember(data.member);
      } catch (err) {
        console.error("Session load error:", err);
        router.push("/login?tab=member");
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/member/logout", { method: "POST" });
      router.push("/login?tab=member");
    } catch (e) {
      router.push("/login?tab=member");
    }
  };

  const navItems = [
    { label: "Dashboard", href: "/member/dashboard", icon: LayoutDashboard },
    { label: "Workout", href: "/member/workout", icon: Dumbbell },
    { label: "Nutrition", href: "/member/nutrition", icon: Apple },
    { label: "Profile", href: "/member/profile", icon: User },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF1E1E]" />
        <span className="text-xs font-mono text-white/50 tracking-wider uppercase">
          Loading Member Portal...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col selection:bg-[#FF1E1E]/30 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-white/[0.08] bg-[#0c0c0c]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          {/* Logo & Gym Branding */}
          <div className="flex items-center gap-3">
            <Link href="/member/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF1E1E] to-[#B30000] flex items-center justify-center shadow-md shadow-[#FF1E1E]/20">
                <Dumbbell className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-base tracking-wider uppercase">
                Iron<span className="text-[#FF1E1E]">Sync</span>
              </span>
            </Link>

            {/* Member Badges */}
            {member && (
              <div className="hidden sm:flex items-center gap-2 border-l border-white/[0.1] pl-3">
                <span className="px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-[11px] font-mono font-bold text-white">
                  {member.memberId}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[10px] font-mono uppercase text-emerald-400 font-bold">
                  Active
                </span>
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-150 ${
                    isActive
                      ? "bg-[#FF1E1E] text-white shadow-md shadow-[#FF1E1E]/20"
                      : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Member Name + Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <div className="text-xs font-bold text-white">{member?.fullName}</div>
              <div className="text-[10px] font-mono text-white/40 uppercase">Athlete</div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white/[0.05] text-white/70 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/[0.08] bg-[#0c0c0c] px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider ${
                    isActive
                      ? "bg-[#FF1E1E] text-white"
                      : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
