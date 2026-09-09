import AddToCalendarButton from "./AddToCalendarButton";
import RevealOnScroll from "./RevealOnScroll";
import { halloween2026 } from "@/lib/events";
import { HALLOWEEN_2026_ICS } from "@/lib/ics";

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent(halloween2026.address ?? halloween2026.venue);

const outlineButton = "nf-action nf-action-outline px-5 py-3 text-sm text-text";
const filledButton = "nf-action nf-action-halloween px-6 py-3 text-base";

/**
 * Plan Your Visit. Hours aren't confirmed yet for Halloween
 * (docs/event-data.md), so unlike Expo's version this has no hours table:
 * it says what's confirmed (the two dates and the venue) and nothing more.
 *
 * That difference is exactly why this could not keep Expo's composition. A
 * full-width heading over a half-width card left roughly four hundred pixels
 * of empty lavender on the trailing side at desktop, so the section read as
 * misaligned rather than airy. Expo's version fills that width honestly
 * because it has an hours table to put there; this one does not, and the
 * fix for a short section is composition, not invented content.
 *
 * So it is now a deliberately centred column: a narrower container, the
 * heading centred over the card, and the card centred inside that. The
 * shared NF cues (eyebrow, display heading, slab frame, perforation, the
 * same two actions) keep it in the same family as Expo's without pretending
 * to have Expo's content. The venue name is also no longer printed three
 * times inside one card.
 */
export default function HalloweenPlanYourVisit() {
  return (
    <section
      id="plan-your-visit"
      aria-labelledby="plan-your-visit-heading"
      className="relative overflow-hidden bg-brand-soft py-16 md:py-24"
    >
      <div aria-hidden="true" className="nf-warmlight" />

      <RevealOnScroll className="relative mx-auto max-w-3xl px-4 text-center md:px-6">
        <p className="nf-eyebrow text-xs text-brand">Plan your visit</p>
        <h2
          id="plan-your-visit-heading"
          className="nf-display mt-3 text-4xl text-text md:text-5xl"
        >
          Getting to Nostalgia Fest Halloween
        </h2>

        <div className="nf-case mx-auto mt-10 max-w-xl text-left">
          <div className="nf-case-label text-text-secondary">
            <span>Venue</span>
            <span className="tabular-nums text-brand">
              Oct 31 &amp; Nov 1
            </span>
          </div>

          <div className="flex flex-col items-center gap-4 rounded-lg bg-white px-6 py-8 text-center md:px-8 md:py-10">
            <p className="nf-display text-3xl text-text md:text-4xl">
              {halloween2026.venue}
            </p>
            <p className="text-text-secondary">{halloween2026.address}</p>

            <div
              aria-hidden="true"
              className="nf-perforation my-1 w-full max-w-xs text-ink"
            />

            <p className="text-text-secondary">
              Exact hours will be announced closer to the show.
            </p>
            <p className="flex items-center gap-2 text-base font-semibold text-gold">
              <span aria-hidden="true" className="text-lg leading-none">✦</span>
              Free General Admission
            </p>

            <div className="mt-2 flex flex-wrap justify-center gap-3">
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
