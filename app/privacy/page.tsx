import React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { ArrowLeft, Shield, Lock, CreditCard, UserCheck, HelpCircle } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — IronSync Free Gym Platform",
  description: "Privacy policy for the IronSync free gym management and member workout platform.",
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
              Last updated: September 2026 &bull; IronSync Free Gym Platform
            </p>
          </div>

          <Card variant="elevated" padding="lg" className="space-y-6 text-sm text-primary-muted leading-relaxed">
            <div>
              <div className="flex items-center gap-2 text-primary font-bold text-base mb-2">
                <Shield className="w-4 h-4 text-accent" />
                <h2>1. Free Gym Platform Privacy Commitment</h2>
              </div>
              <p>
                IronSync is a 100% free gym management and athlete workout tracking platform. We do not sell, monetize, rent, or trade member or gym data to third parties or advertising networks. All operational data is collected solely to power your gym&apos;s attendance, check-ins, and daily workout tracking.
              </p>
            </div>

            <div className="border-t border-border/60 pt-6">
              <div className="flex items-center gap-2 text-primary font-bold text-base mb-2">
                <CreditCard className="w-4 h-4 text-accent" />
                <h2>2. Zero Payment & Financial Data Processing</h2>
              </div>
              <p>
                IronSync does not charge gym members or operators for using this application. We do not collect, process, or store credit card numbers, bank account information, or financial billing credentials anywhere in our system.
              </p>
            </div>

            <div className="border-t border-border/60 pt-6">
              <div className="flex items-center gap-2 text-primary font-bold text-base mb-2">
                <UserCheck className="w-4 h-4 text-accent" />
                <h2>3. Information We Collect and Manage</h2>
              </div>
              <p className="mb-3">
                To support gym check-ins and member workout access, IronSync manages:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-1 text-primary-dim">
                <li><strong className="text-primary">Gym Member ID:</strong> Assigned by your local gym front desk (e.g., IS-2026-0001).</li>
                <li><strong className="text-primary">Basic Profile:</strong> Name, phone number, and optional emergency contact provided upon enrollment.</li>
                <li><strong className="text-primary">Attendance Records:</strong> Date and time timestamps for gym check-in sessions.</li>
                <li><strong className="text-primary">Workout & Fitness Splits:</strong> Exercise routines and training logs assigned by gym staff.</li>
              </ul>
            </div>

            <div className="border-t border-border/60 pt-6">
              <div className="flex items-center gap-2 text-primary font-bold text-base mb-2">
                <Lock className="w-4 h-4 text-accent" />
                <h2>4. Credential Security & PIN Protection</h2>
              </div>
              <p>
                Member security PINs are strictly protected using cryptographic salted scrypt hashing. Plaintext PINs are never stored in databases or logged. Session tokens are signed using HMAC-SHA256 and transmitted exclusively via encrypted, secure, HttpOnly cookies.
              </p>
            </div>

            <div className="border-t border-border/60 pt-6">
              <div className="flex items-center gap-2 text-primary font-bold text-base mb-2">
                <HelpCircle className="w-4 h-4 text-accent" />
                <h2>5. Contact & Privacy Inquiries</h2>
              </div>
              <p>
                If you have questions about privacy practices or data handling, please contact our team at{" "}
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
