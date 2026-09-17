import Image from "next/image";
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="bg-ink py-12 text-text-inverse-secondary">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 md:flex-row md:items-start md:justify-between md:px-6">
        <div>
          <Image
            src="/images/brand/logo.png"
            alt="Nostalgia Fest"
            width={140}
            height={140}
            className="h-10 w-auto"
          />
          <p className="mt-4 max-w-xs text-sm">
            A GTA event for trading cards, collectibles, toys, artists and
            pop culture.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-col gap-3 text-sm">
          <Link href="/#upcoming-events" className="inline-flex min-h-[24px] w-fit items-center hover:text-text-inverse">
            Events
          </Link>
          <Link href="/#what-is-nf" className="inline-flex min-h-[24px] w-fit items-center hover:text-text-inverse">
            About
          </Link>
          <Link href="/events/expo-2026#plan-your-visit" className="inline-flex min-h-[24px] w-fit items-center hover:text-text-inverse">
            Plan your visit
          </Link>
        </nav>

        <div className="text-sm">
          <p>Square One Event Hall</p>
          <p>Mississauga, Ontario</p>
        </div>
      </div>

      {/* Legal row. Kept separate from the site navigation above so the
          footer does not turn into one long undifferentiated link list, and
          deliberately just three links: no Cookie Settings entry, because the
          site sets no cookies and runs no optional tracking for a preference
          control to govern (see docs/site-compliance.md). Add one here if and
          when analytics or advertising tracking is actually introduced. */}
      <div className="mx-auto mt-10 flex max-w-6xl flex-col gap-4 border-t border-border-inverse px-4 pt-6 text-xs md:flex-row md:items-center md:justify-between md:px-6">
        <p>© {new Date().getFullYear()} Nostalgia Fest. All rights reserved.</p>

        <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link
            href="/privacy"
            className="inline-flex min-h-[24px] items-center hover:text-text-inverse hover:underline"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="inline-flex min-h-[24px] items-center hover:text-text-inverse hover:underline"
          >
            Terms
          </Link>
          <Link
            href="/refunds"
            className="inline-flex min-h-[24px] items-center hover:text-text-inverse hover:underline"
          >
            Refunds
          </Link>
        </nav>
      </div>
    </footer>
  );
}
