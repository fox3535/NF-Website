import Image from "next/image";
import PhotoBadge from "./PhotoBadge";
import RevealOnScroll from "./RevealOnScroll";
import { expo2026 } from "@/lib/events";

/**
 * "What you'll find" — the marketplace module. Leads with the confirmed
 * 200+ tables fact and activity language rather than product close-ups,
 * which the asset audit found we don't have yet.
 */
export default function Marketplace() {
  return (
    <section
      aria-labelledby="marketplace-heading"
      className="bg-paper py-12 md:py-24"
    >
      <RevealOnScroll className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-[3fr_2fr] md:items-center md:gap-12">
          <div>
            <p className="nf-eyebrow text-xs text-brand">The floor</p>
            <h2
              id="marketplace-heading"
              className="nf-display mt-3 text-4xl text-text md:text-5xl"
            >
              What you&apos;ll find
            </h2>

            {/* The table count is the strongest confirmed fact on the page,
                so it is set as a display figure rather than body copy. */}
            <p className="nf-numeral mt-8 text-7xl text-brand md:text-8xl">
              200+
            </p>
            <p className="nf-eyebrow mt-2 text-xs text-text-secondary">
              vendor tables at Expo 2026
            </p>

            <div aria-hidden="true" className="nf-perforation my-6 text-brand" />

            <p className="max-w-prose text-text-secondary md:text-lg">
              Browse, buy, sell and trade with vendors. Meet artists. Find
              toys, figures, comics and collectibles from dealers who know
              their stuff.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="relative aspect-4/5 overflow-hidden rounded-lg outline outline-black/10">
              <Image
                src="/images/photos/deal-cassy.jpg"
                alt="A vendor showing a binder of trading cards to a customer at their table."
                fill
                sizes="(min-width: 768px) 20vw, 45vw"
                className="object-cover"
                loading="lazy"
              />
              <PhotoBadge className="text-[10px]" />
            </div>
            <div className="relative aspect-4/5 overflow-hidden rounded-lg outline outline-black/10">
              <Image
                src="/images/photos/artists-marvin.jpg"
                alt="An artist showing original artwork to a visitor at a previous Nostalgia Fest artist-alley table."
                fill
                sizes="(min-width: 768px) 20vw, 45vw"
                className="object-cover"
                style={{ objectPosition: "40% 40%" }}
                loading="lazy"
              />
              <PhotoBadge className="text-[10px]" />
            </div>
          </div>
        </div>
        <p className="mt-6 text-xs text-text-secondary">
          Table count reflects {expo2026.name} positioning and is not a
          permanent Nostalgia Fest brand claim.
        </p>
      </RevealOnScroll>
    </section>
  );
}
