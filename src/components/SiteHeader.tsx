import Image from "next/image";
import Link from "next/link";
import MobileNav from "./MobileNav";
import { getTicketHref, expo2026 } from "@/lib/events";
import { NAV_LINKS, TICKET_CTA } from "@/lib/nav";

export default function SiteHeader() {
  return (
    <header
      id="site-header"
      className="static top-0 z-40 border-b-2 border-ink bg-paper md:sticky"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 md:h-20 md:px-6">
        <Link
          href="/"
          className="shrink-0"
          aria-label="Nostalgia Fest home"
        >
          <Image
            src="/images/brand/logo-wide.png"
            alt="Nostalgia Fest"
            width={800}
            height={500}
            className="h-11 w-auto md:h-14"
            priority
          />
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-7 md:flex lg:gap-9"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nf-eyebrow inline-flex min-h-[44px] items-center text-xs text-text hover:text-brand"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={getTicketHref(expo2026)}
            className="nf-action nf-action-filled px-5 py-2.5 text-sm"
          >
            {TICKET_CTA}
            <span aria-hidden="true">→</span>
          </Link>
        </nav>

        <MobileNav />
      </div>
    </header>
  );
}
