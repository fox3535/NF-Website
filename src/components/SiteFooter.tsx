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
          <Link href="/#category-band" className="inline-flex min-h-[24px] w-fit items-center hover:text-text-inverse">
            About
          </Link>
          <Link href="/#plan-your-visit" className="inline-flex min-h-[24px] w-fit items-center hover:text-text-inverse">
            Plan your visit
          </Link>
        </nav>

        <div className="text-sm">
          <p>Square One Event Hall</p>
          <p>Mississauga, Ontario</p>
        </div>
      </div>

      <p className="mx-auto mt-10 max-w-6xl px-4 text-xs md:px-6">
        © {new Date().getFullYear()} Nostalgia Fest. All rights reserved.
      </p>
    </footer>
  );
}
