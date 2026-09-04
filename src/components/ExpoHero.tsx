import Image from "next/image";
import TicketButton from "./TicketButton";
import { expo2026 } from "@/lib/events";

/**
 * Expo hero — campaign/microsite treatment. Unlike the homepage (which
 * keeps key art out entirely, see docs/visual-directions.md), this page IS
 * the campaign, so the approved artwork gets real presence: a contained
 * poster reproduction beside our own typeset facts, rather than either
 * hiding it or letting its own embedded text double as the page's copy.
 */
export default function ExpoHero() {
  return (
    <section aria-label="Nostalgia Fest Expo" className="nf-halftone relative overflow-hidden bg-ink py-12 md:py-20">
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-12 md:items-center md:gap-12 md:px-6">
        <div className="md:col-span-5">
          <div className="nf-case nf-case-ink nf-foil mx-auto max-w-sm md:max-w-none">
            <div className="nf-case-label text-text-inverse-secondary">
              <span>Nostalgia Fest</span>
              <span className="text-pink-bright">Oct Expo</span>
            </div>
            <div className="relative aspect-4/5 overflow-hidden rounded-lg">
              <Image
                src="/images/campaigns/expo-2026-banner.png"
                alt="Nostalgia Fest Expo 2026 campaign artwork, listing the show's dates, venue and highlights over a photo of a trading-card show floor."
                fill
                priority
                sizes="(min-width: 768px) 35vw, 85vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-7">
          <p className="nf-eyebrow text-xs text-pink">Nostalgia Fest Expo</p>
          <h1 className="nf-display mt-3 text-5xl text-text-inverse md:text-7xl">
            Three days of cards, collectibles and community.
          </h1>

          <p className="tabular-nums mt-5 text-lg text-text-inverse-secondary md:text-xl">
            {expo2026.dateRange} · {expo2026.venue}, Mississauga
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
            <p className="flex items-center gap-2 text-base font-semibold text-gold-bright">
              <span aria-hidden="true" className="text-lg leading-none">✦</span>
              Free General Admission
            </p>
            <p className="text-sm text-text-inverse-secondary">
              VIP upgrade available
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <TicketButton className="nf-action nf-action-gold px-7 py-3.5 text-base">
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
