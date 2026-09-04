import Image from "next/image";
import RevealOnScroll from "./RevealOnScroll";

const CATEGORIES = [
  "Trading cards",
  "Sports cards",
  "Toys & figures",
  "Comics",
  "Original art & artists",
  "Collectibles",
  "Pop culture & nostalgia",
];

/**
 * "Why attend" — a typographic manifest rather than an icon grid (Product
 * Rule 5), and deliberately not a repeat of the homepage's WhatIsNF: that
 * section is a hover-driven brand explainer with a contained photo slab;
 * this one is static, numbered like a show directory, and lets its photo
 * bleed full-height with the caption burned into the image itself so the
 * two sections don't share a silhouette.
 */
export default function ExpoWhyAttend() {
  return (
    <section
      aria-labelledby="why-attend-heading"
      className="nf-halftone relative overflow-hidden bg-brand py-16 text-paper md:py-24"
    >
      <RevealOnScroll className="relative mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid gap-10 md:grid-cols-12 md:gap-0">
          <div className="md:col-span-7 md:pr-12">
            <p className="nf-eyebrow text-xs text-gold-bright">
              Why attend Expo 2026
            </p>
            <h2
              id="why-attend-heading"
              className="nf-display mt-3 text-4xl md:text-5xl"
            >
              One roof, three days, everything you collect.
            </h2>

            <p className="nf-numeral tabular-nums mt-8 text-6xl text-gold-bright md:text-7xl">
              200+
            </p>
            <p className="mt-1 text-sm text-paper/85">
              vendor tables at Expo 2026: browse, buy, sell and trade
            </p>

            <ol className="mt-8 divide-y divide-white/15 border-t border-white/15">
              {CATEGORIES.map((category, i) => (
                <li
                  key={category}
                  className="nf-display flex items-baseline gap-4 py-3 text-xl md:text-2xl"
                >
                  <span
                    aria-hidden="true"
                    className="nf-numeral tabular-nums text-base text-gold-bright md:text-lg"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {category}
                </li>
              ))}
            </ol>
          </div>

          <div className="relative mt-6 min-h-[320px] overflow-hidden rounded-lg md:col-span-5 md:mt-0 md:min-h-full md:rounded-none md:rounded-r-lg">
            <Image
              src="/images/photos/hero-crowd.jpg"
              alt="Glass display cases of trading cards with a packed ballroom behind them at a previous Nostalgia Fest."
              fill
              sizes="(min-width: 768px) 32vw, 90vw"
              className="object-cover"
              style={{ objectPosition: "50% 68%" }}
              loading="lazy"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink/90 to-transparent"
            />
            <p className="absolute right-4 bottom-4 left-4 text-sm font-medium text-text-inverse">
              Previous Nostalgia Fest event · April 2026
            </p>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
