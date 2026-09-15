import React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Activity } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background-subtle py-14 sm:py-16 text-sm text-primary-muted">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-border/60">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 outline-none"
              aria-label="IronSync Home"
            >
              <div className="w-8 h-8 rounded-lg bg-surface-elevated border border-border flex items-center justify-center text-accent">
                <Activity className="w-4 h-4 text-accent" strokeWidth={2.2} />
              </div>
              <span className="font-sans font-bold text-base tracking-tight text-primary">
                Iron<span className="text-accent">Sync</span>
              </span>
            </Link>
            <p className="text-sm text-primary-muted max-w-sm leading-relaxed pretty-text">
              Algorithmic fitness blueprints tailored to your specific schedule,
              body metrics, gym equipment, and food preferences. Built around real life.
            </p>
            <div className="text-xs text-primary-dim">
              Designed with high-precision athletic wellness standards.
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-primary font-mono">
              Product
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/#how-it-works"
                  className="hover:text-primary transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/#features"
                  className="hover:text-primary transition-colors"
                >
                  Blueprint Architecture
                </Link>
              </li>
              <li>
                <Link
                  href="/#personalization"
                  className="hover:text-primary transition-colors"
                >
                  Personalization Engine
                </Link>
              </li>
              <li>
                <Link
                  href="/login?tab=member"
                  className="text-accent hover:text-accent-hover transition-colors font-medium inline-flex items-center gap-1"
                >
                  Member Portal &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Info */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-primary font-mono">
              Information
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@ironsync.fit"
                  className="hover:text-primary transition-colors"
                >
                  support@ironsync.fit
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-primary-dim">
          <p>&copy; {new Date().getFullYear()} IronSync Inc. All rights reserved.</p>
          <p className="font-mono text-[11px]">
            Zero account required to generate your personal blueprint.
          </p>
        </div>
      </Container>
    </footer>
  );
}
