"use client";

import React, { useEffect } from "react";
import { AlertOctagon, RefreshCw } from "lucide-react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error("[IronSync Global Error]", error);
    }
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="bg-[#0A0D12] text-[#F3F4F6] min-h-screen flex items-center justify-center p-4 font-sans antialiased">
        <div className="max-w-md w-full text-center space-y-6 bg-[#111620] border border-[#1F2937] rounded-2xl p-8 shadow-2xl">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-400">
            <AlertOctagon className="w-7 h-7 text-red-400" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-red-400 font-bold">
              Critical System Error
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Application encountered an error
            </h1>
            <p className="text-xs text-[#9CA3AF] leading-relaxed max-w-sm mx-auto">
              A critical failure occurred. Please attempt to reset the application session.
            </p>
            {error.digest && (
              <p className="text-[10px] font-mono text-[#6B7280] pt-1">
                Digest: {error.digest}
              </p>
            )}
          </div>

          <div className="pt-2 flex justify-center">
            <button
              onClick={() => reset()}
              className="h-10 px-5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all active:scale-[0.98]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
