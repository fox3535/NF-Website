import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { GENERAL_CONTACT_EMAIL } from "@/lib/legal";
import { signOutVendor } from "@/lib/vendors/auth";
import { getVendorAccess } from "@/lib/vendors/session";

export const metadata: Metadata = {
  title: "Vendor dashboard: NF Vendor Network",
  robots: { index: false, follow: false },
};

// Per request, always. There is a session on it and a database read behind
// it, and neither may ever be cached or prerendered.
export const dynamic = "force-dynamic";

/**
 * Phase 3A: the authenticated shell, and nothing more.
 *
 * Its whole job is to prove the authorisation chain works end to end: a
 * signed-in vendor sees their own business name and their own lifetime stamp
 * count, read under Row Level Security, and nobody else's.
 *
 * NOT HERE YET, and deliberately: the stamp timeline, tier progress, benefit
 * lists, opportunities, profile editing. Those are Phase 3B onward, and most
 * of the wording they need is still unapproved (docs/platform-v1-plan.md
 * section P.2).
 *
 * The page never receives a vendor id. There is no route param, no query
 * string and no hidden field carrying identity: getVendorAccess() derives
 * everything from the session, and the database decides what that session can
 * see.
 */
export default async function VendorDashboardPage() {
  const access = await getVendorAccess();

  if (access.status === "signed-out") redirect("/vendors/login");

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="bg-paper">
        <div className="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-16">
          {access.status === "active" ? (
            <VendorShell
              businessName={access.session.businessName}
              email={access.session.email}
              stampCount={access.session.stampCount}
            />
          ) : (
            <NoAccessNotice />
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function VendorShell({
  businessName,
  email,
  stampCount,
}: {
  businessName: string;
  email: string;
  stampCount: number;
}) {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <p className="nf-eyebrow text-xs text-brand md:text-sm">
          NF Vendor Network
        </p>
        <h1 className="nf-display text-[clamp(2.5rem,9vw,4.5rem)] text-text">
          {businessName}
        </h1>
        <p className="text-sm text-text-secondary">
          Signed in as <span className="font-semibold text-text">{email}</span>
        </p>
      </header>

      <section
        aria-labelledby="passport-heading"
        className="rounded-xl border-2 border-ink bg-brand p-5 text-text-inverse md:p-7"
      >
        <h2 id="passport-heading" className="nf-eyebrow text-xs text-pink-bright md:text-sm">
          NF Vendor Passport
        </h2>
        <p className="nf-numeral mt-3 text-6xl text-gold-bright md:text-7xl">
          {stampCount}
        </p>
        <p className="mt-1 text-lg font-bold">
          {stampCount === 1 ? "Lifetime stamp" : "Lifetime stamps"}
        </p>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-text-inverse/90">
          One fully completed Nostalgia Fest booking earns one stamp, added
          after the event. Stamps are a lifetime record and do not expire.
        </p>
      </section>

      <section className="rounded-xl border-2 border-dashed border-border p-5 md:p-6">
        <h2 className="text-lg font-bold text-text">More is on the way</h2>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-text-secondary">
          Your stamp history and your vendor profile are being built next. If a
          stamp looks wrong, speak to your usual NF contact
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
          .
        </p>
      </section>

      <SignOutButton />
    </div>
  );
}

/**
 * The neutral state: a valid session with no approved vendor relationship.
 *
 * It says nothing about why. Whether a profile exists, whether it is pending
 * verification, whether it was rejected and what the internal standing is are
 * all private (docs/platform-v1-plan.md section H), and a vendor is never
 * shown a standing label or a reason. One route out: talk to a person.
 */
function NoAccessNotice() {
  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <p className="nf-eyebrow text-xs text-brand md:text-sm">NF Vendor Network</p>
      <h1 className="nf-display text-[clamp(2.25rem,8vw,3.75rem)] text-text">
        Access not available
      </h1>
      <p className="text-base leading-relaxed text-text-secondary">
        This account does not currently have NF Vendor Network access.
        Nostalgia Fest sets up access for vendors it works with, so if you
        think this is wrong, speak to your usual NF contact
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
        .
      </p>
      <p className="text-sm leading-relaxed text-text-secondary">
        Signed in with a different address?{" "}
        <Link
          href="/vendors"
          className="font-semibold text-text underline underline-offset-2 hover:text-brand"
        >
          About the Vendor Network
        </Link>
      </p>
      <SignOutButton />
    </div>
  );
}

// A form, not a link: signing out changes state, so it must not be reachable
// by a GET that a prefetch or a crawler could trigger.
function SignOutButton() {
  return (
    <form action={signOutVendor}>
      <button
        type="submit"
        className="nf-action nf-action-outline min-h-12 w-full justify-center px-6 sm:w-auto"
      >
        Sign out
      </button>
    </form>
  );
}
