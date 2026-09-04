import RevealOnScroll from "./RevealOnScroll";
import TicketButton from "./TicketButton";
import { expo2026 } from "@/lib/events";

/** Final conversion — no countdown, no scarcity, just the facts and the CTA. */
export default function ExpoFinalCta() {
  return (
    <section
      aria-labelledby="expo-final-cta-heading"
      className="nf-halftone relative overflow-hidden bg-brand py-20 md:py-28"
    >
      <RevealOnScroll className="relative mx-auto max-w-3xl px-4 text-center text-paper md:px-6">
        <span aria-hidden="true" className="text-2xl text-gold-bright">
          ✦
        </span>
        <h2
          id="expo-final-cta-heading"
          className="nf-display mt-4 text-5xl md:text-7xl"
        >
          See you on the floor.
        </h2>
        <p className="tabular-nums mt-5 text-paper/85 md:text-lg">
          {expo2026.dateRange} · {expo2026.venue}, Mississauga
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
          <p className="flex items-center gap-2 text-base font-semibold text-gold-bright">
            <span aria-hidden="true" className="text-lg leading-none">✦</span>
            Free General Admission
          </p>
          <p className="text-sm text-paper/85">VIP upgrade available</p>
        </div>
        <div className="mt-8 flex justify-center">
          <TicketButton
            eventSlug="expo-2026"
            className="nf-action nf-action-gold px-7 py-3.5 text-base"
          >
            Get your tickets
            <span aria-hidden="true">→</span>
          </TicketButton>
        </div>
      </RevealOnScroll>
    </section>
  );
}
