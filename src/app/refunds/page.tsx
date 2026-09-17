import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { NotYetPublished } from "@/components/LegalPage";
import { GENERAL_CONTACT_EMAIL, LEGAL_ENTITY_NAME, hasAnyTicketProvider } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description:
    "How refunds and cancellations work for Nostalgia Fest events, including free general admission and paid options.",
};

/**
 * Refund and Cancellation Policy.
 *
 * Two audiences, kept clearly separate, per docs/site-compliance.md:
 *
 *   1. Free registration today. Every currently announced event (Expo 2026,
 *      Halloween 2026) is Free General Admission only, confirmed in
 *      docs/event-data.md. There is no purchase price to refund for either,
 *      and the page says so plainly rather than writing as though a paid
 *      ticket exists today.
 *   2. The confirmed policy framework for future paid tickets, approved by
 *      Chris, which applies automatically once and if Nostalgia Fest offers
 *      a paid ticket for some future event. This is a real, decided policy,
 *      not a placeholder, but it describes what happens WHEN a paid ticket
 *      exists, not a claim that one exists now.
 *
 * No specific paid product (VIP or otherwise) is named here, because none is
 * confirmed anywhere in docs/event-data.md today. If a future paid ticket is
 * added, it is described on that event's own page and this page's framework
 * applies to it automatically without needing to invent product names here.
 */
export default function RefundsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Refund & Cancellation Policy"
      intro={`How refunds and cancellations work for ${LEGAL_ENTITY_NAME} events.`}
    >
      <h2>Where things stand today</h2>
      {hasAnyTicketProvider() ? (
        <p>
          Tickets for our events are sold and registered through a third-party
          ticketing provider. The sections below explain how each type of
          admission works.
        </p>
      ) : (
        <p>
          <strong>
            No paid tickets are currently on sale through this website.
          </strong>{" "}
          Every event we have announced, Nostalgia Fest Expo 2026 and
          Nostalgia Fest Halloween 2026, is Free General Admission only. No
          ticketing provider is connected yet, so there is nothing that could
          have been purchased and nothing outstanding to refund today. The
          policy below for future paid tickets is a decided policy that will
          apply automatically if and when we offer one.
        </p>
      )}

      <h2>Free registration</h2>
      <p>
        General admission to Nostalgia Fest Expo and Nostalgia Fest Halloween
        is free. There is no purchase price, so there is nothing to refund for
        general admission.
      </p>
      <p>
        If free registration is introduced for an event and you can no longer
        attend, you do not need to do anything. You are welcome to release your
        spot if the registration system allows it, so someone else can take it.
      </p>

      <h2>Future paid tickets</h2>
      <p>
        No paid ticket is on sale for any event today. The rules below are our
        decided policy for any paid ticket we offer in the future, so the
        position is settled in advance rather than being written after the
        fact.
      </p>
      <ul>
        <li>
          A paid ticket may be refunded up until 7 calendar days before the
          event&apos;s start date.
        </li>
        <li>
          After that deadline, a paid ticket is non-refundable, unless we
          cancel the event or a third-party ticketing provider requires
          otherwise.
        </li>
        <li>
          A paid ticket is non-transferable to another person, unless we
          explicitly state otherwise for a particular event.
        </li>
      </ul>
      <p>
        Where a paid ticket for a specific future event has different terms,
        those terms will be published on that event&apos;s own page and shown
        at the point of purchase.
      </p>

      <h2>Buying through a ticketing provider</h2>
      <p>
        When tickets are sold through a third-party ticketing provider, that
        provider is a separate company. Your purchase is made with them, the
        payment is processed by them, and their own terms, refund rules and
        service fees apply in addition to anything on this page. If a
        ticketing provider imposes additional refund rights or requirements
        beyond what is written here, those platform rules also apply.
      </p>
      <p>
        Whether a ticketing provider&apos;s service or processing fee is
        refundable depends on that provider&apos;s own policy, not ours. We do
        not promise that these fees are always refundable. Please read the
        provider&apos;s terms before you complete a purchase, and keep your
        confirmation email.
      </p>
      <p>
        Where a refund is due on a purchase made through a provider, it is
        returned according to that provider&apos;s own process, normally to
        the original payment method.
      </p>

      <h2>If an event is cancelled</h2>
      <p>
        If Nostalgia Fest Inc. cancels an event outright, we will say so on
        this website and through the channels we use to communicate about that
        event, as soon as we reasonably can.
      </p>
      <p>
        If a paid ticket exists for that event, its purchaser receives a full
        refund, following the process of the applicable payment or ticketing
        provider used for that event.
      </p>
      <p>
        Free general admission needs no action from you if an event is
        cancelled, because nothing was paid.
      </p>

      <h2>If an event is postponed or rescheduled</h2>
      <p>
        Live events sometimes move, and details such as programming, guests,
        sponsors, activations, competitions and hours can change. As set out in
        our <Link href="/terms">Terms &amp; Conditions</Link>, a change to a
        detail of this kind is not in itself a cancellation of the event.
      </p>
      <p>
        If an event is rescheduled to a new date rather than cancelled, a paid
        ticket for that event remains valid for the rescheduled date.
      </p>

      <h2>Vendors, sponsors and exhibitors</h2>
      <p>
        This page covers attendee admission. Vendor table bookings, sponsorship
        and exhibitor arrangements are handled separately and directly with us,
        under whatever was agreed for that booking. They are not covered here.
      </p>

      <h2>Your consumer rights</h2>
      <p>
        Nothing on this page removes rights you have under Ontario consumer
        protection law or any other law that applies to you.
      </p>

      <h2>Contact</h2>
      {GENERAL_CONTACT_EMAIL ? (
        <p>
          Questions about a refund or a cancellation can be sent to{" "}
          <a href={`mailto:${GENERAL_CONTACT_EMAIL}`}>
            {GENERAL_CONTACT_EMAIL}
          </a>
          . If you bought through a ticketing provider, contacting that
          provider directly is usually fastest.
        </p>
      ) : (
        <NotYetPublished>
          <p>
            A contact address for refund and cancellation questions is being
            set up and will be published here. Until then, please reach us
            through the channel you normally use to contact us about our
            events.
          </p>
        </NotYetPublished>
      )}
    </LegalPage>
  );
}
