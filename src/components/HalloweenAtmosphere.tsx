import Image from "next/image";
import RevealOnScroll from "./RevealOnScroll";

/**
 * The mood section: come as you are, dressed up or not. Distinct from
 * Cosplay Competition (the contest itself), carried by a full-bleed photo
 * band rather than a grid, so the page's rhythm keeps changing shape.
 *
 * SIGNATURE MOMENT 4 — the cinematic band. The real photograph stays
 * dominant; the treatment is a slow push, a controlled vignette and one
 * warm light leak. The push is scroll-linked where the browser supports
 * scroll-driven animations and a slow ambient drift everywhere else, with
 * no scroll listener and no JavaScript in either case (globals.css,
 * .nf-kenburns).
 */
export default function HalloweenAtmosphere() {
  return (
    <section
      aria-labelledby="atmosphere-heading"
      className="relative overflow-hidden bg-ink"
    >
      <div className="relative aspect-4/5 overflow-hidden sm:aspect-3/2 md:aspect-21/9">
        <div className="nf-kenburns absolute inset-0">
          <Image
            src="/images/photos/artists-marvin.jpg"
            alt="An artist showing original artwork to a visitor at a previous Nostalgia Fest artist-alley table."
            fill
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: "40% 35%" }}
            loading="lazy"
          />
        </div>

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/55 to-ink/15"
        />
        <div aria-hidden="true" className="nf-vignette" />
        {/* Light leak across the trailing top corner, drifting slowly. */}
        <div
          aria-hidden="true"
          className="nf-lightfield inset-[-15%] mix-blend-screen"
          style={{
            background:
              "radial-gradient(38% 55% at 88% 6%, rgb(255 138 61 / 24%) 0%, transparent 70%)",
          }}
        />
        <div aria-hidden="true" className="nf-grain opacity-[0.09]" />

        <span className="pointer-events-none absolute top-3 left-3 rounded bg-ink/80 px-2 py-1 text-[10px] font-medium text-text-inverse">
          Previous Nostalgia Fest event
        </span>

        <RevealOnScroll className="absolute inset-x-0 bottom-0 px-4 pb-8 md:px-6 md:pb-12">
          <div className="mx-auto max-w-6xl">
            <p className="nf-eyebrow text-xs text-pink-bright">
              Halloween atmosphere
            </p>
            <h2
              id="atmosphere-heading"
              className="nf-display mt-2 max-w-xl text-3xl text-text-inverse md:text-5xl"
            >
              Dressed up or not, you&apos;re on the floor.
            </h2>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
