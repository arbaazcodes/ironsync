"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight, Activity, LogIn } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAuth } from "@/lib/context/AuthContext";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

          <Link
            href={user ? "/dashboard" : "/auth"}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-muted hover:text-primary transition-colors px-3 py-1.5 rounded-xl hover:bg-surface border border-transparent hover:border-border"
          >
            <LogIn className="w-3.5 h-3.5 text-accent" />
            <span>{user ? "Dashboard" : "Log in"}</span>
          </Link>

          <Button
            href="/onboarding"
            variant="primary"
            size="sm"
            icon={<ArrowRight className="w-4 h-4" />}
            className="font-bold text-xs uppercase tracking-wider shadow-accent-glow"
          >
            Create My Blueprint
          </Button>
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

            <Link
              href={user ? "/dashboard" : "/auth"}
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-primary hover:text-accent py-2 border-b border-border/50 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <LogIn className="w-4 h-4 text-accent" />
                {user ? "Go to Dashboard" : "Log in to Account"}
              </span>
              <ArrowRight className="w-4 h-4 text-primary-dim" />
            </Link>

            <div className="pt-2">
              <Button
                href="/onboarding"
                variant="primary"
                size="lg"
                className="w-full justify-center font-bold text-sm uppercase tracking-wider"
                icon={<ArrowRight className="w-4 h-4" />}
                onClick={() => setMobileMenuOpen(false)}
              >
                Create My Blueprint
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
