import Image from "next/image";
import PhotoBadge from "./PhotoBadge";
import TicketCtaCluster from "./TicketCtaCluster";
import { expo2026 } from "@/lib/events";

// Every verified photograph in the library is portrait (this one is
// 1536x2048). Stretching it edge-to-edge across a landscape desktop hero
// upscaled it and read visibly soft, so the desktop hero is now a layered
// composition: the image is presented at its own aspect ratio, at a size its
// resolution genuinely supports, inside a collectible-style frame.
const HERO_IMAGE = {
  src: "/images/photos/hero-crowd.jpg",
  alt: "Glass display cases of trading cards in the foreground with a packed, chandelier-lit ballroom behind them at a previous Nostalgia Fest.",
};

function FreeMarker({ className = "" }: { className?: string }) {
  return (
    <p
      className={
        "flex items-center gap-2 text-base font-semibold text-gold-bright " +
        className
      }
    >
      <span aria-hidden="true" className="text-lg leading-none">
        ✦
      </span>
      Free admission
    </p>
  );
}

function HeroCopy({ compact = false }: { compact?: boolean }) {
  return (
    <>
      <p
        className={
          "nf-eyebrow text-pink " + (compact ? "text-[11px]" : "text-xs")
        }
      >
        {expo2026.shortName}
      </p>
      <h1
        className={
          "nf-display mt-3 max-w-[15ch] text-text-inverse " +
          (compact ? "text-[2.25rem]" : "text-5xl lg:text-6xl")
        }
      >
        Trading cards, toys and collectibles under one roof
      </h1>
      <div
        aria-hidden="true"
        className="nf-perforation mt-5 max-w-md text-pink"
      />
      <p
        className={
          "tabular-nums mt-4 text-text-inverse-secondary " +
          (compact ? "text-base" : "text-lg")
        }
      >
        {expo2026.dateRange}
        {compact ? <br /> : " · "}
        {expo2026.venue}, Mississauga
      </p>
      <FreeMarker className="mt-3" />
    </>
  );
}

export default function Hero() {
  return (
    <section aria-label="Hero" className="relative overflow-hidden bg-ink">
      {/* Brand-colour wash behind the composition — flat, not a gradient. */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 hidden w-1/2 bg-brand-deep md:block"
      />

      {/* Desktop: layered two-column composition. */}
      <div className="relative mx-auto hidden max-w-6xl items-center gap-12 px-6 py-12 md:flex lg:gap-16 lg:px-10">
        <div className="min-w-0 flex-1">
          <Image
            src="/images/brand/logo-wide.png"
            alt="Nostalgia Fest"
            width={800}
            height={500}
            priority
            className="mb-6 h-auto w-[220px]"
          />
          <HeroCopy />
          <div className="mt-7">
            <TicketCtaCluster surface="ink" />
          </div>
        </div>

        <div className="w-[36%] max-w-[380px] shrink-0">
          <div className="nf-slab nf-slab-ink">
            <div className="relative aspect-3/4 overflow-hidden rounded-lg">
              <Image
                src={HERO_IMAGE.src}
                alt={HERO_IMAGE.alt}
                fill
                priority
                sizes="420px"
                className="object-cover"
                style={{ objectPosition: "50% 62%" }}
              />
              <PhotoBadge className="text-[10px]" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: two-zone — photo, then a solid ink panel that guarantees
          contrast. Retained from the locked concept. */}
      <div className="md:hidden">
        {/* Sized so the primary CTA still clears the fold on a 667px-tall
            phone: photo + panel + header must stay under the viewport. */}
        <div className="relative h-[22vh] max-h-[240px] min-h-[150px] w-full overflow-hidden">
          <Image
            src={HERO_IMAGE.src}
            alt={HERO_IMAGE.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: "50% 72%" }}
          />
          <PhotoBadge className="right-3 bottom-3 left-auto text-[10px]" />
        </div>
        <div className="relative px-4 pt-5 pb-6">
          <Image
            src="/images/brand/logo-wide.png"
            alt="Nostalgia Fest"
            width={800}
            height={500}
            priority
            className="mb-3 h-auto w-[142px]"
          />
          <HeroCopy compact />
          <div id="hero-primary-cta" className="mt-6">
            <TicketCtaCluster surface="ink" fullWidth />
          </div>
        </div>
      </div>
    </section>
  );
}
