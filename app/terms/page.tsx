import React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { ArrowLeft, FileText } from "lucide-react";

export const metadata = {
  title: "Terms of Service — IronSync",
  description: "Terms and conditions for utilizing IronSync fitness blueprint software.",
};

export default function TermsPage() {
  return (
    <div className="py-24 sm:py-32">
      <Container size="narrow">
        <div className="space-y-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary-muted hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Overview
          </Link>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-surface-elevated border border-border flex items-center justify-center text-accent">
              <FileText className="w-5 h-5 text-accent" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
              Terms of Service
            </h1>
            <p className="text-sm text-primary-muted font-mono">
              Last updated: September 2026
            </p>
          </div>

          <Card variant="elevated" padding="lg" className="space-y-6 text-sm text-primary-muted leading-relaxed">
            <div>
              <h2 className="text-base font-bold text-primary mb-2">
                1. General Fitness Disclaimer
              </h2>
              <p>
                IronSync provides software for fitness planning, progressive overload structuring, and nutritional estimation. The blueprints and calculators generated are for informational and educational purposes only and do not replace certified medical consultation or physical therapy.
              </p>
            </div>

            <div className="border-t border-border/60 pt-6">
              <h2 className="text-base font-bold text-primary mb-2">
                2. Use of Service
              </h2>
              <p>
                You agree to use IronSync responsibly and ensure your physical capability before attempting any intense resistance training or caloric adjustments suggested in your blueprint.
              </p>
            </div>

            <div className="border-t border-border/60 pt-6">
              <h2 className="text-base font-bold text-primary mb-2">
                3. Inquiries
              </h2>
              <p>
                Questions regarding our terms of service may be directed to{" "}
                <a href="mailto:support@ironsync.online" className="text-accent hover:underline font-mono">
                  support@ironsync.online
                </a>.
              </p>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}
