"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import RevealOnScroll from "./RevealOnScroll";
import { scrollTrackTo, startOffset } from "@/lib/scroll";

/**
 * Cards per view at the md breakpoint and up — matches the md:w-[...] card
 * width below exactly (3 cards + 2 gaps = 100% of the track), so the
 * desktop rail always shows complete cards, never a partially clipped one.
 * Below md, a single card leads with a deliberate peek of the next.
 */
const DESKTOP_CARDS_PER_VIEW = 3;

/**
 * "Blast From the Past" — the visual record of previous events.
 *
 * Provenance travels with every image (Product Rule 4) via the slab label,
 * so the section reads as an archive of the community rather than a photo
 * dump with a disclaimer attached.
 *
 * A browsable rail rather than a fixed grid, so the section is not capped at
 * three photos — adding a fourth real shot later is a data change. Two
 * honest placeholder slots demonstrate that headroom now without faking
 * event photography: no stock image stands in for a real one.
 */
interface Shot {
  id: string;
  /** Absent for a not-yet-populated slot — renders a branded panel instead. */
  photo?: { src: string; alt: string };
  caption: string;
  stamp: string;
}

const SHOTS: Shot[] = [
  {
    id: "floor",
    photo: {
      src: "/images/photos/scale-crowd.jpg",
      alt: "A wide view of a packed ballroom aisle lined with vendor tables and chandeliers.",
    },
    caption: "The floor, wall to wall",
    stamp: "April 2026",
  },
  {
    id: "deal",
    photo: {
      src: "/images/photos/marketplace-deal.jpg",
      alt: "Two attendees shaking hands over a binder of graded trading cards on a vendor table.",
    },
    caption: "A deal, done the old way",
    stamp: "April 2026",
  },
  {
    id: "family",
    photo: {
      src: "/images/photos/family-artist-alley.jpg",
      alt: "A family browsing a table of plush toys and collectibles beneath a grand staircase.",
    },
    caption: "Everyone finds their table",
    stamp: "April 2026",
  },
  {
    id: "more-1",
    caption: "More from the archive",
    stamp: "Coming soon",
  },
  {
    id: "more-2",
    caption: "More from the archive",
    stamp: "Coming soon",
  },
];

export default function InsideNF() {
  const [active, setActive] = useState(0);
  // Below md the rail advances one card (with a deliberate peek) at a time;
  // at md and up it advances by a full, complete row — see
  // DESKTOP_CARDS_PER_VIEW and the card width below, which are sized to match.
  const [cardsPerView, setCardsPerView] = useState(1);
  const trackRef = useRef<HTMLUListElement>(null);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const count = SHOTS.length;

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const update = () =>
      setCardsPerView(query.matches ? DESKTOP_CARDS_PER_VIEW : 1);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

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

  // Steps by a full row rather than one card, so the next arrow always
  // lands on a clean group boundary instead of shifting by a fraction of a
  // row. Aligns the landing card flush to the track's leading edge (not
  // centred), which is what keeps every card in view whole.
  const go = useCallback(
    (direction: 1 | -1) => {
      const track = trackRef.current;
      const next = Math.max(
        0,
        Math.min(active + direction * cardsPerView, count - 1)
      );
      const card = cardRefs.current[next];
      if (!track || !card) return;
      setActive(next);
      scrollTrackTo(track, startOffset(track, card));
    },
    [active, cardsPerView, count]
  );

  const atEnd = active + cardsPerView >= count;

  return (
    <section
      id="blast-from-the-past"
      aria-labelledby="blast-from-the-past-heading"
      className="bg-paper py-16 md:py-24"
    >
      <RevealOnScroll className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="nf-eyebrow text-xs text-brand">
              Previous Nostalgia Fest events
            </p>
            <h2
              id="blast-from-the-past-heading"
              className="nf-display mt-3 text-4xl text-text md:text-5xl"
            >
              Blast From the Past
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              disabled={active === 0}
              aria-label="Previous photo"
              className="nf-action nf-action-outline h-11 w-11 rounded-full text-text disabled:opacity-35"
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              disabled={atEnd}
              aria-label="Next photo"
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
          {SHOTS.map((shot, i) => (
            <li
              key={shot.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="w-[82%] shrink-0 snap-start sm:w-[58%] md:w-[calc((100%-3rem)/3)]"
            >
              <figure className="nf-case nf-foil flex h-full flex-col">
                <div className="nf-case-label text-text-secondary">
                  <span>Nostalgia Fest</span>
                  <span className="text-brand">{shot.stamp}</span>
                </div>

                {shot.photo ? (
                  <div className="relative aspect-4/5 flex-1 overflow-hidden rounded-lg outline outline-black/10">
                    <Image
                      src={shot.photo.src}
                      alt={shot.photo.alt}
                      fill
                      sizes="(min-width: 768px) 38vw, 82vw"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="nf-halftone relative flex aspect-4/5 flex-1 flex-col items-center justify-center gap-3 overflow-hidden rounded-lg bg-brand-deep text-center">
                    <span aria-hidden="true" className="text-3xl text-gold-bright">
                      ✦
                    </span>
                    <span className="nf-stamp text-pink-bright">
                      More photos coming
                    </span>
                  </div>
                )}

                <figcaption className="nf-display px-1 pt-3 pb-1 text-lg text-text">
                  {shot.caption}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </RevealOnScroll>
    </section>
  );
}
