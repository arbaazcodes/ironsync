"use client";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, activePlan } = useAuth();
  const router = useRouter();
  const path = usePathname();
  useEffect(() => { if (!isLoading && !user) router.replace("/auth?mode=signin"); }, [isLoading, user, router]);
  if (isLoading || !user) return <DashboardSkeleton />;
  if (!activePlan && path !== "/dashboard/workout") return <DashboardShell><div className="space-y-4 p-6"><h1 className="text-2xl font-bold">Your training starts here</h1><p>Create a blueprint to use this section, or start logging a workout now.</p><div className="flex gap-6"><Link href="/onboarding" className="underline">Create a blueprint</Link><Link href="/dashboard/workout" className="underline">Log a workout</Link></div></div></DashboardShell>;
  return <DashboardShell>{children}</DashboardShell>;
}
