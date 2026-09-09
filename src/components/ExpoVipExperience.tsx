import RevealOnScroll from "./RevealOnScroll";
import TicketButton from "./TicketButton";
import TicketPass from "./TicketPass";
import { EXPO_TICKET_TIERS, TICKET_URLS } from "@/lib/tickets";

/**
 * VIP Experience — an optional upgrade, presented as something to look
 * forward to.
 *
 * The previous version led with "Free GA is the whole show. VIP is extra."
 * and followed it with a bulleted restatement of the same point. Product
 * Rule 8 was already satisfied three times over before a reader ever
 * reached this section (the hero, Pick Your Pass and the final CTA all say
 * General Admission is free and VIP is optional), so repeating it here in
 * disclaimer form spent the page's one premium moment apologising for
 * itself. The reassurance is now a single confident line, and the section
 * spends its space on anticipation instead.
 *
 * Nothing here invents perks or pricing — none are confirmed in
 * docs/event-data.md. The pending details are set as a status board, the
 * same device the Halloween page uses for its competition details, so an
 * unfinished announcement reads as a schedule being kept rather than as a
 * placeholder waiting to be filled.
 */
const DETAIL_ROWS = [
  { key: "included", label: "What's included" },
  { key: "pricing", label: "Pricing" },
  { key: "how", label: "How to get one" },
];

export default function ExpoVipExperience() {
  const vip = EXPO_TICKET_TIERS.find((t) => t.id === "vip");
  if (!vip) return null;

  return (
    <section
      id="vip"
      aria-labelledby="vip-heading"
      className="relative overflow-hidden bg-ink py-16 md:py-24"
    >
      <div
        aria-hidden="true"
        className="nf-lightfield inset-[-14%]"
        style={{
          background:
            "radial-gradient(58% 52% at 24% 48%, rgb(255 201 77 / 24%) 0%, transparent 70%)",
        }}
      />
      <div aria-hidden="true" className="nf-grain" />
      {/* Foil edge — the one place gold is allowed to run the full width. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-bright/70 to-transparent"
      />

      <RevealOnScroll className="relative mx-auto grid max-w-6xl gap-12 px-4 md:grid-cols-[minmax(0,0.92fr)_minmax(0,1fr)] md:items-center md:gap-16 md:px-6">
        <div className="relative order-2 md:order-1">
          {/* Plinth of gold light under the pass, so it reads as lit rather
              than centred in an empty field. */}
          <div
            aria-hidden="true"
            className="nf-glow absolute inset-[-18%] opacity-50"
            style={{
              background:
                "radial-gradient(closest-side, rgb(255 201 77 / 40%), transparent 72%)",
            }}
          />
          <TicketPass
            className="relative mx-auto max-w-md"
            eyebrow={vip.name}
            kindLabel="Optional upgrade"
            price="VIP"
            priceTone="text-gold-bright"
            metaLabel="Expo 2026 · Oct 9 to 11"
            description="The optional upgrade for Expo 2026, on top of free General Admission."
            tone="ink"
            sectionBg="bg-ink"
            foil
            action={
              TICKET_URLS["expo-2026"] ? (
                <TicketButton
                  eventSlug="expo-2026"
                  className="nf-action nf-action-gold px-6 py-3 text-sm"
                >
                  Get your tickets
                  <span aria-hidden="true">→</span>
                </TicketButton>
              ) : (
                <p className="nf-stamp text-gold-bright">
                  Announced before the show
                </p>
              )
            }
          />
        </div>

        <div className="order-1 md:order-2">
          <p className="nf-eyebrow text-xs text-gold-bright">VIP Experience</p>
          <h2
            id="vip-heading"
            className="nf-display mt-3 text-4xl text-text-inverse md:text-5xl"
          >
            An upgrade worth the wait.
          </h2>

          <p className="mt-5 text-text-inverse-secondary md:text-lg">
            Expo 2026 has an optional VIP Experience running alongside free
            General Admission. We&apos;re finishing exactly what it includes,
            and it gets announced here before the show.
          </p>

          {/* Pending details as a status board rather than a disclaimer. */}
          <div className="mt-8 rounded-xl border border-gold-bright/25 bg-white/[0.04] px-5 py-5 md:px-6">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="nf-eyebrow text-[10px] text-text-inverse-secondary">
                VIP details
              </p>
              <p className="nf-eyebrow tabular-nums text-[10px] text-text-inverse-secondary">
                Announced before the show
              </p>
            </div>

            <dl className="mt-4 divide-y divide-white/10 border-t border-white/10">
              {DETAIL_ROWS.map((row) => (
                <div key={row.key} className="flex items-baseline gap-4 py-3">
                  <dt className="nf-display shrink-0 text-lg text-text-inverse md:text-xl">
                    {row.label}
                  </dt>
                  <dd className="flex flex-1 items-baseline gap-4">
                    <span
                      aria-hidden="true"
                      className="nf-perforation flex-1 text-gold-bright"
                    />
                    <span className="nf-eyebrow shrink-0 text-[10px] whitespace-nowrap text-gold-bright">
                      Coming soon
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <p className="mt-6 flex items-start gap-2 text-sm text-text-inverse-secondary">
            <span aria-hidden="true" className="mt-px text-gold-bright">
              ✦
            </span>
            Free General Admission always gets you the full floor, all three
            days.
          </p>
        </div>
      </RevealOnScroll>
    </section>
  );
}
