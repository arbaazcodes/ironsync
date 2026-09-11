import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteLayout } from "@/components/layout/SiteLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "IronSync — Personalized Fitness Blueprint",
  description:
    "Build a fitness plan that actually fits your life. Tailored workouts, personalized calories, and structured recovery engineered around your real schedule and goals.",
  keywords: [
    "fitness plan",
    "personalized workout",
    "nutrition blueprint",
    "macro calculator",
    "strength training",
    "recovery protocol",
  ],
  authors: [{ name: "IronSync" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#050505",
};

import { AuthProvider } from "@/lib/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
      <body className="font-sans antialiased bg-background text-primary min-h-screen flex flex-col selection:bg-accent/30 selection:text-white">
        <AuthProvider>
          <SiteLayout>{children}</SiteLayout>
        </AuthProvider>
      </body>
    </html>
  );
}

