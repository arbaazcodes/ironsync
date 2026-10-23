"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { useProgram } from "@/components/consumer/ProgramProvider";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { WorkoutProvider } from "@/components/workout/WorkoutProvider";
import { secondary } from "@/components/consumer/ui";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const { program, loading, error, refresh } = useProgram();
  const router = useRouter();
  const path = usePathname();
  useEffect(() => {
    if (!isLoading && !user) router.replace("/auth?mode=signin");
    else if (
      user &&
      !loading &&
      !error &&
      !program &&
      path !== "/dashboard/workout"
    )
      router.replace("/onboarding");
  }, [isLoading, user, program, loading, error, router, path]);
  if (isLoading || !user || loading)
    return (
      <div className="p-8" role="status">
        Opening your training space…
      </div>
    );
  if (error && path !== "/dashboard/workout")
    return (
      <DashboardShell>
        <h1 className="text-2xl font-semibold">Let’s reconnect.</h1>
        <p className="my-4" role="alert">
          {error}
        </p>
        <button className={secondary} onClick={() => void refresh()}>
          Try again
        </button>
      </DashboardShell>
    );
  if (!program && path !== "/dashboard/workout")
    return (
      <p className="p-8" role="status">
        Opening your preferences…
      </p>
    );
  return (
    <WorkoutProvider>
      <DashboardShell>{children}</DashboardShell>
    </WorkoutProvider>
  );
}
