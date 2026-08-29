import Link from "next/link";
import type { NFEvent } from "@/lib/events";

/**
 * Reusable event card. Fully typographic — no photography and no key art.
 *
 * No key art keeps the module from becoming a wall of flyers
 * (docs/homepage-concept.md section 8) and avoids publishing the promotional
 * banner's unconfirmed claims. No photography because the only images that
 * fit here were already carrying the hero and the proof sections, and a
 * third appearance of the same ballroom made the page feel thin.
 *
 * The date is the card's display element, treated like the stamped date on a
 * ticket stub, so a scanning visitor gets the fact they came for first.
 */
export default function EventCard({ event }: { event: NFEvent }) {
  const shortLabel = event.name.replace("Nostalgia Fest ", "");

  return (
    <article className="nf-halftone relative flex flex-col overflow-hidden rounded-2xl border-2 border-ink bg-brand p-6 text-text-inverse md:p-8">
      <div className="relative flex items-start justify-between gap-4">
        {/* pink-bright, not pink: small text on the brand purple. */}
        <p className="nf-eyebrow text-[11px] text-pink-bright">
          {event.venue}
        </p>
        {event.isNext && (
          <span className="nf-eyebrow shrink-0 rounded-md bg-gold-bright px-2 py-1 text-[10px] text-ink">
            Next event
          </span>
        )}
      </div>

      <h3 className="nf-display relative mt-4 text-3xl md:text-4xl">
        {event.name}
      </h3>

      <p className="nf-display tabular-nums relative mt-3 text-2xl text-gold-bright md:text-3xl">
        {event.dateRange}
      </p>

      {event.hours && (
        <dl className="tabular-nums relative mt-4 space-y-1 text-sm text-text-inverse-secondary">
          {event.hours.map((row) => (
            <div key={row.day} className="flex justify-between gap-4">
              <dt>{row.day}</dt>
              <dd className="font-medium text-text-inverse">{row.hours}</dd>
            </div>
          ))}
        </dl>
      )}

      <div aria-hidden="true" className="nf-perforation relative my-6 text-pink" />

      <p className="relative flex items-center gap-2 text-sm font-semibold text-gold-bright">
        <span aria-hidden="true" className="leading-none">
          ✦
        </span>
        {event.admissionLabel}
      </p>

      <Link
        href={event.href}
        className="nf-action nf-action-outline relative mt-6 w-fit px-5 py-2.5 text-sm text-text-inverse"
      >
        See the {shortLabel} details
        <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}
