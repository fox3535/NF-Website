import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { GENERAL_CONTACT_EMAIL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "NF Vendor Network: Nostalgia Fest",
  description:
    "The NF Vendor Network is where vendors who have worked with Nostalgia Fest can see their NF history in one place. Access is arranged by Nostalgia Fest.",
  alternates: { canonical: "/vendors" },
};

/**
 * The public face of the Vendor Network. Static: no database call, no session
 * lookup, nothing that a Supabase outage could take down.
 *
 * WHAT THIS PAGE MAY SAY is tightly bounded. Every Passport benefit and every
 * tier threshold in docs/platform-v1-plan.md section C is marked proposed and
 * needs Chris's approval (section P.2), so none of it appears here. What is
 * locked, and therefore sayable: one completed NF booking equals one stamp,
 * stamps are awarded after the event, stamps are lifetime history, and the
 * portal does not replace how bookings actually happen (section P.1, items 2
 * to 6). Do not add a benefit list to this page before section P.2 moves.
 */

// Locked facts only. Nothing here promises an outcome.
const HOW_IT_WORKS = [
  {
    title: "One completed event, one stamp",
    body: "Complete the booking Nostalgia Fest agreed to and it earns a Passport stamp. Stamps are added after the event, never at booking time.",
  },
  {
    title: "Your history stays yours",
    body: "Stamps are a lifetime record of the shows you have completed with Nostalgia Fest. They do not expire and they do not disappear.",
  },
  {
    title: "Booking does not change",
    body: "Tables are still arranged with Nostalgia Fest directly, the same way they are today. The Vendor Network sits alongside that, it does not replace it.",
  },
];

export default function VendorsPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <section
          aria-labelledby="vendors-heading"
          className="nf-halftone relative overflow-hidden bg-brand pt-10 pb-14 text-text-inverse md:pt-16 md:pb-20"
        >
          <div className="relative mx-auto max-w-5xl px-4 md:px-6">
            <p className="nf-eyebrow text-xs text-pink-bright md:text-sm">
              For Nostalgia Fest vendors
            </p>
            <h1
              id="vendors-heading"
              className="nf-display mt-4 max-w-3xl text-[clamp(3rem,13vw,7rem)]"
            >
              The NF <span className="text-gold-bright">Vendor&nbsp;Network</span>
            </h1>
            <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-text-inverse md:text-xl">
              A place for vendors who have worked with Nostalgia Fest to see
              their NF history in one place, through the NF Vendor Passport.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/vendors/login"
                className="nf-action nf-action-gold min-h-13 w-full justify-center px-6 text-lg sm:w-auto"
              >
                Vendor sign in
              </Link>
              <p className="text-sm leading-relaxed text-text-inverse/85">
                Access is arranged by Nostalgia Fest. There is no signup form.
              </p>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="vendors-how-heading"
          className="bg-paper py-14 md:py-20"
        >
          <div className="mx-auto max-w-5xl px-4 md:px-6">
            <h2
              id="vendors-how-heading"
              className="nf-eyebrow text-xs text-brand md:text-sm"
            >
              How the Passport works
            </h2>
            <ol className="mt-6 grid gap-6 sm:grid-cols-3">
              {HOW_IT_WORKS.map((item, index) => (
                <li key={item.title} className="flex flex-col gap-2">
                  <span aria-hidden="true" className="nf-numeral text-5xl text-pink">
                    {index + 1}
                  </span>
                  <h3 className="text-lg font-bold text-text">{item.title}</h3>
                  <p className="text-[15px] leading-relaxed text-text-secondary">
                    {item.body}
                  </p>
                </li>
              ))}
            </ol>

            <div className="mt-10 rounded-xl border-2 border-ink bg-brand-soft p-5 md:p-6">
              <h2 className="text-lg font-bold text-text">
                How to get access
              </h2>
              <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-text-secondary">
                Nostalgia Fest sets up Vendor Network access for vendors it
                works with. If you vend with NF and would like access, speak to
                your usual NF contact
                {GENERAL_CONTACT_EMAIL ? (
                  <>
                    {" "}
                    or email{" "}
                    <a
                      href={`mailto:${GENERAL_CONTACT_EMAIL}`}
                      className="font-semibold text-text underline underline-offset-2 hover:text-brand"
                    >
                      {GENERAL_CONTACT_EMAIL}
                    </a>
                  </>
                ) : null}
                . Already set up?{" "}
                <Link
                  href="/vendors/login"
                  className="font-semibold text-text underline underline-offset-2 hover:text-brand"
                >
                  Sign in
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
