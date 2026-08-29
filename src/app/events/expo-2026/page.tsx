import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { expo2026 } from "@/lib/events";

export const metadata: Metadata = {
  title: "Nostalgia Fest Expo — October 9–11, 2026",
  description:
    "Nostalgia Fest Expo details and free tickets are coming soon. Free general admission, October 9–11, 2026 at Square One Event Hall, Mississauga.",
};

/**
 * Minimal placeholder — the full Expo 2026 event page (programming, FAQ,
 * ticketing integration) is explicitly out of scope for this homepage
 * pass. This exists only so homepage links have somewhere real to go
 * instead of a dead link, per docs/homepage-concept.md section 5.
 */
export default function Expo2026Page() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-20 text-center md:py-32">
        <p className="text-sm font-semibold tracking-wide text-brand uppercase">
          {expo2026.shortName}
        </p>
        <h1 className="mt-3 text-3xl font-bold text-text md:text-4xl">
          Full Expo details are coming soon
        </h1>
        <p className="tabular-nums mt-4 text-lg text-text-secondary">
          {expo2026.dateRange} · {expo2026.venue}, Mississauga
        </p>
        <p className="mt-2 flex items-center justify-center gap-2 text-base font-semibold text-gold">
          <span aria-hidden="true">✦</span>
          Free admission
        </p>
        <p className="mt-6 text-text-secondary">
          Free tickets and the full event guide will be available here
          before the show. Check back soon, or head home for what we know
          today.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-lg bg-brand px-6 py-3 text-base font-semibold text-text-inverse"
        >
          Back to the homepage
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
