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

      {/* Bottom scrim only. There used to be a matching one across the top
          for the badges, but both badges carry their own solid fill and
          border, so it bought them no legibility — and on light artwork it
          was actively harmful: over Collectr's cream cork board the
          from-ink/70 wash read as a grey haze band across the top of the
          card, while over the two dark photos it was invisible. That made
          one card look different from its neighbour for a reason that had
          nothing to do with the badges sitting on it. The arrow below has
          no background of its own, so its scrim stays. */}
      <div
        aria-hidden="true"
        className={
          "pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent " +
          (large ? "h-20" : "h-12")
        }
      />

      {/* One segmented tag: show, then campaign kind. No placeholder chip,
          the artwork says so itself.

          Both segments are 10px on every card, large or small. The kind
          chip used to drop to 9px on the secondaries while ShowTag beside
          it stayed at 10px, which left it 1.5px shorter and pushed it
          0.8px down by items-center, so their top edges did not line up.

          They are also flush rather than separated by a gap, because a gap
          is a hole and what shows through it is whatever the artwork
          happens to be. The same 6px read completely differently per card:
          over Halloween's dark photo it merged into the ShowTag and looked
          tight, over Collectr's cream cork board it became a lit slot that
          pushed the two chips apart. Measured they were always identical;
          perceived they were not. Filling the gap with a backing plate
          fixed Collectr but left a visibly darker block sitting on the two
          already-dark artworks, so the gap is removed instead: with the
          chips flush there is nothing for the artwork to show through, and
          the pair reads the same on light and dark alike without adding
          any weight of its own. The dark-to-light seam between the two
          segments is its own divider, so no border is needed there. */}
      <div className="absolute inset-x-0 top-0 flex flex-wrap items-center gap-1.5 p-2 md:p-2.5">
        {/* items-stretch, not items-center: on a narrow secondary card a
            long kind label wraps to two lines, and centering would leave
            the shorter segment floating with the artwork showing above and
            below the seam. Stretching keeps the two halves the same height
            whichever one wraps. */}
        <span className="inline-flex items-stretch">
          <ShowTag
            label={campaign.showTag}
            tone="dark"
            className="rounded-r-none"
          />
          <span className="nf-eyebrow rounded-md rounded-l-none border border-l-0 border-ink/15 bg-brand-soft px-2 py-1 text-[10px] text-ink">
            {campaign.kind}
          </span>
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
