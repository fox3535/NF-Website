import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { NotYetPublished } from "@/components/LegalPage";
import {
  GENERAL_CONTACT_EMAIL,
  GOVERNING_PROVINCE,
  LEGAL_ENTITY_NAME,
} from "@/lib/legal";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms that apply to using the Nostalgia Fest website, event information, third-party ticketing and our brand materials.",
};

/**
 * Website Terms and Conditions.
 *
 * Scope is deliberately the website, not the events themselves: event
 * admission terms belong to whatever ticketing provider and venue are used,
 * and none is connected yet (src/lib/tickets.ts).
 *
 * No blanket waiver, no indemnity clause and no "we are never liable for
 * anything" language. Those read badly for a family event brand, and an
 * unreasonably broad exclusion is the kind a court is most likely to refuse
 * to enforce anyway. What is here is limited to the honest position: event
 * details can change, we do not control third-party sites, and our brand
 * material is not free to reuse.
 */
export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms & Conditions"
      intro={`The terms that apply when you use the ${LEGAL_ENTITY_NAME} website.`}
    >
      <h2>Agreement to these terms</h2>
      <p>
        This website is operated by {LEGAL_ENTITY_NAME}, based in the
        Province of Ontario, Canada.
      </p>
      <p>
        These terms apply to your use of this website. By using the site you
        agree to them. If you do not agree with them, please do not use the
        site.
      </p>
      <p>
        These terms cover the website. They are not the terms of admission to
        our events. Where an event has a paid ticket, admission terms are set
        out by the ticketing provider and the venue for that event, and you
        agree to those separately when you register or buy a ticket.
      </p>

      <h2>Using this website</h2>
      <p>You may use this site to learn about our events and to plan a visit. You agree not to:</p>
      <ul>
        <li>use the site for any unlawful purpose</li>
        <li>
          attempt to gain unauthorised access to the site, its hosting or any
          system connected to it
        </li>
        <li>
          interfere with the site&apos;s normal operation, including by
          overloading it or introducing malicious code
        </li>
        <li>
          scrape, copy or republish substantial parts of the site for a
          commercial purpose without our permission
        </li>
        <li>
          misrepresent yourself as {LEGAL_ENTITY_NAME}, or suggest a
          sponsorship, partnership or endorsement that does not exist
        </li>
      </ul>

      <h2>Event information can change</h2>
      <p>
        We publish event information that is confirmed at the time of writing.
        Live events change, and details such as programming, guests, sponsors,
        activations, competitions, giveaways, hours, floor layout and
        participating vendors may be added, altered, postponed or withdrawn.
      </p>
      <p>
        We work to keep this site accurate and to update it when things change,
        but we cannot guarantee that every page is complete and current at
        every moment. Where an event detail matters to your decision to attend,
        please check the relevant event page close to the date.
      </p>
      <p>
        Announced dates, venue and admission information for an event are the
        details we consider most important to keep correct. If an event is
        cancelled or postponed, see our{" "}
        <Link href="/refunds">Refund &amp; Cancellation Policy</Link>.
      </p>

      <h2>Admission and tickets</h2>
      <p>
        General admission to our events is free where a page says so. Where we
        offer a paid ticket for a future event, that ticket is described on
        that event&apos;s own page, and our{" "}
        <Link href="/refunds">Refund &amp; Cancellation Policy</Link> applies
        to it.
      </p>
      <p>
        Where tickets or registrations are handled by a third-party ticketing
        provider, that provider is a separate company with its own terms, its
        own privacy policy and its own customer support. When you register or
        purchase through them, you are entering an agreement with them.
      </p>
      <p>
        We may refuse or revoke admission where it is necessary for the safety
        of attendees, staff, vendors or the venue, or where someone is in
        breach of venue rules.
      </p>

      <h2>Links to other websites</h2>
      <p>
        This site links to websites we do not own or control, such as map
        services, ticketing providers and the websites of sponsors and
        partners. We provide those links for convenience. We are not
        responsible for the content, products, accuracy or practices of those
        websites, and including a link does not mean we endorse everything on
        it.
      </p>

      <h2>Our brand and content</h2>
      <p>
        The {LEGAL_ENTITY_NAME} name, logo, wordmark, campaign artwork, page
        designs, written copy, photography and video on this site belong to us
        or are used with permission. They are protected by copyright and
        trademark law.
      </p>
      <p>
        You may share links to our pages and you may share our public campaign
        material for the purpose of telling people about our events. You may
        not:
      </p>
      <ul>
        <li>
          use our name, logo or artwork in a way that suggests we endorse,
          sponsor or are affiliated with you, your business or your event
        </li>
        <li>
          alter our logo or campaign artwork, or remove branding from it
        </li>
        <li>
          use our photography or video in your own advertising or for resale
        </li>
        <li>
          register a domain name, social account or business name that is
          confusingly similar to ours
        </li>
      </ul>
      <p>
        Photography and video on this site showing previous events is labelled
        as such. It shows past events and is not a promise about what will
        appear at an upcoming one.
      </p>

      <h2>Other people&apos;s trademarks</h2>
      <p>
        Product names, brands, sponsor names and other trademarks that appear
        on this site belong to their respective owners. They are used to
        identify those brands and the businesses taking part in our events.
        Their appearance does not imply that those owners endorse this website.
      </p>

      <h2>Photography at our events</h2>
      <p>
        Nostalgia Fest events may be photographed or recorded for event
        documentation and promotional use, such as photos and video shared on
        this website or on our social media. Where practical, we aim to note
        this on event information and through signage visible at the venue.
      </p>
      <p>
        For deliberate featured content, such as a close-up interview, a
        testimonial, a skit, posed promotional content, or a feature on an
        individual vendor or attendee, we ask for that person&apos;s direct
        permission before using it.
      </p>
      <p>
        We take extra care where a photo or video may identify a minor, and we
        do not use an identifiable image of a minor in the kind of featured
        content described above without a parent or guardian&apos;s
        permission.
      </p>
      <p>
        Attending or being visible at an event does not, by itself, grant us
        unlimited or perpetual rights to your image. If you have a concern
        about a specific photo or video of you, please contact us (see
        Contact below) and we will review it.
      </p>

      <h2>No warranty on the website</h2>
      <p>
        We provide this website as it is. We do not promise that it will always
        be available, uninterrupted or free of errors, and we may change,
        suspend or remove parts of it at any time.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the extent the law allows, {LEGAL_ENTITY_NAME} is not liable for
        indirect or consequential loss arising from your use of this website,
        from a website error or from a temporary unavailability of the site.
      </p>
      <p>
        Nothing in these terms limits or excludes liability where the law does
        not allow it to be limited or excluded, including liability for death
        or personal injury caused by negligence, for fraud, or under consumer
        protection legislation. Nothing in these terms takes away rights you
        have as a consumer.
      </p>

      <h2>Privacy</h2>
      <p>
        Our <Link href="/privacy">Privacy Policy</Link> explains how we handle
        information in connection with this website. It forms part of these
        terms.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        We may update these terms from time to time. The date at the top of
        this page shows when they were last updated. Continuing to use the site
        after a change means you accept the updated terms.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of the Province of{" "}
        {GOVERNING_PROVINCE} and the federal laws of Canada that apply there.
        This does not remove any protection available to you under the law of
        the place where you live.
      </p>

      <h2>Contact</h2>
      {GENERAL_CONTACT_EMAIL ? (
        <p>
          Questions about these terms can be sent to{" "}
          <a href={`mailto:${GENERAL_CONTACT_EMAIL}`}>
            {GENERAL_CONTACT_EMAIL}
          </a>
          .
        </p>
      ) : (
        <NotYetPublished>
          <p>
            A contact address for questions about these terms is being set up
            and will be published here. Until then, please reach us through the
            channel you normally use to contact us about our events.
          </p>
        </NotYetPublished>
      )}
    </LegalPage>
  );
}
