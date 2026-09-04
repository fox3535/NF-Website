import AddToCalendarButton from "./AddToCalendarButton";
import RevealOnScroll from "./RevealOnScroll";
import { halloween2026 } from "@/lib/events";
import { HALLOWEEN_2026_ICS } from "@/lib/ics";

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent(halloween2026.venue);

const outlineButton = "nf-action nf-action-outline px-5 py-3 text-sm text-text";
const filledButton = "nf-action nf-action-halloween px-6 py-3 text-base";

/**
 * Plan Your Visit. Hours aren't confirmed yet for Halloween
 * (docs/event-data.md), so unlike Expo's version this has no hours table:
 * it says what's confirmed (the two dates and the venue) and nothing more.
 */
export default function HalloweenPlanYourVisit() {
  return (
    <section
      id="plan-your-visit"
      aria-labelledby="plan-your-visit-heading"
      className="bg-brand-soft py-14 md:py-20"
    >
      <RevealOnScroll className="mx-auto max-w-6xl px-4 md:px-6">
        <p className="nf-eyebrow text-xs text-brand">Plan your visit</p>
        <h2
          id="plan-your-visit-heading"
          className="nf-display mt-3 text-4xl text-text md:text-5xl"
        >
          Getting to Nostalgia Fest Halloween
        </h2>

        <div className="nf-case mt-10 max-w-2xl">
          <div className="nf-case-label text-text-secondary">
            <span>{halloween2026.venue}</span>
            <span className="text-brand">{halloween2026.dateRange}</span>
          </div>
          <div className="flex flex-col gap-4 rounded-lg bg-white p-6 md:p-8">
            <p className="nf-display text-2xl text-text">
              {halloween2026.venue}
            </p>
            <p className="text-text-secondary">
              Exact hours will be announced closer to the show.
            </p>
            <p className="flex items-center gap-2 text-base font-semibold text-gold">
              <span aria-hidden="true" className="text-lg leading-none">✦</span>
              Free General Admission
            </p>

            <div className="mt-2 flex flex-wrap gap-3">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={outlineButton}
              >
                Get directions
              </a>
              <AddToCalendarButton
                event={HALLOWEEN_2026_ICS}
                filename="nostalgia-fest-halloween-2026.ics"
                className={filledButton}
              />
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
