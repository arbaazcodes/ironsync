import React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { ArrowLeft, Shield } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — IronSync",
  description: "How IronSync protects your personal biometric and lifestyle data.",
};

export default function PrivacyPage() {
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
              <Shield className="w-5 h-5 text-accent" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-sm text-primary-muted font-mono">
              Last updated: September 2026
            </p>
          </div>

          <Card variant="elevated" padding="lg" className="space-y-6 text-sm text-primary-muted leading-relaxed">
            <div>
              <h2 className="text-base font-bold text-primary mb-2">
                1. Pre-Authentication Data Handling
              </h2>
              <p>
                IronSync operates under a strict privacy-first model. Any biometrics, workout preferences, or dietary inputs entered into the initial blueprint generator are processed locally in your session and are not sold, shared, or indexed by third-party advertisers.
              </p>
            </div>

            <div className="border-t border-border/60 pt-6">
              <h2 className="text-base font-bold text-primary mb-2">
                2. Data We Collect
              </h2>
              <p>
                When you generate a fitness blueprint, we process the parameters you provide (such as fitness goals, age bracket, training schedule, and equipment constraints) solely to calculate your customized workout split, calorie target, and recovery windows.
              </p>
            </div>

            <div className="border-t border-border/60 pt-6">
              <h2 className="text-base font-bold text-primary mb-2">
                3. Contact Information
              </h2>
              <p>
                If you have inquiries regarding privacy practices, contact our team at{" "}
                <a href="mailto:privacy@ironsync.fit" className="text-accent hover:underline font-mono">
                  privacy@ironsync.fit
                </a>.
              </p>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}
