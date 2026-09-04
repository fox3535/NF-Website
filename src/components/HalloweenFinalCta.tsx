import RevealOnScroll from "./RevealOnScroll";
import TicketButton from "./TicketButton";
import { halloween2026 } from "@/lib/events";

/**
 * Final conversion. Closes dark and orange rather than Expo's bright
 * purple, a deliberate structural difference, not just a colour swap, so
 * the two pages don't end the same way. No countdown, no scarcity.
 *
 * SIGNATURE MOMENT 5 — the house lights. A ticket tear across the top
 * edge, then one warm glow breathing directly behind the action and a slow
 * wash over the section. The glow sits behind the button rather than on
 * it, so the control keeps its flat printed fill and its focus ring.
 */
export default function HalloweenFinalCta() {
  return (
    <section
      aria-labelledby="halloween-final-cta-heading"
      className="nf-halftone relative overflow-hidden bg-ink py-20 md:py-28"
    >
      {/* Tear line onto the FAQ's paper surface directly above. */}
      <div
        aria-hidden="true"
        className="nf-notch absolute inset-x-0 top-0 z-10"
        style={{ ["--nf-notch-color" as string]: "var(--color-paper)" }}
      />
      <div
        aria-hidden="true"
        className="nf-lightfield inset-[-15%]"
        style={{
          background:
            "radial-gradient(52% 50% at 50% 34%, rgb(255 138 61 / 22%) 0%, transparent 72%)",
        }}
      />
      <div aria-hidden="true" className="nf-sweep" />
      <div aria-hidden="true" className="nf-grain" />

      <RevealOnScroll className="relative mx-auto max-w-3xl px-4 text-center md:px-6">
        <span aria-hidden="true" className="text-2xl text-halloween">
          ✦
        </span>
        <h2
          id="halloween-final-cta-heading"
          className="nf-display mt-4 text-5xl text-text-inverse md:text-7xl"
        >
          Suit up. See you there.
        </h2>
        <p className="tabular-nums mt-5 text-text-inverse-secondary md:text-lg">
          {halloween2026.dateRange} · {halloween2026.venue}
        </p>
        <p className="mt-3 flex items-center justify-center gap-2 text-base font-semibold text-gold-bright">
          <span aria-hidden="true" className="text-lg leading-none">✦</span>
          Free General Admission
        </p>

        <div className="relative mt-8 flex justify-center">
          <span
            aria-hidden="true"
            className="nf-glow top-1/2 left-1/2 h-48 w-80 -translate-x-1/2 -translate-y-1/2"
          />
          <TicketButton
            eventSlug="halloween-2026"
            className="nf-action nf-action-halloween relative px-7 py-3.5 text-base"
          >
            Get your tickets
            <span aria-hidden="true">→</span>
          </TicketButton>
        </div>
      </RevealOnScroll>
    </section>
  );
}
