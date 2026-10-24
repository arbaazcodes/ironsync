"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { WifiOff } from "lucide-react";

export function CapacitorProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    setIsOffline(!navigator.onLine);
    const online = () => setIsOffline(false);
    const offline = () => setIsOffline(true);
    window.addEventListener("online", online);
    window.addEventListener("offline", offline);
    let cancelled = false;
    let removeBack: (() => Promise<void>) | undefined;
    let themeObserver: MutationObserver | undefined;

    async function init() {
      const { Capacitor } = await import("@capacitor/core");
      if (!Capacitor.isNativePlatform() || cancelled) return;
      const [{ App }, { StatusBar, Style }, { SplashScreen }] = await Promise.all([
        import("@capacitor/app"),
        import("@capacitor/status-bar"),
        import("@capacitor/splash-screen"),
      ]);
      if (cancelled) return;
      const updateBars = () => {
        const dark = document.documentElement.classList.contains("dark");
        void StatusBar.setStyle({ style: dark ? Style.Dark : Style.Light }).catch(() => {});
        void StatusBar.setBackgroundColor({ color: dark ? "#0C0C0C" : "#F7F7F5" }).catch(() => {});
      };
      updateBars();
      themeObserver = new MutationObserver(updateBars);
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
      void SplashScreen.hide().catch(() => {});
      const listener = await App.addListener("backButton", ({ canGoBack }) => {
        // Read the current route; initialize once so fast navigation cannot leak listeners.
        const pathname = window.location.pathname;
        const dialog = document.querySelector<HTMLDialogElement>("dialog[open]");
        if (dialog) { dialog.close(); return; }
        if (["/", "/mobile", "/dashboard", "/auth", "/login", "/admin"].includes(pathname)) {
          void App.minimizeApp();
        } else if (canGoBack) {
          window.history.back();
        } else {
          router.replace(pathname.startsWith("/admin") ? "/admin" : "/dashboard");
        }
      });
      if (cancelled) await listener.remove();
      else removeBack = () => listener.remove();
    }
    void init().catch(() => {});
    return () => {
      cancelled = true;
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
      themeObserver?.disconnect();
      void removeBack?.();
    };
  }, [router]);

  return <>
    {isOffline && <div role="status" className="fixed inset-x-0 top-0 z-[100] flex items-center justify-center gap-2 bg-rose-600 px-4 pb-2 pt-[max(env(safe-area-inset-top),0.5rem)] text-xs font-semibold text-white">
      <WifiOff className="h-4 w-4 shrink-0" />
      <span>You’re offline. Pending workout changes will retry when connected.</span>
    </div>}
    {children}
  </>;
}
