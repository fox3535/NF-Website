import Image from "next/image";
import RevealOnScroll from "./RevealOnScroll";
import { COLLECTR_ACTIVATION } from "@/lib/expo-content";

/**
 * Collectr's activation, the Wall of Nostalgia — its own section rather than
 * a card in ExpoSponsors, because unlike the other two sponsors this one has
 * enough real, confirmed detail (docs/event-data.md) to earn the space: cash
 * prizes and raffle times for all three days, plus its own banner artwork.
 *
 * The heading doubles as a same-page anchor link (href="#collectr-activation"),
 * so this activation has its own shareable, clickable "sub landing page"
 * title inside the Expo page rather than only being reachable by scrolling —
 * the homepage campaign wall's Collectr card links straight to it, and so
 * does ExpoSubNav.
 */
export default function ExpoCollectrActivation() {
  const { sponsorName, title, tagline, totalPrize, prizes, banners } =
    COLLECTR_ACTIVATION;

  return (
    <section
      id="collectr-activation"
      aria-labelledby="collectr-activation-heading"
      className="nf-grid relative overflow-hidden bg-paper py-14 md:py-20"
    >
      <RevealOnScroll className="relative mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <div>
            <p className="nf-eyebrow text-xs text-brand">
              Sponsor activation · {sponsorName}
            </p>
            <h2 className="mt-3">
              <a
                id="collectr-activation-heading"
                href="#collectr-activation"
                className="nf-display inline-block text-4xl text-text underline decoration-brand/30 decoration-2 underline-offset-8 transition-colors hover:text-brand md:text-5xl"
              >
                {title}
              </a>
            </h2>
            <p className="mt-2 text-text-secondary">{tagline}</p>
          </div>

          <div className="nf-case shrink-0">
            <div className="nf-case-label text-text-secondary">
              <span>Prizes &amp; raffles</span>
              <span className="text-brand">All 3 days</span>
            </div>
            <p className="nf-numeral tabular-nums rounded-lg bg-white px-6 py-4 text-4xl text-brand md:text-5xl">
              {totalPrize}
            </p>
          </div>
        </div>

        {/* The two Collectr graphics are both 1080x1350 files, but they do
            different jobs. The poster is dense and shown whole at its true
            4:5 ratio. The $1,000 note sits in a lot of empty cream, so it is
            framed tighter (the wording and both paper balls stay in view) and
            the daily prize schedule stacks under it. That fills the second
            column to the poster's height instead of leaving a tall empty
            card beside it. */}
        <div className="mt-10 grid gap-4 md:grid-cols-[1.3fr_1fr] md:items-stretch">
          <div className="nf-case order-3 self-start overflow-hidden md:order-none">
            <div className="relative aspect-4/5">
              <Image
                src={banners[1].src}
                alt={banners[1].alt}
                fill
                sizes="(min-width: 1152px) 640px, (min-width: 768px) 55vw, 100vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
          </div>

          <div className="order-1 flex flex-col gap-4 md:order-none">
            <div className="nf-case overflow-hidden">
              <div className="relative aspect-[1080/1130]">
                <Image
                  src={banners[0].src}
                  alt={banners[0].alt}
                  fill
                  sizes="(min-width: 1152px) 490px, (min-width: 768px) 40vw, 100vw"
                  className="object-cover object-[50%_42%]"
                  loading="lazy"
                />
              </div>
            </div>

            <dl className="order-2 grid flex-1 gap-3 md:order-none">
              {prizes.map((prize) => (
                <div
                  key={prize.day}
                  className="flex flex-col justify-center rounded-xl border border-border bg-white px-5 py-3"
                >
                  <dt className="nf-eyebrow text-[10px] text-text-secondary">
                    {prize.day}
                  </dt>
                  <dd className="mt-1 flex items-baseline gap-2">
                    <span className="nf-numeral tabular-nums text-3xl text-brand">
                      {prize.amount}
                    </span>
                    <span className="text-sm text-text-secondary">
                      @ {prize.time}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
