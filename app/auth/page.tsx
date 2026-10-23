import Link from "next/link";
import { Activity } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
export const metadata = {
  title: "Your training starts here",
  description:
    "Sign in, choose your goals, and get your workout and meal plan.",
  robots: { index: false, follow: true },
};
export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; next?: string; error?: string }>;
}) {
  const params = await searchParams;
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="mx-auto w-full max-w-lg px-5 py-7">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2 text-xl font-bold"
        >
          <Activity className="h-6 w-6 text-accent" />
          IronSync
        </Link>
      </header>
      <div className="mx-auto w-full max-w-lg flex-1 px-5 pb-8 pt-2">
        <p className="mb-6 text-sm text-primary-muted">
          Your workout. Your meals. One simple plan.
        </p>
        <AuthCard
          initialMode={params.mode === "signup" ? "signup" : "signin"}
          next={params.next}
          callbackError={Boolean(params.error)}
        />
      </div>
      <footer className="pb-6 text-center text-xs text-primary-muted">
        A little stronger, every day.
      </footer>
    </div>
  );
}
