import RevealOnScroll from "./RevealOnScroll";

const CATEGORIES = [
  "Trading cards",
  "Sports cards",
  "Toys and figures",
  "Comics",
  "Original art and artists",
  "Collectibles",
  "Pop culture and nostalgia",
];

/**
 * "What Nostalgia Fest is" — the one full-bleed solid brand-colour section
 * permitted per page (docs/visual-directions.md). Typographic rather than a
 * photo-tile grid: the asset library has no isolated product close-ups, and
 * tiles built from wide environmental crops would be illegible at tile size.
 *
 * The list is set as an indexed editorial run — a numbered inventory, the way
 * a collection is catalogued — so the brand surface carries composition and
 * rhythm instead of reading as a flat purple void.
 */
export default function CategoryBand() {
  return (
    <section
      id="category-band"
      aria-labelledby="category-band-heading"
      className="nf-halftone relative overflow-hidden bg-brand py-16 text-text-inverse md:py-28"
    >
      <RevealOnScroll className="relative mx-auto max-w-6xl px-4 md:px-6">
        <div className="md:grid md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            {/* pink-bright, not pink: at this size on the brand purple the
                softer pink measures 4.37 and misses AA. */}
            <p className="nf-eyebrow text-xs text-pink-bright">What it is</p>
            <h2
              id="category-band-heading"
              className="nf-display mt-4 text-5xl lg:text-6xl"
            >
              More than a card show
            </h2>
            <p className="mt-6 max-w-prose text-text-inverse-secondary md:text-lg">
              Nostalgia Fest brings together the people and things that made
              you who you are — one roof, one weekend.
            </p>
          </div>

          {/* Indexed category run. The numerals carry the collectible /
              catalogue reference; the rules give the field structure. */}
          <ul className="mt-12 md:col-span-7 md:mt-2">
            {CATEGORIES.map((category, index) => (
              <li
                key={category}
                className="flex items-baseline gap-4 border-t border-white/20 py-3 last:border-b md:gap-6 md:py-4"
              >
                <span
                  aria-hidden="true"
                  className="nf-numeral w-10 shrink-0 text-2xl text-pink md:w-14 md:text-3xl"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="nf-display text-2xl md:text-4xl">
                  {category}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </RevealOnScroll>
    </section>
  );
}
