"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  CalendarDays,
  Dumbbell,
  Home,
  UserRound,
  Utensils,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
const tabs = [
  { name: "Today", href: "/dashboard", icon: Home },
  { name: "Plan", href: "/dashboard/plan", icon: Dumbbell },
  { name: "Food", href: "/dashboard/nutrition", icon: Utensils },
  { name: "Calendar", href: "/dashboard/calendar", icon: CalendarDays },
  { name: "Profile", href: "/dashboard/profile", icon: UserRound },
];
export function DashboardShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <div className="min-h-dvh bg-background text-primary">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/dashboard"
            className="flex min-h-11 items-center gap-2.5 text-lg font-bold tracking-tight"
            aria-label="IronSync Today"
          >
            <Activity className="h-6 w-6 text-accent" aria-hidden="true" />
            IronSync
            <span className="ml-2 hidden border-l border-border pl-3 text-xs font-normal text-primary-muted sm:inline">
              A little stronger, every day.
            </span>
          </Link>
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-1 md:flex"
          >
            {tabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={path === tab.href ? "page" : undefined}
                className={
                  "rounded-lg px-4 py-3 text-sm font-medium " +
                  (path === tab.href
                    ? "bg-surface-elevated text-primary"
                    : "text-primary-muted hover:text-primary")
                }
              >
                {tab.name}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </header>
      <div className="mx-auto w-full max-w-5xl px-4 pb-28 pt-7 sm:px-8 sm:pt-10 md:pb-12">
        {children}
      </div>
      <nav
        aria-label="Main mobile navigation"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-surface/95 px-2 pb-[max(env(safe-area-inset-bottom),0.4rem)] pt-2 backdrop-blur-lg md:hidden"
      >
        {tabs.map((tab) => {
          const selected =
            path === tab.href ||
            (tab.name === "Plan" && path === "/dashboard/workout");
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={selected ? "page" : undefined}
              className={
                "flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-medium " +
                (selected ? "text-accent" : "text-primary-muted")
              }
            >
              <Icon
                className="h-5 w-5"
                strokeWidth={selected ? 2.3 : 1.7}
                aria-hidden="true"
              />
              {tab.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
