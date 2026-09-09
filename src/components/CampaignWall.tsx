import Image from "next/image";
import Link from "next/link";
import CampaignPlaceholder from "./CampaignPlaceholder";
import ShowTag from "./ShowTag";
import {
  campaigns,
  fillsFrame,
  MAX_SECONDARY_CAMPAIGNS,
  type Campaign,
} from "@/lib/campaigns";

/**
 * Campaign wall.
 *
 * Not a carousel — every campaign is visible at once, because a promotion
 * nobody scrolls to is a promotion nobody sees.
 *
 * Each campaign is ONE rectangle: the tags and CTA sit on the artwork rather
 * than in a header strip above it. That is what lets the two columns align
 * exactly, and it keeps the metadata reading as part of the campaign instead
 * of as separate site furniture floating beside it.
 *
 * Alignment: the primary defines the height via its 16:9 ratio; the secondary
 * column stretches to match and splits into two equal rows. The tiles are
 * therefore very slightly wider than 16:9 and use object-cover, which is a
 * better trade than two columns whose bottoms do not line up.
 *
 * Server-rendered: no state, no JS, nothing to hydrate.
 */
function CampaignCard({
  campaign,
  size,
  priority = false,
  id,
  className = "",
}: {
  campaign: Campaign;
  size: "large" | "small";
  priority?: boolean;
  id?: string;
  className?: string;
}) {
  const large = size === "large";

  // Secondary cards sit beside a much bigger primary and read as recessive
  // against the section's own purple background, so they carry a resting
  // frame glow the primary does not: not an overlay on the artwork, a
  // box-shadow on the card itself, so it never competes with the image.
  //
  // The glow is explicitly suppressed while :focus-visible ([&:not(...)])
  // rather than left to compete with it: both are box-shadow, and the
  // sitewide focus ring below needs the property to itself to render
  // reliably for keyboard users.
  const glow = large
    ? ""
    : "[&:not(:focus-visible)]:shadow-[0_0_0_1px_rgba(131,46,255,0.45),0_10px_28px_-10px_rgba(131,46,255,0.6)] [&:not(:focus-visible):hover]:shadow-[0_0_0_1px_rgba(255,201,77,0.4),0_0_0_3px_rgba(131,46,255,0.4),0_14px_32px_-8px_rgba(131,46,255,0.7)]";

  return (
    <Link
      href={campaign.href}
      id={id}
      aria-label={`${campaign.headline}: ${campaign.ctaLabel}`}
      className={
        "group relative block cursor-pointer overflow-hidden rounded-xl bg-brand-deep outline outline-white/10 transition-[outline-color,translate,box-shadow] duration-200 ease-out hover:outline-gold-bright/60 focus-visible:outline-gold-bright focus-visible:ring-4 focus-visible:ring-gold-bright focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep md:hover:-translate-y-1 " +
        glow + " " +
        className
      }
    >
      {campaign.art ? (
        <Image
          src={campaign.art.src}
          alt={campaign.art.alt}
          fill
          priority={priority}
          sizes={
            large
              ? "(min-width: 768px) 66vw, 100vw"
              : "(min-width: 768px) 33vw, 100vw"
          }
          className={
            fillsFrame(campaign.art) ? "object-cover" : "object-contain"
          }
          style={
            campaign.art.focalPosition
              ? { objectPosition: campaign.art.focalPosition }
              : undefined
          }
        />
      ) : campaign.placeholder ? (
        <CampaignPlaceholder placeholder={campaign.placeholder} size={size} />
      ) : null}

      {/* Scrim only where the metadata sits, so the artwork stays readable.
          Fixed pixel heights here would eat a much bigger share of the
          shorter secondary cards than the primary, so they scale by size. */}
      <div
        aria-hidden="true"
        className={
          "pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-ink/70 to-transparent " +
          (large ? "h-24" : "h-14")
        }
      />
      <div
        aria-hidden="true"
        className={
          "pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent " +
          (large ? "h-20" : "h-12")
        }
      />

      {/* Two tags. No placeholder chip — the artwork says so itself. */}
      <div className="absolute inset-x-0 top-0 flex flex-wrap items-center gap-1.5 p-3 md:p-4">
        <ShowTag label={campaign.showTag} tone="dark" />
        <span
          className={
            "nf-eyebrow rounded-md border border-ink/15 bg-brand-soft px-2 py-1 text-ink " +
            (large ? "text-[10px]" : "text-[9px]")
          }
        >
          {campaign.kind}
        </span>
      </div>

      {/* No visible CTA chip: the whole card is the link (aria-label above
          carries the action for assistive tech), so nothing needs to sit on
          top of the artwork to say so. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 bottom-3 flex items-center gap-1 text-sm font-semibold text-paper opacity-80 transition-transform duration-200 ease-out group-hover:translate-x-0.5 md:right-4 md:bottom-4"
      >
        →
      </span>
    </Link>
  );
}

export default function CampaignWall() {
  const [primary, ...rest] = campaigns;
  if (!primary) return null;
  // Enforced, not just documented: extra campaigns are dropped here rather
  // than shrinking every banner to fit. See MAX_SECONDARY_CAMPAIGNS.
  const secondary = rest.slice(0, MAX_SECONDARY_CAMPAIGNS);

  return (
    <section
      aria-label="Nostalgia Fest campaigns"
      className="nf-halftone nf-grid relative overflow-hidden bg-brand-deep pt-5 pb-10 md:pt-6 md:pb-12"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[85%]"
        style={{
          background:
            "radial-gradient(120% 78% at 50% -8%, rgb(131 46 255 / 62%) 0%, rgb(53 9 111 / 40%) 45%, transparent 78%)",
        }}
      />

      <div className="relative mx-auto max-w-[1500px] px-3 md:px-6">
        <div className="grid gap-3 md:grid-cols-[1.9fr_1fr] md:items-stretch md:gap-4">
          {/* Primary sets the height. */}
          <CampaignCard
            campaign={primary}
            size="large"
            priority
            // The mobile sticky ticket bar watches this.
            id="hero-primary-cta"
            className="aspect-16/9 md:aspect-auto md:min-h-[clamp(320px,38vw,560px)]"
          />

          {/* Secondaries split the same height into two equal rows. */}
          <div className="grid gap-3 md:grid-rows-2 md:gap-4">
            {secondary.map((c) => (
              <CampaignCard
                key={c.id}
                campaign={c}
                size="small"
                className="aspect-16/9 md:aspect-auto md:h-full"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
