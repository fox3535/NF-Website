import Image from "next/image";
import RevealOnScroll from "./RevealOnScroll";

/**
 * "Explore the floor" — a dense photo wall rather than a text column beside
 * two images. 200+ tables is used here explicitly as an Expo 2026 claim
 * (see docs/event-data.md), not a standing Nostalgia Fest brand number.
 * Photography is previous-event social proof, labelled as such per each
 * tile (Product Rule 4).
 */
export default function ExpoExploreFloor() {
  return (
    <section
      aria-labelledby="explore-floor-heading"
      className="bg-paper-strong py-12 md:py-16"
    >
      <RevealOnScroll className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-2 md:gap-4">
          <div className="nf-halftone relative col-span-2 flex flex-col justify-center overflow-hidden rounded-lg bg-ink p-6 text-paper md:col-span-2 md:row-span-2 md:p-10">
            <p className="nf-eyebrow relative text-xs text-pink">
              Explore the floor
            </p>
            <h2
              id="explore-floor-heading"
              className="nf-display relative mt-3 text-3xl md:text-4xl"
            >
              200+ vendor tables at Expo 2026
            </h2>
            <p className="relative mt-4 text-sm text-paper/85 md:text-base">
              Browse, buy, sell and trade with vendors who know their stuff.
              Meet artists working the room in person. Find toys, figures,
              comics and collectibles alongside the trading-card tables.
              This is an Expo-specific scale, not a claim about every
              Nostalgia Fest show.
            </p>
          </div>

          <figure className="relative col-span-2 aspect-3/2 overflow-hidden rounded-lg outline outline-black/10 md:col-span-2 md:aspect-auto">
            <Image
              src="/images/photos/scale-crowd.jpg"
              alt="A wide view of a packed ballroom aisle lined with vendor tables and chandeliers."
              fill
              sizes="(min-width: 768px) 45vw, 90vw"
              className="object-cover"
              loading="lazy"
            />
            <figcaption className="pointer-events-none absolute bottom-2 left-2 rounded bg-ink/85 px-2 py-1 text-[10px] font-medium text-text-inverse">
              Previous NF event · April 2026
            </figcaption>
          </figure>

          <figure className="relative aspect-square overflow-hidden rounded-lg outline outline-black/10">
            <Image
              src="/images/photos/marketplace-deal.jpg"
              alt="Two attendees shaking hands over a binder of graded trading cards on a vendor table."
              fill
              sizes="(min-width: 768px) 22vw, 45vw"
              className="object-cover"
              loading="lazy"
            />
            <figcaption className="pointer-events-none absolute bottom-2 left-2 rounded bg-ink/85 px-1.5 py-0.5 text-[9px] font-medium text-text-inverse">
              Previous NF event
            </figcaption>
          </figure>

          <figure className="relative aspect-square overflow-hidden rounded-lg outline outline-black/10">
            <Image
              src="/images/photos/deal-cassy.jpg"
              alt="A vendor showing a binder of trading cards to a customer at their table."
              fill
              sizes="(min-width: 768px) 22vw, 45vw"
              className="object-cover"
              loading="lazy"
            />
            <figcaption className="pointer-events-none absolute bottom-2 left-2 rounded bg-ink/85 px-1.5 py-0.5 text-[9px] font-medium text-text-inverse">
              Previous NF event
            </figcaption>
          </figure>
        </div>
      </RevealOnScroll>
    </section>
  );
}
