import Image from "next/image";
import Link from "next/link";
import MobileNav from "./MobileNav";
import { getTicketHref, expo2026 } from "@/lib/events";

export default function SiteHeader() {
  return (
    <header
      id="site-header"
      className="static top-0 z-40 border-b-2 border-ink bg-paper md:sticky"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:h-20 md:px-6">
        <Link href="/" className="flex items-center" aria-label="Nostalgia Fest home">
          <Image
            src="/images/brand/logo-wide.png"
            alt="Nostalgia Fest"
            width={800}
            height={500}
            className="h-10 w-auto md:h-12"
            priority
          />
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-8 md:flex"
        >
          <Link
            href="/#upcoming-events"
            className="nf-eyebrow inline-flex min-h-[44px] items-center text-xs text-text hover:text-brand"
          >
            Events
          </Link>
          <Link
            href="/#category-band"
            className="nf-eyebrow inline-flex min-h-[44px] items-center text-xs text-text hover:text-brand"
          >
            About
          </Link>
          <Link
            href={getTicketHref(expo2026)}
            className="nf-action nf-action-filled px-5 py-2.5 text-sm"
          >
            {expo2026.ctaLabel}
            <span aria-hidden="true">→</span>
          </Link>
        </nav>

        <MobileNav />
      </div>
    </header>
  );
}
