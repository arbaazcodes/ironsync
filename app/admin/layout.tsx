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
  Plus,
  Sparkles,
} from "lucide-react";

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
    <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/[0.08] bg-[#0c0c0c]/90 backdrop-blur-md sticky top-0 z-50">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FF1E1E] flex items-center justify-center shadow-md shadow-[#FF1E1E]/20">
            <Dumbbell className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-sm tracking-wider uppercase">
            Iron<span className="text-[#FF1E1E]">Sync</span>
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.08] text-white/70">
            ADMIN
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-white/[0.05] text-white/70 hover:text-white"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-[53px] bg-[#050505]/95 z-40 p-5 space-y-4 backdrop-blur-xl border-b border-white/[0.08]">
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
                      ? "bg-[#FF1E1E] text-white font-semibold"
                      : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-white/[0.08]">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out Admin
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-white/[0.08] bg-[#0a0a0a] min-h-screen sticky top-0 h-screen p-5 justify-between">
        <div className="space-y-6">
          {/* Logo & Gym Info */}
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF1E1E] to-[#B30000] flex items-center justify-center shadow-lg shadow-[#FF1E1E]/20">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-extrabold text-base tracking-wider uppercase">
                Iron<span className="text-[#FF1E1E]">Sync</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/50">
                <ShieldCheck className="w-3 h-3 text-[#FF1E1E]" />
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
                      ? "bg-[#FF1E1E] text-white shadow-md shadow-[#FF1E1E]/25"
                      : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile / Logout */}
        <div className="pt-4 border-t border-white/[0.08] space-y-3">
          <div className="px-2">
            <div className="text-[11px] font-mono text-white/40 uppercase">Logged in as</div>
            <div className="text-xs font-medium text-white truncate">
              {user?.email || "Gym Administrator"}
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 bg-[#050505] p-4 sm:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
