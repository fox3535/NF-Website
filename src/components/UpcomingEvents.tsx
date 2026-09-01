"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import ShowTag from "./ShowTag";
import { upcomingEvents } from "@/lib/events";
import { centreOffset, scrollTrackTo } from "@/lib/scroll";

/**
 * One reusable chronological events carousel, replacing the old
 * Featured Expo + More Events pair.
 *
 * Events come straight from src/lib/events.ts in chronological order, so
 * adding a show is a data change. Each card renders only the fields that
 * exist on its record — Halloween has no confirmed hours, so no hours row
 * appears rather than a placeholder.
 *
 * Right always advances toward the next event chronologically.
 */
export default function UpcomingEvents() {
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLUListElement>(null);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const count = upcomingEvents.length;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!best) return;
        const i = cardRefs.current.indexOf(best.target as HTMLLIElement);
        if (i >= 0) setActive(i);
      },
      { root: track, threshold: [0.6, 0.9] }
    );
    cardRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const go = useCallback((i: number) => {
    const track = trackRef.current;
    const next = Math.max(0, Math.min(i, upcomingEvents.length - 1));
    const card = cardRefs.current[next];
    if (!track || !card) return;
    // Set optimistically so the arrows enable/disable immediately; the
    // observer confirms it once the scroll settles.
    setActive(next);
    scrollTrackTo(track, centreOffset(track, card));
  }, []);

  return (
    <section
      id="upcoming-events"
      aria-labelledby="upcoming-events-heading"
      aria-roledescription="carousel"
      className="bg-brand-soft py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="nf-eyebrow text-xs text-brand">Next on the floor</p>
            <h2
              id="upcoming-events-heading"
              className="nf-display mt-3 text-4xl text-text md:text-5xl"
            >
              Upcoming Nostalgia Fest Events
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => go(active - 1)}
              disabled={active === 0}
              aria-label="Previous event"
              className="nf-action nf-action-outline h-11 w-11 rounded-full text-text disabled:opacity-35"
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              onClick={() => go(active + 1)}
              disabled={active === count - 1}
              aria-label="Next event"
              className="nf-action nf-action-outline h-11 w-11 rounded-full text-text disabled:opacity-35"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        <ul
          ref={trackRef}
          className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] md:gap-6 [&::-webkit-scrollbar]:hidden"
        >
          {upcomingEvents.map((event, i) => (
            <li
              key={event.slug}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="w-[86%] shrink-0 snap-center sm:w-[62%] md:w-[48%]"
            >
              <article
                className={`nf-halftone nf-foil relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-ink p-6 text-paper md:p-8 ${event.theme.surface} ${event.theme.shadow}`}
              >
                <div className="relative flex flex-wrap items-center gap-2">
                  <ShowTag label={event.shortName} />
                  {event.isNext && (
                    <span className={`nf-stamp ${event.theme.accent}`}>
                      Next up
                    </span>
                  )}
                </div>

                <h3 className="nf-display relative mt-5 text-3xl md:text-4xl">
                  {event.name}
                </h3>

                {/* Display size, so the accent clears the large-text bar. */}
                <p
                  className={`nf-display tabular-nums relative mt-3 text-2xl md:text-3xl ${event.theme.accent}`}
                >
                  {event.dateRange}
                </p>

                <p className="relative mt-2 text-sm text-paper/85">
                  {event.venue}
                </p>

                {event.hours && (
                  <dl className="tabular-nums relative mt-4 space-y-1 text-sm text-paper/85">
                    {event.hours.map((row) => (
                      <div key={row.day} className="flex justify-between gap-4">
                        <dt>{row.day}</dt>
                        <dd className="font-medium text-paper">{row.hours}</dd>
                      </div>
                    ))}
                  </dl>
                )}

                <div
                  aria-hidden="true"
                  className="nf-perforation relative my-6 text-paper"
                />

                {/* Paper, not the accent: gold measures 3.61 on the canonical
                    purple, which is fine for the display date above but under
                    the bar for text this size. */}
                <p className="relative flex items-center gap-2 text-sm font-semibold text-paper">
                  <span aria-hidden="true" className={event.theme.accent}>
                    ✦
                  </span>
                  {event.admissionLabel}
                </p>

                <Link
                  href={event.href}
                  className="nf-action nf-action-gold relative mt-auto w-fit px-5 py-3 text-sm"
                >
                  View event
                  <span aria-hidden="true">→</span>
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
