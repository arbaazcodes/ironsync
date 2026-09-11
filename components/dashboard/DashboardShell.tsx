"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import {
  Activity,
  LayoutDashboard,
  Dumbbell,
  Utensils,
  Sparkles,
  Moon,
  FileDown,
  TrendingUp,
  History,
  LogOut,
  Menu,
  X,
  User as UserIcon,
} from "lucide-react";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const { signOut, user, activePlan } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Progress", href: "/dashboard/progress", icon: TrendingUp },
    { label: "Workout", href: "/dashboard/workout", icon: Dumbbell },
    { label: "Nutrition", href: "/dashboard/nutrition", icon: Utensils },
    { label: "Supplements", href: "/dashboard/supplements", icon: Sparkles },
    { label: "Recovery", href: "/dashboard/recovery", icon: Moon },
    { label: "Exports", href: "/dashboard/exports", icon: FileDown },
    { label: "History", href: "/dashboard/history", icon: History },
    { label: "Profile", href: "/dashboard/profile", icon: UserIcon },
  ];

  const primaryMobileNav = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Progress", href: "/dashboard/progress", icon: TrendingUp },
    { label: "Workout", href: "/dashboard/workout", icon: Dumbbell },
    { label: "Nutrition", href: "/dashboard/nutrition", icon: Utensils },
    { label: "Profile", href: "/dashboard/profile", icon: UserIcon },
  ];

  return (
    <div className="min-h-screen bg-background text-primary flex flex-col md:flex-row relative selection:bg-accent/30 selection:text-white">
      {/* ========================================================================= */}
      {/* DESKTOP SIDEBAR */}
      {/* ========================================================================= */}
      <aside className="hidden md:flex flex-col justify-between w-64 border-r border-border bg-surface/80 backdrop-blur-xl p-5 shrink-0 min-h-screen sticky top-0 h-screen z-30">
        <div className="space-y-7">
          {/* Brand & ThemeToggle Header */}
          <div className="flex items-center justify-between pt-1">
            <Link
              href="/"
              className="flex items-center gap-2.5 group outline-none"
            >
              <div className="w-8 h-8 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent group-hover:shadow-[0_0_12px_rgba(255,30,30,0.4)] transition-all">
                <Activity className="w-4 h-4 text-accent" strokeWidth={2.5} />
              </div>
              <span className="font-sans font-extrabold text-lg tracking-tight text-primary uppercase">
                Iron<span className="text-accent">Sync</span>
              </span>
            </Link>

            <ThemeToggle />
          </div>

          {/* Nav Items */}
          <nav className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase text-primary-dim tracking-widest block px-3 mb-2 font-bold">
              Blueprint Management
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-accent/15 text-accent border border-accent/40 shadow-sm"
                      : "text-primary-muted hover:text-primary hover:bg-surface-elevated border border-transparent"
                  }`}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-accent shadow-[0_0_8px_rgba(255,30,30,0.9)]" />
                  )}
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-accent" : "text-primary-dim"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile & Logout */}
        <div className="border-t border-border pt-4 space-y-2">
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl bg-surface-elevated border border-border hover:border-accent/40 transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent shrink-0 group-hover:bg-accent group-hover:text-white transition-colors">
              <UserIcon className="w-4 h-4" />
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-bold text-primary truncate group-hover:text-accent transition-colors">
                {activePlan?.displayName || user?.email?.split("@")[0] || "Athlete"}
              </p>
              <p className="text-[10px] font-mono text-primary-dim truncate">
                Settings &bull; v{activePlan?.version || 1} Active
              </p>
            </div>
          </Link>

          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-mono font-semibold text-primary-dim hover:text-accent hover:bg-accent/10 rounded-xl transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MOBILE TOP HEADER */}
      {/* ========================================================================= */}
      <header className="md:hidden border-b border-border bg-background/95 backdrop-blur-md sticky top-0 z-40 px-4 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
            <Activity className="w-4 h-4 text-accent" />
          </div>
          <span className="font-sans font-extrabold text-base tracking-tight text-primary uppercase">
            Iron<span className="text-accent">Sync</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-surface border border-border text-primary-muted hover:text-primary"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Slide-Out Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[57px] bg-surface/98 backdrop-blur-2xl border-b border-border p-5 z-40 shadow-2xl space-y-3">
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-mono font-bold ${
                    isActive ? "bg-accent/15 text-accent border border-accent/40 shadow-sm" : "text-primary-muted hover:text-primary"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-accent" : ""}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-border">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                signOut();
              }}
              className="w-full flex items-center gap-2 text-xs text-accent py-2 font-mono font-bold"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MAIN CONTENT WORKSPACE */}
      {/* ========================================================================= */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 pb-24 md:pb-10 max-w-6xl mx-auto w-full overflow-y-auto">
        {children}
      </main>

      {/* ========================================================================= */}
      {/* MOBILE BOTTOM NAVIGATION */}
      {/* ========================================================================= */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 bg-background/95 backdrop-blur-xl border-t border-border z-40 px-2 py-1.5 flex items-center justify-around shadow-2xl"
      >
        {primaryMobileNav.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 min-h-[44px] min-w-[56px] py-1 px-2 rounded-xl text-[10px] font-mono font-bold transition-all ${
                isActive ? "text-accent" : "text-primary-dim hover:text-primary"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-accent stroke-[2.5]" : ""}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
