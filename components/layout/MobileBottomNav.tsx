"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Dumbbell, Apple, User } from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/member/dashboard", icon: LayoutDashboard },
    { label: "Workout", href: "/member/workout", icon: Dumbbell },
    { label: "Diet", href: "/member/nutrition", icon: Apple },
    { label: "Profile", href: "/member/profile", icon: User },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border shadow-[0_-4px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.5)] transition-colors"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      aria-label="Mobile Navigation"
    >
      <div className="grid grid-cols-4 h-16 max-w-md mx-auto items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 h-full py-1 relative select-none transition-all active:scale-95 touch-manipulation ${
                isActive
                  ? "text-accent"
                  : "text-muted-text hover:text-primary-text"
              }`}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-accent rounded-full shadow-[0_0_8px_var(--accent)]" />
              )}
              <div
                className={`p-1 rounded-xl transition-colors ${
                  isActive ? "bg-accent/10" : ""
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
              </div>
              <span className={`text-[10px] tracking-tight font-medium ${isActive ? "font-bold text-accent" : ""}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
