"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error securely without exposing stack trace to the browser DOM
    if (process.env.NODE_ENV !== "production") {
      console.error("[IronSync App Error]", error);
    }
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6 bg-surface-elevated border border-border/80 rounded-2xl p-8 shadow-2xl">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-400">
          <AlertTriangle className="w-7 h-7 text-red-400" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-red-400 font-bold">
            Application Error
          </span>
          <h1 className="text-2xl font-black text-primary tracking-tight">
            Something went wrong
          </h1>
          <p className="text-xs text-primary-muted leading-relaxed max-w-sm mx-auto">
            An unexpected error occurred while rendering this page. Our telemetry has captured the event.
          </p>
          {error.message && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-left overflow-x-auto">
              <p className="text-[11px] font-mono text-red-400 break-words">
                {error.message}
              </p>
            </div>
          )}
          {error.digest && (
            <div className="flex items-center justify-between gap-2 p-2 bg-surface rounded-lg border border-border text-[10px] font-mono text-primary-dim">
              <span className="truncate">Reference: {error.digest}</span>
              <button
                type="button"
                onClick={() => navigator.clipboard?.writeText(error.digest || "")}
                className="text-primary hover:text-accent font-semibold underline shrink-0 cursor-pointer"
              >
                Copy
              </button>
            </div>
          )}
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={() => reset()}
            variant="primary"
            size="sm"
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </Button>

          <Link href="/admin" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              className="w-full flex items-center justify-center gap-2"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Go to Admin</span>
            </Button>
          </Link>
        </div>

        <div className="pt-4 border-t border-border/60">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-primary-dim hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Return to Landing Page</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
