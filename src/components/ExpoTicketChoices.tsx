import RevealOnScroll from "./RevealOnScroll";
import TicketPass from "./TicketPass";
import { EXPO_TICKET_TIERS, TICKET_URLS } from "@/lib/tickets";

/**
 * A single admission pass, not a ticket-tier comparison: Expo 2026 sells no
 * VIP tier (docs/event-data.md, business decision), so unlike the earlier
 * version of this section there is nothing to compare General Admission
 * against. Free General Admission is the whole story here, the same
 * composition Halloween's ticket section already uses for the same reason
 * (see HalloweenTicketCta.tsx): the pass takes the wider column and the
 * words take the narrower one, rather than a full-width heading over a
 * half-width pass leaving the trailing column empty.
 */
export default function ExpoTicketChoices() {
  const general = EXPO_TICKET_TIERS.find((t) => t.id === "general");
  if (!general) return null;

  const action = TICKET_URLS["expo-2026"] ? (
    <a
      href={TICKET_URLS["expo-2026"]}
      target="_blank"
      rel="noopener noreferrer"
      className="nf-action nf-action-filled px-6 py-3 text-sm"
    >
      Get your tickets
      <span aria-hidden="true">→</span>
    </a>
  ) : (
    <p className="nf-stamp text-brand">Ticket link coming soon</p>
  );

  return (
    <section
      id="tickets"
      aria-labelledby="tickets-heading"
      className="relative overflow-hidden bg-paper py-14 md:py-20"
    >
      {/* Ticket tear off the hero directly above. The perforation is the
          page's own vocabulary rather than decoration, and this is the one
          section where it is also literally about tickets. */}
      <div
        aria-hidden="true"
        className="nf-notch absolute inset-x-0 top-0"
        style={{ ["--nf-notch-color" as string]: "var(--color-ink)" }}
      />
      <div aria-hidden="true" className="nf-warmlight nf-warmlight-gold" />

      <RevealOnScroll className="relative mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid items-center gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-5">
            <p className="nf-eyebrow text-xs text-brand">How to attend</p>
            <h2
              id="tickets-heading"
              className="nf-display mt-3 text-4xl text-text md:text-5xl"
            >
              Free to attend, every day of the show.
            </h2>
            <p className="mt-4 max-w-prose text-text-secondary">
              General Admission is free, no cost, no catch. There is no paid
              tier to unlock anything on this page.
            </p>
          </div>

          <div className="md:col-span-7">
            <TicketPass
              eyebrow={general.name}
              kindLabel="Standard entry"
              price={general.priceLabel}
              priceTone="text-brand"
              metaLabel="Expo 2026 · Oct 9 to 11"
              description={general.description}
              action={action}
              tone="paper"
            />
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
