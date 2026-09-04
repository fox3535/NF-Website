import Image from "next/image";
import RevealOnScroll from "./RevealOnScroll";
import { EXPO_ANNOUNCEMENTS, type Announcement } from "@/lib/expo-content";

/**
 * "What's happening at Expo" — a campaign module, not information cards.
 *
 * The previous version gave every item the same 4:3 panel and the same
 * centred glyph, so three different announcements read as three identical
 * boxes. Now the first item leads at campaign scale and the rest run as a
 * stacked bulletin beside it, and each tile is built to the frame a real
 * graphic drops into (Announcement.art) the moment one exists.
 *
 * Only confirmed programming renders; a confirmed-but-unrevealed item shows
 * its category and says the reveal is pending rather than inventing it.
 */
const TONES: Record<string, { surface: string; accent: string; glow: string }> =
  {
    Giveaways: {
      surface: "bg-brand",
      accent: "text-gold-bright",
      glow: "radial-gradient(85% 70% at 50% 112%, #ffc94d 0%, transparent 70%)",
    },
    Food: {
      surface: "bg-ink-soft",
      accent: "text-cyan-bright",
      glow: "radial-gradient(85% 70% at 50% 112%, #5eead4 0%, transparent 68%)",
    },
    "Special guest": {
      surface: "bg-brand-deep",
      accent: "text-pink-bright",
      glow: "radial-gradient(85% 70% at 50% 112%, #ffd4f4 0%, transparent 66%)",
    },
  };
const DEFAULT_TONE = TONES.Giveaways;

function Marks() {
  return (
    <>
      {[
        "top-3 left-3 border-t-2 border-l-2",
        "top-3 right-3 border-t-2 border-r-2",
        "bottom-3 left-3 border-b-2 border-l-2",
        "bottom-3 right-3 border-b-2 border-r-2",
      ].map((pos) => (
        <span
          key={pos}
          aria-hidden="true"
          className={`pointer-events-none absolute h-4 w-4 border-white/30 ${pos}`}
        />
      ))}
    </>
  );
}

function LeadTile({ item }: { item: Announcement }) {
  const tone = TONES[item.kind] ?? DEFAULT_TONE;
  return (
    <article
      className={`nf-halftone relative flex min-h-[220px] flex-col justify-end overflow-hidden rounded-xl p-6 md:min-h-full md:p-8 ${tone.surface}`}
    >
      {item.art ? (
        <Image
          src={item.art.src}
          alt={item.art.alt}
          fill
          sizes="(min-width: 768px) 58vw, 92vw"
          className="object-cover"
          loading="lazy"
        />
      ) : (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-75"
            style={{ background: tone.glow }}
          />
          <Marks />
        </>
      )}

      <div className="relative">
        <div className="flex flex-wrap items-center gap-2">
          <span className="nf-eyebrow rounded-md border border-white/30 bg-ink/45 px-2 py-1 text-[10px] text-paper">
            {item.kind}
          </span>
          <span className={`nf-stamp text-[10px] ${tone.accent}`}>
            {item.pending ? "Reveal coming" : "Confirmed"}
          </span>
        </div>
        <p className="nf-display mt-4 text-3xl text-paper md:text-5xl">
          {item.title}
        </p>
        <p className="mt-3 max-w-md text-sm text-paper/85 md:text-base">
          {item.description}
        </p>
      </div>
    </article>
  );
}

function BulletinRow({ item }: { item: Announcement }) {
  const tone = TONES[item.kind] ?? DEFAULT_TONE;
  return (
    <article className="nf-halftone relative flex items-center gap-4 overflow-hidden rounded-xl border border-white/12 bg-white/[0.04] p-4 md:p-5">
      <div
        className={`relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg md:h-20 md:w-20 ${tone.surface}`}
      >
        {item.art ? (
          <Image
            src={item.art.src}
            alt={item.art.alt}
            fill
            sizes="80px"
            className="object-cover"
            loading="lazy"
          />
        ) : (
          <span aria-hidden="true" className={`nf-display text-2xl ${tone.accent}`}>
            {item.pending ? "?" : "✦"}
          </span>
        )}
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="nf-eyebrow text-[10px] text-text-inverse-secondary">
            {item.kind}
          </span>
          <span className={`nf-eyebrow text-[10px] ${tone.accent}`}>
            {item.pending ? "Reveal coming" : "Confirmed"}
          </span>
        </div>
        <p className="nf-display mt-1 text-xl text-paper md:text-2xl">
          {item.title}
        </p>
        <p className="mt-1 text-sm text-text-inverse-secondary">
          {item.description}
        </p>
      </div>
    </article>
  );
}

export default function ExpoAnnouncements() {
  const [lead, ...rest] = EXPO_ANNOUNCEMENTS;
  if (!lead) return null;

  return (
    <section
      id="announcements"
      aria-labelledby="announcements-heading"
      className="nf-halftone relative overflow-hidden bg-ink py-12 md:py-16"
    >
      <RevealOnScroll className="relative mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
          <div>
            <p className="nf-eyebrow text-xs text-pink">On the floor</p>
            <h2
              id="announcements-heading"
              className="nf-display mt-2 text-4xl text-text-inverse md:text-5xl"
            >
              What&apos;s happening at Expo
            </h2>
          </div>
          <p className="text-sm text-text-inverse-secondary">
            More announcements before the show.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-[1.35fr_1fr] md:items-stretch">
          <LeadTile item={lead} />
          <div className="grid content-start gap-4">
            {rest.map((item) => (
              <BulletinRow key={item.id} item={item} />
            ))}
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
