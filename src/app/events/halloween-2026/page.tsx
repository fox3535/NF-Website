import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { halloween2026 } from "@/lib/events";

export const metadata: Metadata = {
  title: "Nostalgia Fest Halloween: October 31 to November 1, 2026",
  description:
    "Nostalgia Fest Halloween details are coming soon. Free general admission, October 31 to November 1, 2026 at Square One Event Hall.",
};

/**
 * Minimal placeholder — see src/app/events/expo-2026/page.tsx for why this
 * exists instead of a full event page.
 */
export default function Halloween2026Page() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-20 text-center md:py-32">
        <p className="text-sm font-semibold tracking-wide text-brand uppercase">
          {halloween2026.shortName}
        </p>
        <h1 className="mt-3 text-3xl font-bold text-text md:text-4xl">
          Halloween details are coming soon
        </h1>
        <p className="tabular-nums mt-4 text-lg text-text-secondary">
          {halloween2026.dateRange} · {halloween2026.venue}
        </p>
        <p className="mt-2 flex items-center justify-center gap-2 text-base font-semibold text-gold">
          <span aria-hidden="true">✦</span>
          Free admission
        </p>
        <p className="mt-6 text-text-secondary">
          More details will be posted here as the event gets closer.
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
