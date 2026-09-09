import Image from "next/image";
import ShowTag from "./ShowTag";
import TicketButton from "./TicketButton";
import { halloween2026 } from "@/lib/events";

/**
 * Halloween hero — now built around the approved campaign poster
 * (halloween-landing-banner.png), the same way ExpoHero is built around
 * Expo's approved banner: a contained poster card beside typeset copy,
 * rather than the previous full-bleed placeholder-photo treatment used
 * while no Halloween campaign art existed yet.
 *
 * The atmospheric layers from that earlier version (Signature Moment 1)
 * stay, deliberately, as the background behind the two-column layout —
 * this is why the page still reads as Halloween and not an orange-tinted
 * copy of the Expo hero: dim previous-event photo, two drifting colored
 * light fields, a slow stage-light wash, then grain. All decorative,
 * transform/opacity only, and gated behind prefers-reduced-motion:
 * no-preference (globals.css, Signature 5), so the still composition
 * beneath them is the real design.
 *
 * The poster card carries the same ShowTag + kind-badge pairing the
 * homepage campaign wall uses, in its own label strip above the artwork
 * rather than overlaid on it — consistent badge language without risking
 * the badges landing on top of the poster's own dense layout.
 */
export default function HalloweenHero() {
  return (
    <section
      aria-label="Nostalgia Fest Halloween"
      className="relative overflow-hidden bg-ink"
    >
      <div className="absolute inset-0">
        <Image
          src="/images/photos/scale-crowd.jpg"
          alt="A wide view of a packed ballroom aisle lined with vendor tables at a previous Nostalgia Fest."
          fill
          sizes="100vw"
          className="object-cover opacity-40 grayscale-[45%]"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink via-ink/88 to-ink/62" />

        {/* Key light, warm, high on the trailing side. */}
        <div
          aria-hidden="true"
          className="nf-lightfield inset-[-12%]"
          style={{
            background:
              "radial-gradient(46% 42% at 78% 14%, rgb(255 138 61 / 34%) 0%, transparent 72%)",
          }}
        />
        {/* Fill light, NF purple, low on the leading side. Out of phase
            with the key light so the field breathes rather than throbs. */}
        <div
          aria-hidden="true"
          className="nf-lightfield nf-lightfield-alt inset-[-12%]"
          style={{
            background:
              "radial-gradient(52% 48% at 14% 88%, rgb(131 46 255 / 40%) 0%, transparent 74%)",
          }}
        />
        <div aria-hidden="true" className="nf-sweep" />
        <div aria-hidden="true" className="nf-grain" />

        {/* Labels the dim background photo specifically, not the poster
            card in the foreground — Product Rule 4. */}
        <span className="pointer-events-none absolute top-4 right-4 rounded bg-ink/80 px-2 py-1 text-[10px] font-medium text-text-inverse md:top-6 md:right-6">
          Background: previous Nostalgia Fest event
        </span>
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-12 md:items-center md:gap-12 md:px-6 md:py-20">
        <div className="md:col-span-5">
          <div className="nf-case nf-case-ink mx-auto max-w-sm md:max-w-none">
            <div className="nf-case-label">
              <ShowTag label="Halloween" tone="dark" />
              <span className="nf-eyebrow rounded-md border border-ink/15 bg-brand-soft px-2 py-1 text-[10px] text-ink">
                Show info
              </span>
            </div>
            <div className="relative aspect-4/5 overflow-hidden rounded-lg">
              <Image
                src="/images/campaigns/halloween-landing-banner.png"
                alt="Nostalgia Fest Halloween Show campaign poster: October 31 and November 1 at Square One Event Hall, Mississauga, free entry, 150+ tables, free parking, hourly giveaways, cosplay competition and Pokemon TCG tournament, powered by Slab Sharks, Collectr and Card Catcher."
                fill
                priority
                sizes="(min-width: 768px) 35vw, 85vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-7">
          <p className="nf-eyebrow text-xs text-halloween">
            Nostalgia Fest Halloween
          </p>
          <h1 className="nf-display mt-3 text-[clamp(2.75rem,10vw,5.5rem)] text-text-inverse">
            Come in costume. Come collect.
          </h1>

          {/* The two dates set at display size: on this page they are the
              single most-repeated fact, and they read as a poster line
              rather than a metadata row. */}
          <p className="nf-display tabular-nums mt-6 text-2xl text-halloween md:text-3xl">
            {halloween2026.dateRange}
          </p>
          <p className="mt-2 text-base text-text-inverse-secondary md:text-lg">
            {halloween2026.venue}, Mississauga
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
            <p className="flex items-center gap-2 text-base font-semibold text-gold-bright">
              <span aria-hidden="true" className="text-lg leading-none">✦</span>
              Free General Admission
            </p>
            <p className="text-sm text-text-inverse-secondary">
              Featuring a major cosplay competition
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <TicketButton
              eventSlug="halloween-2026"
              className="nf-action nf-action-halloween px-7 py-3.5 text-base"
            >
              Get your tickets
              <span aria-hidden="true">→</span>
            </TicketButton>
            <a
              href="#cosplay"
              className="text-sm font-medium text-text-inverse-secondary underline underline-offset-2 hover:text-text-inverse"
            >
              See the cosplay competition
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
