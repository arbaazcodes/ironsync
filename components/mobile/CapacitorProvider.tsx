"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { WifiOff } from "lucide-react";

export function CapacitorProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Check if offline
    if (typeof window !== "undefined") {
      setIsOffline(!window.navigator.onLine);

      const handleOnline = () => setIsOffline(false);
      const handleOffline = () => setIsOffline(true);

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      // Dynamically import Capacitor to prevent SSR issues
      let backButtonListener: { remove: () => void } | null = null;

      async function initCapacitor() {
        try {
          const { Capacitor } = await import("@capacitor/core");
          if (!Capacitor.isNativePlatform()) {
            return;
          }

          // Native Android / iOS enhancements
          const { App } = await import("@capacitor/app");
          const { StatusBar, Style } = await import("@capacitor/status-bar");
          const { SplashScreen } = await import("@capacitor/splash-screen");

          // Status bar styling
          try {
            await StatusBar.setStyle({ style: Style.Dark });
            await StatusBar.setBackgroundColor({ color: "#0C0C0C" });
          } catch (e) {
            // Non-critical if platform doesn't support status bar coloring
          }

          // Hide splash screen after client-side hydration
          try {
            await SplashScreen.hide();
          } catch (e) {
            // Ignore splash screen errors
          }

          // Hardware back button navigation
          backButtonListener = await App.addListener("backButton", ({ canGoBack }) => {
            const currentUrl = typeof window !== "undefined" ? window.location.href : "";
            const isSubViewInMobile =
              currentUrl.includes("view=member") || currentUrl.includes("view=admin");

            if (pathname === "/mobile" && isSubViewInMobile) {
              // Return to the two-door selection screen
              router.push("/mobile");
              return;
            }

            const isRootPage =
              pathname === "/" ||
              pathname === "/mobile" ||
              pathname === "/login" ||
              pathname === "/member/dashboard" ||
              pathname === "/admin";

            if (isRootPage) {
              App.exitApp();
            } else if (canGoBack) {
              window.history.back();
            } else if (pathname.startsWith("/admin")) {
              router.push("/admin");
            } else {
              router.push("/member/dashboard");
            }
          });
        } catch (err) {
          console.warn("Capacitor initialization skipped or failed:", err);
        }
      }

      initCapacitor();

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
        if (backButtonListener) {
          backButtonListener.remove();
        }
      };
    }
  }, [pathname, router]);

  return (
    <>
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-rose-600 text-white text-xs font-bold py-2 px-4 flex items-center justify-center gap-2 shadow-md animate-pulse">
          <WifiOff className="w-4 h-4" />
          <span>No internet connection. Please check your network.</span>
        </div>
      )}
      {children}
    </>
  );
}
