import React from "react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="py-28 sm:py-36 flex items-center justify-center text-center">
      <Container size="narrow">
        <div className="space-y-4">
          <span className="text-xs font-mono text-accent font-bold">404 &bull; NOT FOUND</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
            Page not found
          </h1>
          <p className="text-sm text-primary-muted max-w-sm mx-auto leading-relaxed">
            The page you are looking for does not exist or has been relocated.
          </p>
          <div className="pt-4">
            <Button href="/" variant="primary" size="md">
              Return to Home
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
