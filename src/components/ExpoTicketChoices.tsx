import RevealOnScroll from "./RevealOnScroll";
import TicketPass from "./TicketPass";
import { EXPO_TICKET_TIERS, EXPO_TICKET_URL } from "@/lib/tickets";

/**
 * Ticket choices — deliberately placed right after the hero. Shaped like
 * actual admission passes (see TicketPass) rather than SaaS pricing cards.
 * General Admission gets more visual weight (larger, leads the row) since
 * it's the standard way to attend; VIP sits smaller and clearly secondary,
 * so neither implies the other is required (Product Rule 8).
 */
export default function ExpoTicketChoices() {
  const general = EXPO_TICKET_TIERS.find((t) => t.id === "general");
  const vip = EXPO_TICKET_TIERS.find((t) => t.id === "vip");
  if (!general || !vip) return null;

  function actionFor(tone: "paper" | "ink") {
    if (EXPO_TICKET_URL) {
      return (
        <a
          href={EXPO_TICKET_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={
            tone === "paper"
              ? "nf-action nf-action-filled px-6 py-3 text-sm"
              : "nf-action nf-action-gold px-6 py-3 text-sm"
          }
        >
          Get your tickets
          <span aria-hidden="true">→</span>
        </a>
      );
    }
    return (
      <p className={"nf-stamp " + (tone === "paper" ? "text-brand" : "text-gold-bright")}>
        Ticket link coming soon
      </p>
    );
  }

  return (
    <section
      id="tickets"
      aria-labelledby="tickets-heading"
      className="bg-paper py-12 md:py-16"
    >
      <RevealOnScroll className="mx-auto max-w-6xl px-4 md:px-6">
        <p className="nf-eyebrow text-xs text-brand">How to attend</p>
        <h2
          id="tickets-heading"
          className="nf-display mt-3 text-4xl text-text md:text-5xl"
        >
          Pick your pass
        </h2>
        <p className="mt-3 max-w-prose text-text-secondary">
          General Admission is free and is how most people attend. VIP is a
          paid upgrade for anyone who wants more. It&apos;s never required.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-[3fr_2fr] md:items-stretch">
          <TicketPass
            eyebrow={general.name}
            kindLabel="Standard entry"
            price={general.priceLabel}
            priceTone="text-brand"
            description={general.description}
            action={actionFor("paper")}
            tone="paper"
          />
          <TicketPass
            eyebrow={vip.name}
            kindLabel="Optional upgrade"
            price="VIP"
            priceTone="text-gold-bright"
            description={`${vip.priceLabel}. ${vip.description}`}
            action={actionFor("ink")}
            tone="ink"
            foil
          />
        </div>
      </RevealOnScroll>
    </section>
  );
}
