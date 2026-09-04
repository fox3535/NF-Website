import RevealOnScroll from "./RevealOnScroll";
import TicketButton from "./TicketButton";
import TicketPass from "./TicketPass";
import { TICKET_URLS } from "@/lib/tickets";

/**
 * A single admission pass, not a two-tier comparison: no VIP tier is
 * confirmed for Halloween (docs/event-data.md), so unlike Expo's Ticket
 * Choices this doesn't invent one to fill the layout. Free General
 * Admission is the whole story here.
 *
 * The composition is deliberately asymmetric: the pass takes the wider
 * column and the words take the narrower one. The earlier full-width
 * heading over a half-width pass left the trailing half of the section
 * empty, and the honest fix for empty space is composition, not invented
 * content, so nothing was added to fill it.
 */
export default function HalloweenTicketCta() {
  const url = TICKET_URLS["halloween-2026"];

  const action = url ? (
    <TicketButton
      eventSlug="halloween-2026"
      className="nf-action nf-action-halloween px-6 py-3 text-sm"
    >
      Get your tickets
      <span aria-hidden="true">→</span>
    </TicketButton>
  ) : (
    <p className="nf-stamp text-halloween">Ticket link coming soon</p>
  );

  return (
    <section
      id="tickets"
      aria-labelledby="tickets-heading"
      className="bg-paper py-14 md:py-20"
    >
      <RevealOnScroll className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid items-center gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-5">
            <p className="nf-eyebrow text-xs text-brand">How to attend</p>
            <h2
              id="tickets-heading"
              className="nf-display mt-3 text-4xl text-text md:text-5xl"
            >
              Free to attend, costume optional
            </h2>
            <p className="mt-4 max-w-prose text-text-secondary">
              General Admission is free. There&apos;s no paid tier to unlock
              anything on this page.
            </p>

            <p className="nf-display mt-8 text-3xl text-text md:text-4xl">
              Show up.{" "}
              <br />
              <span className="text-brand">In costume or not.</span>
            </p>
          </div>

          <div className="md:col-span-7">
            <TicketPass
              eyebrow="General Admission"
              kindLabel="Standard entry"
              price="Free"
              priceTone="text-brand"
              metaLabel="Halloween 2026 · Oct 31 & Nov 1"
              description="The only ticket you need for Nostalgia Fest Halloween. No cost, no catch."
              action={action}
              tone="paper"
              surfaceClass="bg-halloween/12"
            />
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
