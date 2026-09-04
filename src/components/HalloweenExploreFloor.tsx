import Image from "next/image";
import RevealOnScroll from "./RevealOnScroll";

/**
 * Explore the floor: Halloween is a costume show layered on top of a full
 * Nostalgia Fest marketplace, not a costume event that happens to sell
 * cards on the side.
 *
 * This section also absorbs the marketplace half of the old "What makes
 * this show different" band, which was removed: its category list was the
 * only thing on it the rest of the page didn't already say, and it belongs
 * next to the floor photography rather than in a section of its own.
 *
 * The index is set as ruled type rather than chips or cards, so the page
 * isn't one rounded rectangle after another. Photography is previous-event
 * social proof, labelled as such (Product Rule 4).
 */
const CATEGORIES = [
  "Trading cards",
  "Sports cards",
  "Toys and figures",
  "Collectibles",
  "Original art and artists",
  "Pop culture and nostalgia",
];

export default function HalloweenExploreFloor() {
  return (
    <section
      aria-labelledby="explore-floor-heading"
      className="bg-paper-strong py-16 md:py-24"
    >
      <RevealOnScroll className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid gap-10 md:grid-cols-12 md:items-end md:gap-12">
          <div className="md:col-span-5">
            <p className="nf-eyebrow text-xs text-brand">Explore the floor</p>
            <h2
              id="explore-floor-heading"
              className="nf-display mt-3 text-4xl text-text md:text-5xl"
            >
              Still the full NF marketplace
            </h2>
            <p className="mt-4 max-w-prose text-text-secondary md:text-lg">
              Costumes are the theme, not the whole show. The same floor of
              vendors, artists and collectors you&apos;d find at any
              Nostalgia Fest is here too.
            </p>
          </div>

          <div className="md:col-span-7">
            <figure className="nf-case nf-foil flex flex-col">
              <div className="nf-case-label text-text-secondary">
                <span>Previous Nostalgia Fest event</span>
                <span className="text-brand">April 2026</span>
              </div>
              <div className="relative aspect-16/9 overflow-hidden rounded-lg outline outline-black/10">
                <Image
                  src="/images/photos/family-artist-alley.jpg"
                  alt="A family browsing a table of plush toys and collectibles beneath a grand staircase at a previous Nostalgia Fest."
                  fill
                  sizes="(min-width: 768px) 55vw, 92vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            </figure>
          </div>
        </div>

        {/* The index. Ruled rows with oversized numerals, the way a floor
            guide or a contents page is set. */}
        <ol className="mt-12 grid border-t border-ink/15 md:mt-16 md:grid-cols-3">
          {CATEGORIES.map((category, i) => (
            <li
              key={category}
              className="flex items-baseline gap-4 border-b border-ink/15 py-4 md:px-5 md:border-r md:[&:nth-child(3n)]:border-r-0 md:[&:nth-child(3n+1)]:pl-0"
            >
              <span
                aria-hidden="true"
                className="nf-numeral text-2xl text-brand/55"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="nf-display text-xl text-text md:text-2xl">
                {category}
              </span>
            </li>
          ))}
        </ol>
      </RevealOnScroll>
    </section>
  );
}
