import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { NotYetPublished } from "@/components/LegalPage";
import {
  BUSINESS_ADDRESS,
  LEGAL_ENTITY_NAME,
  PRIVACY_CONTACT_EMAIL,
  PRIVACY_CONTACT_NAME,
  hasAnyTicketProvider,
} from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Nostalgia Fest handles information on this website, what is collected, and how to make a privacy request.",
};

/**
 * Privacy Policy, written against what this website actually does today,
 * verified from the code rather than from documentation:
 *
 *   - one form: NF Club signup (/club, src/components/ClubSignupForm.tsx),
 *     a Server Action writing to Supabase through src/lib/club/signup-core.ts.
 *     It stores first name, email, optional interests, an append-only consent
 *     record (exact wording, version, source, IP address, user agent,
 *     timestamp) and a signup source touch. No email is sent yet and no
 *     email provider is chosen.
 *   - no accounts, no API routes
 *   - no analytics, no advertising pixel, no third-party scripts
 *   - no cookies set by this site (no document.cookie anywhere)
 *   - one localStorage key, set only on a ticket-action click, never sent
 *     anywhere (src/lib/commitment.ts)
 *   - fonts self-hosted at build time by next/font, so loading a page makes
 *     no request to Google
 *   - images and video served from this site's own domain
 *   - every network request on every page is first-party (verified in the
 *     browser: zero third-party domains)
 *
 * Nothing here claims a retention period, a storage location or region, an
 * email provider, a security guarantee or a ticket-provider relationship,
 * because none of those are established in this repository. See
 * docs/site-compliance.md and docs/platform-v1-plan.md section N.
 */
export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      intro={`How ${LEGAL_ENTITY_NAME} handles information on this website.`}
    >
      <h2>Who we are</h2>
      <p>
        This website and our events are operated by {LEGAL_ENTITY_NAME},
        based in the Province of Ontario, Canada. Our privacy contact is{" "}
        {PRIVACY_CONTACT_NAME}.
      </p>

      <h2>About this policy</h2>
      <p>
        This policy explains how {LEGAL_ENTITY_NAME} handles information in
        connection with this website. It covers this website only. It does not
        cover other companies you may deal with in connection with our events,
        such as a ticketing provider, a venue, a sponsor or a vendor. Those
        companies handle your information under their own policies.
      </p>
      <p>
        We have written this policy to describe what the website actually does
        today. If we add anything that collects information from you, we will
        update this policy before that change goes live.
      </p>

      <h2>Information you give us</h2>
      <p>
        The only place this website asks for personal information is the NF
        Club signup form, on the <Link href="/club">NF Club page</Link>. NF
        Club is our email list. Joining is optional, and you can use the rest
        of the site without it. If you sign up, we collect:
      </p>
      <ul>
        <li>your first name</li>
        <li>your email address</li>
        <li>the interests you choose to select, if any</li>
        <li>
          your marketing consent, along with a record of it: the exact wording
          you agreed to, which version of that wording it was, and when you
          agreed
        </li>
        <li>
          the signup source, meaning which page or signup point you joined
          from (for example, the NF Club page)
        </li>
        <li>
          limited technical details from the signup request, namely your IP
          address and browser user agent, kept with your consent record
        </li>
      </ul>
      <p>
        If you sign up again later, we add any new interests to the ones you
        already chose and record the new consent and signup source alongside
        the earlier ones.
      </p>
      <p>
        We do not ask for a phone number, a password or payment details, and
        NF Club does not involve creating an account. The site has no other
        forms or contact forms.
      </p>
      <p>
        If you contact us through another channel, such as social media, that
        conversation happens on that platform and is governed by that
        platform&apos;s terms and privacy policy as well as this one.
      </p>

      <h2>Photography and video at our events</h2>
      <p>
        Our events, not this website, may be photographed or recorded for
        event documentation and promotional use, which can include images of
        identifiable attendees. Our{" "}
        <Link href="/terms">Terms &amp; Conditions</Link> set out our approach
        to this in full, including how we treat deliberate featured content
        and identifiable minors.
      </p>

      <h2>Information collected automatically</h2>
      <p>
        This website does not run analytics software, advertising pixels,
        behavioural tracking or any other third-party script. We do not build
        profiles of visitors and we do not track you across other websites.
      </p>
      <p>
        Like any website, requests to this site pass through the infrastructure
        that hosts and delivers it. Our hosting provider, Vercel, processes
        those requests in order to serve the pages to you, and standard
        technical information such as an IP address and browser user agent is
        necessarily involved in delivering a web page. That processing happens
        under Vercel&apos;s own privacy terms.
      </p>
      <p>
        Apart from the NF Club signup details described above, we do not use
        that technical information to identify individual
        visitors, and we do not combine it with anything else.
      </p>

      <h2>Cookies and browser storage</h2>
      <p>
        <strong>This website does not set any cookies.</strong> There are no
        advertising cookies, no analytics cookies and no third-party cookies.
        Because of that, there is currently nothing for a cookie consent banner
        to ask you about, so we do not show one.
      </p>
      <p>
        The site does use one small piece of browser storage for a
        functional purpose. When you use a ticket action on an event page, your
        browser remembers that on your own device so the page can offer you
        useful follow up actions, such as adding the event to your calendar or
        getting directions, instead of asking you again. This is stored only in
        your browser, is never sent to us or anyone else, and is discarded
        after the event it relates to has passed.
      </p>
      <p>
        You can clear it at any time by clearing site data for this website in
        your browser. Nothing on the site stops working if you do.
      </p>
      <p>
        The typefaces used on this site are served from our own domain, so
        viewing a page does not send a request to an external font service.
      </p>

      <h2>How we use information</h2>
      <p>If you join NF Club, we use your information to:</p>
      <ul>
        <li>process your signup</li>
        <li>remember the interests you selected</li>
        <li>
          keep a record of your consent, and of any unsubscribe, so we can show
          what you agreed to and make sure we respect it
        </li>
        <li>operate the signup system and protect it from abuse and spam</li>
        <li>
          once we set up an email service, send you marketing and event emails
          from Nostalgia Fest, such as upcoming events, event announcements,
          giveaways, special activations and guest announcements
        </li>
      </ul>
      <p>
        <strong>We are not sending NF Club emails yet.</strong> We have not
        chosen an email service provider. Before we do, we will update this
        policy to name that provider.
      </p>
      <p>
        We do not use NF Club information for anything
        other than the purposes above. The technical processing described
        under &quot;Information collected automatically&quot; exists only to
        deliver the website, keep it working and protect it from abuse.
      </p>

      <h2>Third-party services</h2>
      <p>
        We keep the number of third parties involved in this website
        deliberately small. As of the date at the top of this page:
      </p>
      <ul>
        <li>
          <strong>Hosting.</strong> The website is hosted and delivered by
          Vercel, which processes requests in order to serve pages to you.
        </li>
        <li>
          <strong>Database.</strong> NF Club signup information is stored in a
          database operated for us by Supabase, which processes it on our
          behalf. This applies only if you sign up for NF Club. Nothing from
          Supabase loads in your browser.
        </li>
        <li>
          <strong>Maps.</strong> Some pages include a link to an online map for
          our venue address. Nothing is loaded from a map provider unless you
          choose to click that link, at which point you leave this site and the
          map provider&apos;s own policies apply.
        </li>
      </ul>
      <p>
        We do not embed social media feeds, video players from other websites,
        comment systems or advertising networks on this site.
      </p>

      <h2>Tickets and ticket providers</h2>
      {hasAnyTicketProvider() ? (
        <p>
          Ticket actions on our event pages send you to a third-party ticketing
          provider. That provider is a separate company. When you register or
          buy a ticket there, you are giving your information to them, under
          their terms and their privacy policy, not ours. We do not control
          their privacy practices, and you should read their policy before
          completing a purchase.
        </p>
      ) : (
        <p>
          No ticketing provider is connected to this website yet. Ticket
          actions currently keep you on this site. When we connect a ticketing
          provider, that provider will be a separate company: registering or
          buying a ticket there means giving your information to them, under
          their terms and their privacy policy, not ours. We do not control a
          ticket provider&apos;s privacy practices, and we will update this
          policy when one is connected.
        </p>
      )}

      <h2>Links to other websites</h2>
      <p>
        This site links to websites we do not operate. We are not responsible
        for the content or the privacy practices of those websites, and this
        policy does not apply once you leave this site.
      </p>

      <h2>Where information is processed</h2>
      <p>
        Our hosting and database providers operate infrastructure in more than
        one country, so information involved in delivering this website,
        including NF Club signup information, may be processed or stored
        outside Canada and may be subject to the laws of the country where it
        is processed. We do not claim that information relating to this website
        stays within Canada.
      </p>

      <h2>Consent and withdrawing consent</h2>
      <p>
        Browsing this website does not require you to give us personal
        information, and we do not treat browsing as consent to receive
        marketing.
      </p>
      <p>
        NF Club asks for your consent with a separate checkbox that is never
        ticked for you, and you cannot join without ticking it yourself. You
        can withdraw that consent at any time. Until NF Club emails include an
        unsubscribe link, you can withdraw by contacting us using the details
        at the bottom of this page.
      </p>

      <h2>Marketing communications</h2>
      <p>
        We do not currently send marketing email. When we start sending NF
        Club emails, they will go only to people who joined, every message
        will identify {LEGAL_ENTITY_NAME} and include a working unsubscribe
        link, and unsubscribing will be honoured.
      </p>
      <p>
        When you unsubscribe, we stop sending you marketing email. We do not
        automatically delete your record: we keep it marked as unsubscribed,
        together with your consent history, so we can make sure you are not
        emailed again and can show what you did and did not agree to. If you
        also want your NF Club information deleted, ask us using the details
        below. We may keep the minimum needed to make sure you are not added
        back or contacted again, where the law allows.
      </p>

      <h2>Access, correction and privacy requests</h2>
      <p>
        Under Canadian privacy law you can ask an organization what personal
        information it holds about you, ask for it to be corrected, and
        challenge how it is being handled. If you have not joined NF Club, we
        would generally hold nothing about you from your use of this website.
        If you have, you can ask to see, correct or delete your NF Club
        information.
      </p>
      <p>
        You are still welcome to make a request, and we will respond. If your
        request relates to a ticket purchase, that information is held by the
        ticketing provider rather than by us, and you may need to contact them
        directly.
      </p>

      <h2>Keeping information</h2>
      <p>
        We keep information only as long as we need it for the purpose it was
        collected for, or as long as we are required to keep it. For NF Club,
        that means we keep your signup information while you are on the list,
        and we keep consent and unsubscribe records for as long as we need them
        to show what you agreed to and to respect an unsubscribe.
      </p>

      <h2>Security</h2>
      <p>
        We take reasonable steps to protect the information involved in running
        this website, including keeping the site free of unnecessary
        third-party code. No website or internet transmission can be
        guaranteed to be completely secure, and we do not claim otherwise.
      </p>

      <h2>Children</h2>
      <p>
        Our events are family friendly and children are welcome at them. NF
        Club is not directed at children, and we do not knowingly collect
        personal information from children. If you believe a child has signed
        up, contact us and we will remove their information.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy as the website changes. The date at the top
        of this page shows when it was last updated. If we make a change that
        affects how we handle personal information, we will update this page
        before that change takes effect.
      </p>

      <h2>Contact us about privacy</h2>
      {PRIVACY_CONTACT_EMAIL ? (
        <p>
          For any question or request about this policy, contact{" "}
          {PRIVACY_CONTACT_NAME} at{" "}
          <a href={`mailto:${PRIVACY_CONTACT_EMAIL}`}>
            {PRIVACY_CONTACT_EMAIL}
          </a>
          .{BUSINESS_ADDRESS ? ` You can also write to us at ${BUSINESS_ADDRESS}.` : ""}
        </p>
      ) : (
        <NotYetPublished>
          <p>
            A dedicated privacy contact address for {LEGAL_ENTITY_NAME} is
            being set up and will be published here. Until it appears on this
            page, please reach us through the channel you normally use to
            contact us about our events.
          </p>
        </NotYetPublished>
      )}
      <p>
        If you are not satisfied with how we have handled a privacy question,
        you can contact the Office of the Privacy Commissioner of Canada.
      </p>
    </LegalPage>
  );
}
