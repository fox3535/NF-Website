import Link from "next/link";
import RevealOnScroll from "./RevealOnScroll";
import TicketCtaCluster from "./TicketCtaCluster";
import { expo2026 } from "@/lib/events";

/**
 * The featured upcoming event module. Data-driven from a single event
 * record (src/lib/events.ts) so a future event can occupy this slot with no
 * structural change — see docs/homepage-concept.md section 5.
 *
 * Deliberately carries no hours table, no street address and no photograph:
 * this section sells *why this is the next event worth attending*, and Plan
 * Your Visit immediately below answers *how do I get there and when*.
 * Repeating both blocks made the two sections near-identical.
 */
export default function FeaturedEvent() {
  return (
    <section
      id="featured-event"
      aria-labelledby="featured-event-heading"
      className="bg-paper-strong py-16 md:py-24"
    >
      <RevealOnScroll className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="nf-slab">
          <div className="rounded-lg bg-ink px-6 py-12 text-text-inverse md:px-14 md:py-16">
            <div className="md:flex md:items-end md:justify-between md:gap-12">
              <div className="min-w-0">
                <p className="nf-eyebrow text-xs text-pink">Next event</p>
                <h2
                  id="featured-event-heading"
                  className="nf-display mt-3 text-5xl lg:text-6xl"
                >
                  {expo2026.name}
                </h2>
              </div>

              {/* Date set as the second display element, not body copy —
                  it is the fact most people are scanning for. */}
              <p className="nf-display tabular-nums mt-6 text-3xl text-gold-bright md:mt-0 md:shrink-0 md:text-4xl">
                {expo2026.dateRange}
              </p>
            </div>

            <div aria-hidden="true" className="nf-perforation my-8 text-pink" />

            <p className="max-w-2xl text-lg text-text-inverse-secondary">
              Three days of trading cards, toys, comics, original art and
              collectibles under one roof in Mississauga — with{" "}
              <span className="font-semibold text-text-inverse">
                {expo2026.vendorNote?.replace(" at Expo 2026", "")}
              </span>{" "}
              to dig through.
            </p>

            <p className="mt-5 flex items-center gap-2 text-base font-semibold text-gold-bright">
              <span aria-hidden="true" className="text-lg leading-none">
                ✦
              </span>
              Free admission — no ticket needed to walk the floor
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <TicketCtaCluster surface="ink" />
              <Link
                href={expo2026.href}
                className="inline-flex min-h-[44px] items-center text-sm font-medium text-text-inverse underline underline-offset-4 hover:text-gold-bright"
              >
                See the Expo details
              </Link>
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
