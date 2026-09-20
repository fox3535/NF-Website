import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import VendorLoginForm from "./VendorLoginForm";

export const metadata: Metadata = {
  title: "Vendor sign in: NF Vendor Network",
  description:
    "Sign in to the Nostalgia Fest Vendor Network with a one time email link.",
  alternates: { canonical: "/vendors/login" },
  // A private area. Keep it out of search results entirely.
  robots: { index: false, follow: false },
};

// Notices the auth callback and the sign-out action can hand back. Neither
// says anything about the account: an expired link, an already used link and
// a link opened in another browser all produce the same message, because the
// fix for all three is to request a new one.
const NOTICES: Record<string, string> = {
  "link-invalid":
    "That sign in link did not work. Links expire, work once, and open in the browser that asked for them. Request a new one below.",
  "signed-out": "You are signed out.",
};

export default async function VendorLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string }>;
}) {
  const { state } = await searchParams;
  const notice = state ? NOTICES[state] : undefined;

  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <section
          aria-labelledby="vendor-login-heading"
          className="nf-halftone relative overflow-hidden bg-brand pt-10 pb-16 text-text-inverse md:pt-16 md:pb-24"
        >
          <div className="relative mx-auto grid max-w-5xl gap-8 px-4 md:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:gap-14">
            <div className="lg:pt-6">
              <p className="nf-eyebrow text-xs text-pink-bright md:text-sm">
                NF Vendor Network
              </p>
              <h1
                id="vendor-login-heading"
                className="nf-display mt-4 text-[clamp(3rem,12vw,6.5rem)]"
              >
                Vendor <span className="text-gold-bright">sign&nbsp;in</span>
              </h1>
              <p className="mt-4 max-w-lg text-[17px] leading-relaxed text-text-inverse md:mt-5 md:text-xl">
                Enter your email and Nostalgia Fest will send you a one time
                sign in link. No password to remember.
              </p>
              <p className="mt-6 text-sm leading-relaxed text-text-inverse/85">
                New to the Vendor Network?{" "}
                <Link
                  href="/vendors"
                  className="font-semibold underline underline-offset-2 hover:text-gold-bright"
                >
                  Read what it is
                </Link>
                .
              </p>
            </div>

            <div className="nf-case relative text-text">
              <div className="nf-case-label text-text-secondary">
                <span>
                  Vendor Network{" "}
                  <span aria-hidden="true" className="text-brand">
                    ✦
                  </span>{" "}
                  Sign in
                </span>
              </div>
              <div className="flex flex-col gap-5 rounded-xl border-2 border-ink bg-paper p-4 sm:p-6">
                {notice ? (
                  <p
                    role="status"
                    className="rounded-lg border-2 border-ink bg-brand-soft px-4 py-3 text-sm leading-relaxed font-semibold text-text"
                  >
                    {notice}
                  </p>
                ) : null}
                <VendorLoginForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
