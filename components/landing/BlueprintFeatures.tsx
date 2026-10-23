import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { Check, Dumbbell, History, Timer } from "lucide-react";

const features = [
  {
    icon: Dumbbell, title: "Log what you actually do.",
    description: "Choose your exercises and record the weight and reps for each set as you train.",
    details: ["Use kilograms or pounds", "Add sets and exercises during a session", "Mark sets complete or undo a check"],
  },
  {
    icon: Timer, title: "Stay with your session.",
    description: "Take a break between sets and return to the workout you started.",
    details: ["A rest timer after completed sets", "Your set values survive a refresh", "A clear status when cloud saving is pending"],
  },
  {
    icon: History, title: "Keep a record of your effort.",
    description: "Finish a session and look back at what you lifted when you plan your next workout.",
    details: ["Completed exercises, weights, and reps", "Session totals for sets and lifting volume", "Recent workouts saved to your account"],
  },
];

export function BlueprintFeatures() {
  return (
    <section id="features" className="py-20 sm:py-28 bg-background-subtle border-y border-border scroll-mt-24">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <Badge variant="accent" size="md">WORKOUT TOOLS</Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Less remembering.<br />More training.</h2>
          <p className="text-base sm:text-lg text-primary-muted leading-relaxed">The details of your workout belong in your log. Keep them close, from your warm-up to your final set.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-8">
          {features.map(({ icon: Icon, title, description, details }) => (
            <article key={title} className="min-w-0 rounded-2xl border border-border bg-card p-5 sm:p-7">
              <Icon className="h-6 w-6 text-accent mb-6" aria-hidden="true" />
              <h3 className="text-xl font-bold tracking-tight">{title}</h3>
              <p className="mt-3 text-sm text-primary-muted leading-relaxed">{description}</p>
              <ul className="mt-6 space-y-3 text-sm">
                {details.map(detail => <li key={detail} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" /><span>{detail}</span></li>)}
              </ul>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
