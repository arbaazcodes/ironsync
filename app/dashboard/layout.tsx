"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/Button";
import { Sparkles, ArrowRight } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading, activePlan, isConfigured } = useAuth();

  useEffect(() => {
    // If done loading, no user and no local active plan, redirect to login
    if (!isLoading && !user && !activePlan) {
      router.replace("/login?next=/dashboard");
    }
  }, [isLoading, user, activePlan, router]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // If no user and no plan, return empty placeholder while redirecting
  if (!user && !activePlan) {
    return <DashboardSkeleton />;
  }

  // If authenticated but no plan created yet
  if (user && !activePlan) {
    return (
      <div className="min-h-screen bg-background text-primary flex items-center justify-center p-6 text-center">
        <div className="max-w-md mx-auto space-y-5 rounded-2xl bg-surface border border-border p-8 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-surface-elevated border border-accent/40 flex items-center justify-center text-accent mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-primary">No Active Blueprint Yet</h2>
          <p className="text-xs sm:text-sm text-primary-muted leading-relaxed">
            You don&apos;t have an active fitness plan configured. Build your personalized 60-second blueprint to unlock your dashboard.
          </p>
          <div className="pt-2">
            <Button
              href="/member/dashboard"
              variant="primary"
              size="md"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Go to Member Portal
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <DashboardShell>{children}</DashboardShell>;
}
