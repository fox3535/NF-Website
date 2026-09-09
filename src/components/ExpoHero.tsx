import Image from "next/image";
import ShowTag from "./ShowTag";
import TicketButton from "./TicketButton";
import { expo2026 } from "@/lib/events";

/**
 * Expo hero — campaign/microsite treatment. Unlike the homepage (which
 * keeps key art out entirely, see docs/visual-directions.md), this page IS
 * the campaign, so the approved artwork gets real presence: a contained
 * poster reproduction beside our own typeset facts, rather than either
 * hiding it or letting its own embedded text double as the page's copy.
 *
 * Three things changed from the first version, all of them about making the
 * artwork lead rather than accompany:
 *
 * 1. Scale. The poster column is now marginally wider than the copy column
 *    and the section carries a viewport-height floor, so the campaign card
 *    commands the first screen instead of sitting beside a headline at
 *    thumbnail size. The frame stays 4:5, the artwork's own ratio, so the
 *    approved creative is never cropped to fit a layout decision.
 * 2. Badges. The label strip used ShowTag's job as plain text ("Nostalgia
 *    Fest" / "Oct Expo") while the poster's own wordmark and the eyebrow
 *    said Nostalgia Fest twice more. It now carries the same ShowTag +
 *    kind-chip pairing as the homepage campaign wall and the Halloween
 *    hero, which removes the duplicate labelling and makes a campaign card
 *    read identically everywhere it appears.
 * 3. Depth. Two ambient light fields and grain behind the composition, the
 *    same technique as the Halloween hero (globals.css, Signature 5) in
 *    Expo's own purple and gold rather than Halloween's orange. Decorative,
 *    transform/opacity only, and gated behind prefers-reduced-motion:
 *    no-preference, so the still composition underneath is the real design.
 */
export default function ExpoHero() {
  return (
    <section
      aria-label="Nostalgia Fest Expo"
      className="nf-halftone relative overflow-hidden bg-ink"
    >
      <div aria-hidden="true" className="absolute inset-0">
        {/* Key light, brand purple, behind the poster on the leading side. */}
        <div
          className="nf-lightfield inset-[-12%]"
          style={{
            background:
              "radial-gradient(48% 46% at 22% 22%, rgb(131 46 255 / 42%) 0%, transparent 72%)",
          }}
        />
        {/* Fill light, gold, low on the trailing side. Out of phase with the
            key light so the field breathes rather than throbs. */}
        <div
          className="nf-lightfield nf-lightfield-alt inset-[-12%]"
          style={{
            background:
              "radial-gradient(50% 46% at 86% 84%, rgb(255 201 77 / 22%) 0%, transparent 74%)",
          }}
        />
        <div className="nf-grain" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-6 px-4 py-8 md:min-h-[76svh] md:grid-cols-[minmax(0,1.02fr)_minmax(0,1fr)] md:items-center md:gap-12 md:px-6 md:py-16">
        <div className="relative">
          {/* Soft plinth of light directly under the card, so the poster
              reads as lit rather than pasted onto the section. */}
          <div
            aria-hidden="true"
            className="nf-glow absolute inset-[-14%] opacity-40"
            style={{
              background:
                "radial-gradient(closest-side, rgb(131 46 255 / 55%), transparent 74%)",
            }}
          />
          <div className="nf-case nf-case-ink nf-foil relative mx-auto max-w-[260px] md:max-w-none">
            {/* Same badge pairing as the homepage campaign wall and the
                Halloween hero: show tag, then campaign kind. */}
            <div className="nf-case-label">
              {/* "Oct Expo", matching this show's tag on the homepage
                  campaign wall rather than events.ts shortName, so the same
                  campaign carries the same tag on every surface. */}
              <ShowTag label="Oct Expo" tone="dark" />
              <span className="nf-eyebrow rounded-md border border-ink/15 bg-brand-soft px-2 py-1 text-[10px] text-ink">
                Show info
              </span>
            </div>
            <div className="relative aspect-4/5 overflow-hidden rounded-lg">
              <Image
                src="/images/campaigns/expo-2026-banner.png"
                alt="Nostalgia Fest Expo 2026 campaign artwork, listing the show's dates, venue and highlights over a photo of a trading-card show floor."
                fill
                priority
                sizes="(min-width: 768px) 48vw, 85vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div>
          <p className="nf-eyebrow text-xs text-pink">Nostalgia Fest Expo</p>
          <h1 className="nf-display mt-3 text-[clamp(2.5rem,7vw,3.75rem)] text-text-inverse">
            Three days of cards, collectibles and community.
          </h1>

          <p className="nf-display tabular-nums mt-6 text-2xl text-gold-bright md:text-3xl">
            {expo2026.dateRange}
          </p>
          <p className="mt-2 text-base text-text-inverse-secondary md:text-lg">
            {expo2026.venue}, Mississauga
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
            <p className="flex items-center gap-2 text-base font-semibold text-gold-bright">
              <span aria-hidden="true" className="text-lg leading-none">✦</span>
              Free General Admission
            </p>
            <p className="text-sm text-text-inverse-secondary">
              VIP upgrade available
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <TicketButton
              eventSlug="expo-2026"
              className="nf-action nf-action-gold px-7 py-3.5 text-base"
            >
              Get your tickets
              <span aria-hidden="true">→</span>
            </TicketButton>
            <a
              href="#tickets"
              className="text-sm font-medium text-text-inverse-secondary underline underline-offset-2 hover:text-text-inverse"
            >
              See ticket options
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
