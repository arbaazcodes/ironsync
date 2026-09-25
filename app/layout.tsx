import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { AuthProvider } from "@/lib/context/AuthContext";
import { ThemeProvider } from "@/lib/context/ThemeContext";
import { MotionBackground } from "@/components/ui/MotionBackground";

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
  metadataBase: new URL("https://www.ironsync.online"),
  title: {
    default: "IronSync | Free Community Gym Management",
    template: "%s | IronSync",
  },
  description:
    "Free community gym management and member workout platform. Streamline member check-in, attendance tracking, daily training workouts, and front-desk floor operations for gyms.",
  keywords: [
    "gym management",
    "free gym software",
    "member workout portal",
    "gym check-in system",
    "attendance tracking",
    "strength training",
    "athlete management",
    "IronSync",
  ],
  authors: [{ name: "IronSync" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "IronSync | Free Community Gym Management",
    description:
      "Free community gym management and member workout platform. Streamline member check-in, attendance tracking, daily training workouts, and front-desk floor operations.",
    url: "https://www.ironsync.online",
    siteName: "IronSync",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IronSync | Free Community Gym Management",
    description:
      "Free community gym management and member workout platform. Streamline member check-in, attendance tracking, daily training workouts, and front-desk floor operations.",
  },
};

import { CapacitorProvider } from "@/components/mobile/CapacitorProvider";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#0C0C0C",
  interactiveWidget: "resizes-content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} light`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="font-sans antialiased bg-background text-primary min-h-screen flex flex-col selection:bg-accent/30 selection:text-white relative">
        <ThemeProvider>
          <CapacitorProvider>
            <MotionBackground />
            <AuthProvider>
              <SiteLayout>{children}</SiteLayout>
            </AuthProvider>
          </CapacitorProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
