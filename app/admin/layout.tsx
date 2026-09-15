"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  BarChart3,
  Settings,
  LogOut,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login?tab=admin");
  };

  const navItems = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Members", href: "/admin/members", icon: Users },
    { label: "Plans Catalog", href: "/admin/plans", icon: Dumbbell },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background text-primary flex flex-col md:flex-row selection:bg-accent/20 selection:text-primary">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-surface/90 backdrop-blur-md sticky top-0 z-50">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shadow-sm">
            <Dumbbell className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-sm tracking-wider uppercase text-primary">
            Iron<span className="text-accent">Sync</span>
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-elevated border border-border text-primary-dim">
            ADMIN
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg bg-surface-elevated border border-border text-primary-muted hover:text-primary"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-[53px] bg-surface/98 z-40 p-5 space-y-4 backdrop-blur-xl border-b border-border">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-accent text-white font-semibold shadow-sm"
                      : "text-primary-muted hover:text-primary hover:bg-surface-elevated"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out Admin
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-surface min-h-screen sticky top-0 h-screen p-5 justify-between transition-colors">
        <div className="space-y-6">
          {/* Logo & Gym Info */}
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center shadow-sm">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-extrabold text-base tracking-wider uppercase text-primary">
                Iron<span className="text-accent">Sync</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-primary-dim">
                <ShieldCheck className="w-3 h-3 text-accent" />
                ADMIN PORTAL
              </div>
            </div>
          </Link>

          {/* Nav Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-150 ${
                    isActive
                      ? "bg-accent text-white shadow-sm"
                      : "text-primary-muted hover:text-primary hover:bg-surface-elevated"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile & Theme Toggle & Logout */}
        <div className="pt-4 border-t border-border space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="truncate pr-2">
              <div className="text-[10px] font-mono text-primary-dim uppercase">Signed in as</div>
              <div className="text-xs font-medium text-primary truncate max-w-[140px]">
                {user?.email || "Administrator"}
              </div>
            </div>
            <ThemeToggle />
          </div>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-primary-muted hover:text-rose-600 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 bg-background p-4 sm:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
