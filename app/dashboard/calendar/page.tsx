import { Suspense } from "react";
import { CalendarPage } from "@/components/consumer/CalendarPage";
export default function Page() {
  return (
    <Suspense fallback={<p role="status">Loading calendar…</p>}>
      <CalendarPage />
    </Suspense>
  );
}
