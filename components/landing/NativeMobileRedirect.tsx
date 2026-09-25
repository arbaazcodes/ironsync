"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function NativeMobileRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("@capacitor/core")
        .then(({ Capacitor }) => {
          if (Capacitor.isNativePlatform()) {
            router.replace("/mobile");
          }
        })
        .catch(() => {});
    }
  }, [router]);

  return null;
}
