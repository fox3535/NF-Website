import AddToCalendarButton from "./AddToCalendarButton";
import RevealOnScroll from "./RevealOnScroll";
import { expo2026 } from "@/lib/events";

// Directions is the primary action of this section — its job is getting a
// registered visitor to the door. The ticket CTA lives in the featured-event
// module directly above and in the final CTA below; repeating it here made
// the two adjacent sections read as duplicates.
const outlineButton = "nf-action nf-action-outline px-5 py-3 text-sm text-text-secondary";
const filledButton = "nf-action nf-action-filled px-6 py-3 text-base";

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent(expo2026.address ?? expo2026.venue);

/**
 * Plan Your Visit — promoted above its conventional near-FAQ position, per
 * the locked principle that logistics are conversion content for a free
 * event (docs/conversion.md, docs/homepage-concept.md section 9).
 * Parking and transit are deliberately absent: not documented in
 * docs/event-data.md.
 */
export default function PlanYourVisit() {
  return (
    <section
      id="plan-your-visit"
      aria-labelledby="plan-your-visit-heading"
      className="bg-paper py-12 md:py-24"
    >
      <RevealOnScroll className="mx-auto max-w-6xl px-4 md:px-6">
        <p className="nf-eyebrow text-xs text-brand">Getting there</p>
        <h2
          id="plan-your-visit-heading"
          className="nf-display mt-3 text-4xl text-text md:text-5xl"
        >
          Plan your visit
        </h2>

        <div className="mt-8 grid gap-8 rounded-2xl border-2 border-ink bg-white p-6 md:grid-cols-[1fr_1fr] md:gap-12 md:p-10">
          <div>
            <h3 className="nf-eyebrow text-xs text-text-secondary">Hours</h3>
            <dl className="tabular-nums mt-4 space-y-2">
              {expo2026.hours?.map((row) => (
                <div
                  key={row.day}
                  className="flex items-baseline justify-between gap-4 border-b border-border pb-2 last:border-none"
                >
                  <dt className="text-text">{row.day}</dt>
                  <dd className="nf-display text-xl text-text">{row.hours}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h3 className="nf-eyebrow text-xs text-text-secondary">Venue</h3>
            <p className="mt-4 text-lg font-semibold text-text">
              {expo2026.venue}
            </p>
            <p className="mt-1 text-text-secondary">{expo2026.address}</p>

            <p className="mt-4 flex items-center gap-2 text-base font-semibold text-gold">
              <span aria-hidden="true" className="text-lg leading-none">
                ✦
              </span>
              Free admission
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={filledButton}
              >
                Get directions
                <span aria-hidden="true">→</span>
              </a>
              <AddToCalendarButton className={outlineButton} />
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
