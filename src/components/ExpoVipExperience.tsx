import RevealOnScroll from "./RevealOnScroll";
import TicketButton from "./TicketButton";
import TicketPass from "./TicketPass";
import { EXPO_TICKET_TIERS, EXPO_TICKET_URL } from "@/lib/tickets";

/**
 * VIP Experience — an optional upgrade, presented as a premium object.
 *
 * The previous version centred one small pass in a large dark field, which
 * read as empty rather than exclusive. It is now a two-column composition:
 * the pass on a gold-lit plinth, and beside it the honest position on what
 * VIP is and isn't.
 *
 * Nothing here invents perks or pricing — none are confirmed in
 * docs/event-data.md. The reassurance that free GA is the complete standard
 * experience is stated explicitly and repeatedly, because Product Rule 8
 * makes implying otherwise the most damaging possible error on this page.
 */
export default function ExpoVipExperience() {
  const vip = EXPO_TICKET_TIERS.find((t) => t.id === "vip");
  if (!vip) return null;

  return (
    <section
      id="vip"
      aria-labelledby="vip-heading"
      className="relative overflow-hidden bg-ink py-12 md:py-16"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 60% at 22% 50%, rgb(255 201 77 / 20%) 0%, transparent 68%)",
        }}
      />
      {/* Foil edge — the one place gold is allowed to run the full width. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-bright/70 to-transparent"
      />

      <RevealOnScroll className="relative mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] md:items-center md:gap-14 md:px-6">
        <div className="order-2 md:order-1">
          <TicketPass
            className="mx-auto max-w-sm"
            eyebrow={vip.name}
            kindLabel="Optional upgrade"
            price="VIP"
            priceTone="text-gold-bright"
            description="Pricing and perks are still being finalized."
            tone="ink"
            sectionBg="bg-ink"
            foil
            action={
              EXPO_TICKET_URL ? (
                <TicketButton className="nf-action nf-action-gold px-6 py-3 text-sm">
                  Get your tickets
                  <span aria-hidden="true">→</span>
                </TicketButton>
              ) : (
                <p className="nf-stamp text-gold-bright">
                  Details before the show
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
            Free GA is the whole show. VIP is extra.
          </h2>

          <div
            aria-hidden="true"
            className="nf-perforation mt-6 max-w-xs text-gold-bright"
          />

          <p className="mt-6 text-text-inverse-secondary md:text-lg">
            General Admission is free and gets you the full floor: every
            vendor table, every artist, all three days. Nothing on this page
            is behind VIP.
          </p>

          <ul className="mt-6 space-y-3">
            {[
              ["Free General Admission", "The standard way in. No cost, no catch."],
              ["VIP", "An optional paid add-on for anyone who wants more."],
            ].map(([term, detail]) => (
              <li key={term} className="flex items-baseline gap-3">
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-bright"
                />
                <p className="text-sm text-text-inverse-secondary">
                  <span className="font-semibold text-text-inverse">
                    {term}:
                  </span>{" "}
                  {detail}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </RevealOnScroll>
    </section>
  );
}
