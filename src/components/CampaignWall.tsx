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

  return (
    <Link
      href={campaign.href}
      id={id}
      aria-label={`${campaign.headline}: ${campaign.ctaLabel}`}
      className={
        "group relative block overflow-hidden rounded-xl bg-brand-deep outline outline-white/10 transition-[outline-color,translate] duration-200 ease-out group-hover:outline-gold-bright/60 hover:outline-gold-bright/60 md:hover:-translate-y-1 " +
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
        />
      ) : campaign.placeholder ? (
        <CampaignPlaceholder placeholder={campaign.placeholder} size={size} />
      ) : null}

      {/* Scrim only where the metadata sits, so the artwork stays readable. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink/70 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink/70 to-transparent"
      />

      {/* Two tags. No placeholder chip — the artwork says so itself. */}
      <div className="absolute inset-x-0 top-0 flex flex-wrap items-center gap-1.5 p-3 md:p-4">
        <ShowTag label={campaign.showTag} />
        <span
          className={
            "nf-eyebrow rounded-md border border-white/25 bg-ink/50 px-2 py-1 text-pink-bright " +
            (large ? "text-[10px]" : "text-[9px]")
          }
        >
          {campaign.kind}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex justify-end p-3 md:p-4">
        <span
          className={
            "nf-action nf-action-gold group-hover:bg-pink-bright " +
            (large ? "px-4 py-2 text-sm" : "px-3 py-1.5 text-xs")
          }
        >
          {campaign.ctaLabel}
          <span aria-hidden="true">→</span>
        </span>
      </div>
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
