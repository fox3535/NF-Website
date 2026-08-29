import RevealOnScroll from "./RevealOnScroll";
import TicketCtaCluster from "./TicketCtaCluster";
import { expo2026 } from "@/lib/events";

export default function FinalCta() {
  return (
    <section
      id="final-cta"
      aria-labelledby="final-cta-heading"
      className="nf-halftone relative overflow-hidden bg-ink py-20 md:py-28"
    >
      <RevealOnScroll className="relative mx-auto max-w-3xl px-4 text-center text-text-inverse md:px-6">
        <span
          aria-hidden="true"
          className="text-2xl text-gold-bright"
        >
          ✦
        </span>
        <h2
          id="final-cta-heading"
          className="nf-display mt-4 text-5xl md:text-7xl"
        >
          Don&apos;t miss {expo2026.name}
        </h2>
        <p className="tabular-nums mt-5 text-text-inverse-secondary md:text-lg">
          {expo2026.dateRange} · {expo2026.venue}, Mississauga
        </p>
        <p className="mt-3 flex items-center justify-center gap-2 text-base font-semibold text-gold-bright">
          <span aria-hidden="true" className="text-lg leading-none">
            ✦
          </span>
          Free admission
        </p>
        <div className="mt-6 flex justify-center">
          <TicketCtaCluster surface="ink" />
        </div>
      </RevealOnScroll>
    </section>
  );
}
