import React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { ArrowLeft, FileText, CheckCircle, ShieldAlert, KeyRound, HelpCircle } from "lucide-react";

export const metadata = {
  title: "Terms of Service — IronSync Free Gym Platform",
  description: "Terms and conditions for utilizing the IronSync free gym management and workout platform.",
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
              Last updated: September 2026 &bull; IronSync Free Gym Platform
            </p>
          </div>

          <Card variant="elevated" padding="lg" className="space-y-6 text-sm text-primary-muted leading-relaxed">
            <div>
              <div className="flex items-center gap-2 text-primary font-bold text-base mb-2">
                <CheckCircle className="w-4 h-4 text-accent" />
                <h2>1. 100% Free Platform Terms</h2>
              </div>
              <p>
                IronSync is provided completely free of charge to gyms, trainers, and athletes. There are no software usage fees, mandatory dues, recurring charges, or paid premium tiers for accessing the member or admin portals.
              </p>
            </div>

            <div className="border-t border-border/60 pt-6">
              <div className="flex items-center gap-2 text-primary font-bold text-base mb-2">
                <KeyRound className="w-4 h-4 text-accent" />
                <h2>2. Member & Staff Account Access</h2>
              </div>
              <p>
                Member access credentials (Member ID and 4-digit security PIN) are issued directly by your local gym front-desk staff upon enrollment. You agree to access only the account assigned to you and to keep your security PIN confidential. Unauthorized attempts to access accounts or brute-force member credentials will trigger security lockouts.
              </p>
            </div>

            <div className="border-t border-border/60 pt-6">
              <div className="flex items-center gap-2 text-primary font-bold text-base mb-2">
                <ShieldAlert className="w-4 h-4 text-accent" />
                <h2>3. Physical Fitness & Health Disclaimer</h2>
              </div>
              <p>
                IronSync provides workout tracking, exercise logging, and attendance tools for athletic training. The exercise libraries and training templates provided are for informational and organizational purposes only. Always consult with a qualified fitness professional, personal trainer, or physician before beginning any strenuous physical exercise program.
              </p>
            </div>

            <div className="border-t border-border/60 pt-6">
              <div className="flex items-center gap-2 text-primary font-bold text-base mb-2">
                <HelpCircle className="w-4 h-4 text-accent" />
                <h2>4. Support & Questions</h2>
              </div>
              <p>
                For questions regarding these terms, gym onboarding, or system use, please contact our support team at{" "}
                <a href="mailto:support@ironsync.online" className="text-accent hover:underline font-mono font-medium">
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
