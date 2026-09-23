import { Hero } from "@/components/landing/Hero";
import { TrustStrip } from "@/components/landing/TrustStrip";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { BlueprintFeatures } from "@/components/landing/BlueprintFeatures";
import { Personalization } from "@/components/landing/Personalization";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { NativeMobileRedirect } from "@/components/landing/NativeMobileRedirect";

export default function HomePage() {
  return (
    <>
      <NativeMobileRedirect />
      <Hero />
      <TrustStrip />
      <HowItWorks />
      <BlueprintFeatures />
      <Personalization />
      <FinalCTA />
    </>
  );
}
