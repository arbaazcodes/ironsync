"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, Activity, LogIn, ShieldCheck, Dumbbell } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAuth } from "@/lib/context/AuthContext";

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user, signOut } = useAuth();
  const [member, setMember] = useState<{ id: string; fullName: string; memberId: string } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check member session cookie on mount and route changes
  useEffect(() => {
    let mounted = true;
    async function checkMember() {
      try {
        const res = await fetch("/api/member/session");
        if (res.ok) {
          const data = await res.json();
          if (mounted && data.authenticated && data.member) {
            setMember(data.member);
            return;
          }
        }
        if (mounted) setMember(null);
      } catch {
        if (mounted) setMember(null);
      }
    }
    checkMember();
    return () => {
      mounted = false;
    };
  }, [pathname]);

  const handleMemberLogout = async () => {
    try {
      await fetch("/api/member/logout", { method: "POST" });
    } catch {
      // ignore
    }
    setMember(null);
    window.location.href = "/login?tab=member";
  };

  const handleAdminLogout = async () => {
    await signOut();
    window.location.href = "/login?tab=admin";
  };

  const navLinks = [
    { label: "How it works", href: "/#how-it-works" },
    { label: "Features", href: "/#features" },
    { label: "Personalization", href: "/#personalization" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/85 backdrop-blur-md border-b border-border py-3.5 shadow-sm"
          : "bg-transparent py-5"
      }`}
    >
      <Container className="flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group outline-none"
          aria-label="IronSync Home"
        >
          <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent group-hover:shadow-[0_0_12px_rgba(255,30,30,0.4)] transition-all duration-200">
            <Activity className="w-5 h-5 text-accent" strokeWidth={2.5} />
          </div>
          <div className="flex items-center gap-1">
            <span className="font-sans font-extrabold text-lg tracking-tight text-primary uppercase">
              Iron<span className="text-accent">Sync</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-primary-muted">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-primary transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-accent hover:after:w-full after:transition-all after:duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Right CTA + Theme Toggle */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {/* Case 1: Logged-in Admin */}
          {user ? (
            <>
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-muted hover:text-primary transition-colors px-3 py-1.5 rounded-xl hover:bg-surface border border-transparent hover:border-border"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                <span>Admin</span>
              </Link>
              <button
                onClick={handleAdminLogout}
                className="text-xs font-mono text-primary-dim hover:text-accent transition-colors px-2 py-1 cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : member ? (
            /* Case 2: Logged-in Member */
            <>
              <Link
                href="/member/dashboard"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-muted hover:text-primary transition-colors px-3 py-1.5 rounded-xl hover:bg-surface border border-transparent hover:border-border"
              >
                <Dumbbell className="w-3.5 h-3.5 text-accent" />
                <span>Member Dashboard</span>
              </Link>
              <button
                onClick={handleMemberLogout}
                className="text-xs font-mono text-primary-dim hover:text-accent transition-colors px-2 py-1 cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            /* Case 3: Logged Out */
            <>
              <Link
                href="/login?tab=member"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-muted hover:text-primary transition-colors px-3.5 py-1.5 rounded-xl hover:bg-surface border border-border/60 hover:border-border"
              >
                <LogIn className="w-3.5 h-3.5 text-accent" />
                <span>Login</span>
              </Link>

              <Button
                href="/login?tab=member"
                variant="primary"
                size="sm"
                icon={<ArrowRight className="w-4 h-4" />}
                className="font-bold text-xs uppercase tracking-wider shadow-accent-glow"
              >
                Get Started
              </Button>
            </>
          )}
        </div>

        {/* Mobile Header Controls */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-primary-muted hover:text-primary hover:bg-surface border border-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </Container>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[65px] bg-surface/98 backdrop-blur-xl border-b border-border px-6 py-6 shadow-2xl transition-all duration-200 animate-in fade-in slide-in-from-top-2">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-primary-muted hover:text-primary py-2 border-b border-border/50"
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-semibold text-primary hover:text-accent py-2 border-b border-border/50 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-accent" />
                    Admin Portal
                  </span>
                  <ArrowRight className="w-4 h-4 text-primary-dim" />
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleAdminLogout();
                  }}
                  className="text-left text-sm font-mono text-primary-dim hover:text-accent py-2 border-b border-border/50 cursor-pointer"
                >
                  Sign out
                </button>
              </>
            ) : member ? (
              <>
                <Link
                  href="/member/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-semibold text-primary hover:text-accent py-2 border-b border-border/50 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Dumbbell className="w-4 h-4 text-accent" />
                    Member Dashboard
                  </span>
                  <ArrowRight className="w-4 h-4 text-primary-dim" />
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleMemberLogout();
                  }}
                  className="text-left text-sm font-mono text-primary-dim hover:text-accent py-2 border-b border-border/50 cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login?tab=member"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-primary hover:text-accent py-2 border-b border-border/50 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <LogIn className="w-4 h-4 text-accent" />
                  Log in (Member &amp; Admin)
                </span>
                <ArrowRight className="w-4 h-4 text-primary-dim" />
              </Link>
            )}

            <div className="pt-2">
              <Button
                href={user ? "/admin" : member ? "/member/dashboard" : "/login?tab=member"}
                variant="primary"
                size="lg"
                className="w-full justify-center font-bold text-sm uppercase tracking-wider"
                icon={<ArrowRight className="w-4 h-4" />}
                onClick={() => setMobileMenuOpen(false)}
              >
                {user ? "Admin Portal" : member ? "Member Dashboard" : "Get Started"}
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
