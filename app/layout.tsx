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

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} light`}>
      <body className="font-sans antialiased bg-background text-primary min-h-screen flex flex-col selection:bg-accent/30 selection:text-white relative">
        <ThemeProvider>
          <MotionBackground />
          <AuthProvider>
            <SiteLayout>{children}</SiteLayout>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
