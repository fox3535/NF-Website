import AddToCalendarButton from "./AddToCalendarButton";
import RevealOnScroll from "./RevealOnScroll";
import { expo2026 } from "@/lib/events";
import { EXPO_2026_ICS } from "@/lib/ics";

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent(expo2026.address ?? expo2026.venue);

const outlineButton = "nf-action nf-action-outline px-5 py-3 text-sm text-text";
const filledButton = "nf-action nf-action-filled px-6 py-3 text-base";

/**
 * Plan Your Visit — the full logistics that were removed from the homepage
 * live here. A schedule strip (not a plain table) plus a boarding-pass-style
 * venue stub, so the section reads as designed rather than decorative.
 * Parking and transit stay out: not documented in docs/event-data.md.
 */
export default function ExpoPlanYourVisit() {
  return (
    <section
      id="plan-your-visit"
      aria-labelledby="plan-your-visit-heading"
      className="bg-brand-soft py-12 md:py-16"
    >
      <RevealOnScroll className="mx-auto max-w-6xl px-4 md:px-6">
        <p className="nf-eyebrow text-xs text-brand">Plan your visit</p>
        <h2
          id="plan-your-visit-heading"
          className="nf-display mt-3 text-4xl text-text md:text-5xl"
        >
          Getting to Expo 2026
        </h2>

        <div className="nf-case mt-10">
          <div className="nf-case-label text-text-secondary">
            <span>{expo2026.venue}</span>
            <span className="text-brand">Oct 9 to 11, 2026</span>
          </div>

          <div className="grid rounded-lg bg-white md:grid-cols-[3fr_2fr]">
            <dl className="tabular-nums divide-y divide-border p-6 md:p-8">
              {expo2026.hours?.map((row, i) => (
                <div
                  key={row.day}
                  className="flex items-baseline justify-between gap-4 py-3 first:pt-0 last:pb-0"
                >
                  <dt className="flex items-baseline gap-3 text-text">
                    <span className="nf-numeral text-sm text-brand">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {row.day}
                  </dt>
                  <dd className="nf-display text-xl text-text md:text-2xl">
                    {row.hours}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="relative flex flex-col gap-4 border-t border-border p-6 md:border-t-0 md:border-l md:border-dashed md:border-ink/30 md:p-8">
              <p className="nf-eyebrow text-xs text-text-secondary">Venue</p>
              <p className="nf-display text-2xl text-text">
                {expo2026.venue}
              </p>
              <p className="text-text-secondary">{expo2026.address}</p>

              <p className="flex items-center gap-2 text-base font-semibold text-gold">
                <span aria-hidden="true" className="text-lg leading-none">✦</span>
                Free General Admission
              </p>

              <div className="mt-auto flex flex-wrap gap-3 pt-4">
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={outlineButton}
                >
                  Get directions
                </a>
                <AddToCalendarButton
                  event={EXPO_2026_ICS}
                  filename="nostalgia-fest-expo-2026.ics"
                  className={filledButton}
                />
              </div>
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
