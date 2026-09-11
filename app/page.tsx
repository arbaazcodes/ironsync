import { Hero } from "@/components/landing/Hero";
import { TrustStrip } from "@/components/landing/TrustStrip";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { BlueprintFeatures } from "@/components/landing/BlueprintFeatures";
import { Personalization } from "@/components/landing/Personalization";
import { FinalCTA } from "@/components/landing/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <HowItWorks />
      <BlueprintFeatures />
      <Personalization />
      <FinalCTA />
    </>
  );
}
