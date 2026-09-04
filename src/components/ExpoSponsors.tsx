import Image from "next/image";
import Link from "next/link";
import RevealOnScroll from "./RevealOnScroll";
import { EXPO_SPONSORS, isFeaturedSponsor } from "@/lib/expo-content";

/**
 * Sponsors / activations.
 *
 * Three sponsors with nothing but names were being inflated into three large
 * identical cards, which read as unfinished placeholder furniture. The
 * presentation now scales to the information that actually exists:
 *
 *  - name only  → a compact plaque on a single "powered by" strip
 *  - logo / activation / link → promoted to a full tile with room for art
 *
 * So the section is honest today and needs no redesign the moment a sponsor
 * confirms an activation (see isFeaturedSponsor).
 */
const ACCENTS = ["text-gold-bright", "text-pink-bright", "text-cyan-bright"];

export default function ExpoSponsors() {
  if (EXPO_SPONSORS.length === 0) return null;

  const featured = EXPO_SPONSORS.filter(isFeaturedSponsor);
  const plaques = EXPO_SPONSORS.filter((s) => !isFeaturedSponsor(s));

  return (
    <section
      aria-labelledby="sponsors-heading"
      className="nf-halftone relative overflow-hidden bg-ink-soft py-12 md:py-16"
    >
      <RevealOnScroll className="relative mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
          <div>
            <p className="nf-eyebrow text-xs text-pink">Powered by</p>
            <h2
              id="sponsors-heading"
              className="nf-display mt-2 text-3xl text-text-inverse md:text-4xl"
            >
              Expo 2026 sponsors
            </h2>
          </div>
          <p className="text-sm text-text-inverse-secondary">
            Activation details announced closer to the show.
          </p>
        </div>

        {featured.length > 0 && (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {featured.map((sponsor, i) => (
              <article
                key={sponsor.id}
                className="nf-case nf-case-ink nf-foil flex flex-col"
              >
                <div className="nf-case-label text-text-inverse-secondary">
                  <span>Sponsor</span>
                  <span className={ACCENTS[i % ACCENTS.length]}>Expo 2026</span>
                </div>
                {sponsor.art && (
                  <div className="relative aspect-16/9 overflow-hidden rounded-lg">
                    <Image
                      src={sponsor.art.src}
                      alt={sponsor.art.alt}
                      fill
                      sizes="(min-width: 768px) 45vw, 90vw"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="px-1 pt-3 pb-1">
                  {sponsor.logo ? (
                    <Image
                      src={sponsor.logo.src}
                      alt={sponsor.logo.alt}
                      width={320}
                      height={120}
                      className="h-8 w-auto"
                    />
                  ) : (
                    <p className="nf-display text-2xl text-paper">
                      {sponsor.name}
                    </p>
                  )}
                  {sponsor.activation && (
                    <p className="mt-2 text-sm text-text-inverse-secondary">
                      {sponsor.activation}
                    </p>
                  )}
                  {sponsor.href && (
                    <Link
                      href={sponsor.href}
                      className="nf-action nf-action-outline mt-4 inline-flex px-4 py-2 text-xs text-text-inverse"
                    >
                      {sponsor.ctaLabel ?? "Learn more"}
                      <span aria-hidden="true">→</span>
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {plaques.length > 0 && (
          <ul className="mt-8 flex flex-wrap items-stretch gap-3">
            {plaques.map((sponsor, i) => (
              <li key={sponsor.id} className="flex-1 basis-52">
                <div className="flex h-full items-center gap-3 rounded-xl border border-white/15 bg-white/[0.05] px-5 py-4">
                  <span
                    aria-hidden="true"
                    className={`text-lg ${ACCENTS[i % ACCENTS.length]}`}
                  >
                    ✦
                  </span>
                  <p className="nf-display text-xl text-paper md:text-2xl">
                    {sponsor.name}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </RevealOnScroll>
    </section>
  );
}
