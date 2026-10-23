import { ConsumerOnboarding } from "@/components/consumer/Onboarding";
export const metadata = {
  title: "Your preferences",
  robots: { index: false, follow: false },
};
export default function OnboardingPage() {
  return <ConsumerOnboarding />;
}
