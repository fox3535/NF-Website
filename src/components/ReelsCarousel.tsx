"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { centreOffset, scrollTrackTo } from "@/lib/scroll";
import { INSTAGRAM_URL } from "@/lib/social";

/**
 * NF Reels — a custom vertical-video carousel, split into two rows.
 *
 * Deliberately not an Instagram embed: these are local MP4s we control, hand
 * picked, with no automatic feed. Nothing is fetched until the section is
 * near the viewport; then the active clip in each row autoplays muted and the
 * others load metadata only, so neighbours show a real frame without
 * downloading every video. Hovering an inactive clip previews it muted
 * (pointer devices only); everything pauses when the section leaves the
 * viewport, and only one clip per row is ever playing.
 *
 * PINNED holds the three verified clips we keep permanently featured.
 * LATEST is the browsable rail for newer posts — adding one is a data change
 * (drop the file in public/videos, add a `src` entry below) rather than a
 * component change. Until real clips exist, those slots render a branded
 * placeholder rather than an invented post, and the rail ends in a card that
 * sends visitors to Instagram instead of pretending to be one more Reel.
 */
interface Reel {
  id: string;
  /** Present for a real clip; absent for a not-yet-populated slot. */
  src?: string;
  /** Media fragment seek — gives the browser a usable poster frame without
   *  shipping separate poster images (we have no transcoding tooling). */
  posterAt?: string;
  label: string;
  caption: string;
  /**
   * Testing an alternative card layout (title + descriptor above the video)
   * against the standard one (below), so the two can be compared before
   * standardizing on either. Only NF_JINGLE uses it for now.
   */
  titleAbove?: boolean;
}

const PINNED_REELS: Reel[] = [
  {
    id: "jingle",
    src: "/videos/nf-jingle.mp4",
    posterAt: "#t=4",
    label: "NF JINGLE",
    caption: "The sound of Nostalgia Fest.",
    titleAbove: true,
  },
  {
    id: "snack",
    src: "/videos/snack-guy.mp4",
    posterAt: "#t=6",
    label: "SHAMZ THE SNACK GUY 1",
    caption: "Shamz works the room with a table of exotic snacks",
  },
  {
    id: "mic",
    src: "/videos/on-the-mic.mp4",
    posterAt: "#t=5",
    label: "CARLOS FROM YTV DOING GIVEAWAYS",
    caption: "Carlos runs a giveaway from the mic on the show floor",
  },
];

/**
 * No verified recent clips exist yet — these six slots demonstrate the rail
 * at its intended size. To populate one: add `src`, `posterAt`, `label` and
 * `caption` here, exactly like a PINNED_REELS entry with a real clip.
 */
const LATEST_REELS: Reel[] = Array.from({ length: 6 }, (_, i) => ({
  id: `latest-${i + 1}`,
  label: "LATEST REEL",
  caption: "Content coming.",
}));

function PlayIcon({ playing, size = 18 }: { playing: boolean; size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24">
      {playing ? (
        <path d="M8 5h3v14H8zM13 5h3v14h-3z" fill="currentColor" />
      ) : (
        <path d="M8 5l11 7-11 7z" fill="currentColor" />
      )}
    </svg>
  );
}

function InstagramGlyph() {
  return (
    <svg aria-hidden="true" width="30" height="30" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

/** Branded stand-in for a slot with no clip yet. */
function PlaceholderReel({ reel }: { reel: Reel }) {
  return (
    <div className="nf-case nf-case-ink h-full">
      <div className="nf-case-label text-text-inverse-secondary">
        <span>{reel.label}</span>
        <span className="text-pink-bright">Reel</span>
      </div>
      <div className="nf-halftone relative flex aspect-9/16 flex-col items-center justify-center gap-3 overflow-hidden rounded-xl bg-brand-deep text-center">
        <span aria-hidden="true" className="text-3xl text-gold-bright">
          ✦
        </span>
        <span className="nf-stamp text-pink-bright">Content coming</span>
      </div>
      <div className="px-1 pt-3 pb-1">
        <p className="mt-1 text-sm text-text-inverse-secondary">
          {reel.caption}
        </p>
      </div>
    </div>
  );
}

/** Terminal card — ends the Latest rail by pointing off the website. */
function InstagramCard() {
  const hasUrl = Boolean(INSTAGRAM_URL);

  const panel = (
    <div className="nf-halftone relative flex aspect-9/16 flex-col items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-b from-brand via-brand to-brand-deep px-6 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-pink-bright text-pink-bright">
        <InstagramGlyph />
      </span>
      <p className="nf-display text-2xl text-paper">Want more?</p>
      <p className="text-sm text-paper/85">See the rest on Instagram</p>
      <span className="nf-action nf-action-gold mt-1 px-4 py-2 text-xs">
        {hasUrl ? (
          <>
            Follow along
            <span aria-hidden="true">→</span>
          </>
        ) : (
          "Instagram link coming soon"
        )}
      </span>
    </div>
  );

  return (
    <div className="nf-case nf-case-ink h-full">
      <div className="nf-case-label text-text-inverse-secondary">
        <span>NF on social</span>
        <span className="text-pink-bright">Off-site</span>
      </div>
      {hasUrl ? (
        <a
          href={INSTAGRAM_URL ?? undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open Nostalgia Fest on Instagram (opens in a new tab)"
        >
          {panel}
        </a>
      ) : (
        panel
      )}
    </div>
  );
}

/**
 * One playable row. PINNED and LATEST each get their own instance — every
 * row has independent active/playing/hover state, but shares the section's
 * `seen` / `inView` gates so nothing plays once the whole section scrolls
 * away.
 */
function ReelRow({
  reels,
  seen,
  inView,
  idPrefix,
  heading,
  headingNote,
  showArrows = false,
  trailingCard,
}: {
  reels: Reel[];
  seen: boolean;
  inView: boolean;
  idPrefix: string;
  heading: string;
  /** Small lowercase note appended after the heading, e.g. provenance. */
  headingNote?: string;
  showArrows?: boolean;
  trailingCard?: React.ReactNode;
}) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  // Desktop only: a pointer resting on (or keyboard focus on) an inactive
  // clip previews it muted.
  const [hovered, setHovered] = useState<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const trackRef = useRef<HTMLUListElement>(null);

  // Only the active clip is allowed to play. Everything else is paused and
  // rewound, so scrolling never leaves audio running behind you. `playing`
  // is not set here — it is driven by the elements' own play/pause events
  // below, which keeps it true to what the media is actually doing.
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i !== active) {
        v.pause();
        v.currentTime = 0;
      }
    });

    if (!seen || !inView) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;
    const current = videoRefs.current[active];
    // Muted autoplay for the active clip only. A refusal is fine — the
    // play button is always there.
    if (current?.paused) void current.play().catch(() => undefined);
  }, [active, seen, inView]);

  useEffect(() => {
    if (inView) return;
    videoRefs.current.forEach((v) => v?.pause());
  }, [inView]);

  // Track which card is centred while the user swipes on mobile.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || reels.length < 2) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!best) return;
        const index = cardRefs.current.indexOf(best.target as HTMLLIElement);
        if (index >= 0) setActive(index);
      },
      { root: track, threshold: [0.5, 0.75, 1] }
    );
    cardRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [reels.length]);

  const select = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, reels.length - 1));
    setActive(clamped);
    const track = trackRef.current;
    const card = cardRefs.current[clamped];
    if (!track || !card) return;
    scrollTrackTo(track, centreOffset(track, card));
  }, [reels.length]);

  // Pointer preview: only on devices with real hover, never under reduced
  // motion, and never for the clip already playing.
  function previewOnPointer(index: number) {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    previewOn(index);
  }

  // Keyboard focus previews regardless of pointer capability — a focus
  // event only ever comes from an intentional keyboard/switch interaction,
  // so it gets the same treatment as hover rather than being pointer-gated.
  function previewOn(index: number) {
    if (index === active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setHovered(index);
    const v = videoRefs.current[index];
    if (!v) return;
    v.muted = true;
    void v.play().catch(() => undefined);
  }

  function previewOff(index: number) {
    setHovered((h) => (h === index ? null : h));
    if (index === active) return;
    const v = videoRefs.current[index];
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  }

  function togglePlay(index: number) {
    const v = videoRefs.current[index];
    if (!v) return;
    if (index !== active) select(index);
    if (v.paused) {
      // Autoplay can be refused; the pause/play handlers below record
      // whichever outcome actually happens.
      void v.play().catch(() => undefined);
    } else {
      v.pause();
    }
  }

  function toggleMuted() {
    const v = videoRefs.current[active];
    if (!v) return;
    const next = !muted;
    v.muted = next;
    setMuted(next);
    if (next === false && v.paused) togglePlay(active);
  }

  // +1 accounts for the trailing Instagram card on the Latest rail, which
  // is not part of `reels` but does occupy a slide.
  const slideCount = reels.length + (trailingCard ? 1 : 0);

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between gap-4">
        <p className="nf-eyebrow text-[11px] text-gold-bright">
          {heading}
          {headingNote && (
            <span className="ml-2 normal-case text-text-inverse-secondary">
              · {headingNote}
            </span>
          )}
        </p>
        {showArrows && slideCount > 1 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => select(active - 1)}
              disabled={active === 0}
              aria-label={`Previous ${idPrefix.toLowerCase()} reel`}
              className="nf-action nf-action-outline h-9 w-9 rounded-full text-text-inverse disabled:opacity-35"
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              onClick={() => select(active + 1)}
              disabled={active === slideCount - 1}
              aria-label={`Next ${idPrefix.toLowerCase()} reel`}
              className="nf-action nf-action-outline h-9 w-9 rounded-full text-text-inverse disabled:opacity-35"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        )}
      </div>

      <ul
        ref={trackRef}
        className="mt-5 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] md:gap-7 [&::-webkit-scrollbar]:hidden"
      >
        {reels.map((reel, i) => {
          const isActive = i === active;
          const cardClasses =
            "w-[78%] shrink-0 snap-center transition-[opacity,transform] duration-500 ease-out sm:w-[46%] md:w-[30%] " +
            (reels.length < 2
              ? ""
              : isActive
                ? "opacity-100 md:scale-100"
                : "opacity-65 md:scale-[0.93]");

          if (!reel.src) {
            return (
              <li
                key={reel.id}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className={cardClasses}
              >
                <PlaceholderReel reel={reel} />
              </li>
            );
          }

          return (
            <li
              key={reel.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className={cardClasses}
            >
              <div className="nf-case nf-case-ink h-full">
                {reel.titleAbove ? (
                  <>
                    <div className="nf-case-label text-text-inverse-secondary">
                      <span>{idPrefix}</span>
                      <span className="text-pink-bright">Reel</span>
                    </div>
                    <div className="px-1 pb-3">
                      <p className="nf-display text-lg text-text-inverse">
                        {reel.label}
                      </p>
                      <p className="mt-1 text-sm text-text-inverse-secondary">
                        {reel.caption}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="nf-case-label text-text-inverse-secondary">
                    <span>{idPrefix}</span>
                    <span className="text-pink-bright">Reel</span>
                  </div>
                )}

                <div className="relative aspect-9/16 overflow-hidden rounded-xl bg-brand-deep">
                  <video
                    ref={(el) => {
                      videoRefs.current[i] = el;
                    }}
                    // Only the active card is worth any bandwidth.
                    preload={
                      seen ? (isActive || hovered === i ? "auto" : "metadata") : "none"
                    }
                    src={reel.src + (reel.posterAt ?? "")}
                    muted={muted}
                    playsInline
                    loop
                    onPlay={() => isActive && setPlaying(true)}
                    onPause={() => isActive && setPlaying(false)}
                    onEnded={() => isActive && setPlaying(false)}
                    className="h-full w-full object-cover"
                    aria-label={`${reel.label}. ${reel.caption}. Previous event footage.`}
                  />

                  {/* Significantly more obvious than a passive label: a
                      centred tap target that reads clearly over any poster
                      frame. It fades for pointer/keyboard preview so the
                      muted preview underneath is visible, and returns the
                      moment that preview ends. */}
                  {!isActive && (
                    <button
                      type="button"
                      onClick={() => select(i)}
                      onMouseEnter={() => previewOnPointer(i)}
                      onMouseLeave={() => previewOff(i)}
                      onFocus={() => previewOn(i)}
                      onBlur={() => previewOff(i)}
                      aria-label={`Play ${reel.label}`}
                      className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-t from-ink/80 via-ink/15 to-ink/45 transition-colors duration-200"
                    >
                      <span
                        className={
                          "flex flex-col items-center gap-2.5 transition-opacity duration-200 ease-out " +
                          (hovered === i ? "opacity-0" : "opacity-100")
                        }
                      >
                        <span className="nf-action nf-action-gold h-16 w-16 rounded-full">
                          <PlayIcon playing={false} size={26} />
                        </span>
                        <span className="nf-stamp bg-ink/70 text-gold-bright">
                          Tap to play
                        </span>
                      </span>
                    </button>
                  )}

                  <div className="absolute inset-x-0 bottom-0 z-20 flex items-center gap-2 bg-gradient-to-t from-ink to-transparent p-3">
                    <button
                      type="button"
                      onClick={() => togglePlay(i)}
                      aria-label={
                        isActive && playing
                          ? `Pause ${reel.label}`
                          : `Play ${reel.label}`
                      }
                      className="nf-action nf-action-gold h-11 w-11 shrink-0 rounded-full"
                    >
                      <PlayIcon playing={isActive && playing} />
                    </button>
                    {isActive && (
                      <button
                        type="button"
                        onClick={toggleMuted}
                        className="nf-action nf-action-outline min-h-[44px] px-3 text-[11px] text-text-inverse"
                      >
                        {muted ? "Sound on" : "Sound off"}
                      </button>
                    )}
                  </div>
                </div>

                {!reel.titleAbove && (
                  <div className="px-1 pt-3 pb-1">
                    <p className="nf-display text-lg text-text-inverse">
                      {reel.label}
                    </p>
                    <p className="mt-1 text-sm text-text-inverse-secondary">
                      {reel.caption}
                    </p>
                  </div>
                )}
              </div>
            </li>
          );
        })}

        {trailingCard && (
          <li
            ref={(el) => {
              cardRefs.current[reels.length] = el;
            }}
            className="w-[78%] shrink-0 snap-center sm:w-[46%] md:w-[30%]"
          >
            {trailingCard}
          </li>
        )}
      </ul>
    </div>
  );
}

export default function ReelsCarousel() {
  // Nothing is fetched until the section is actually reached, so a visit
  // that never scrolls this far costs zero video bytes.
  const [seen, setSeen] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // `seen` unlocks metadata loading the first time the section approaches.
  // `inView` is continuous: when the section leaves, everything pauses, so a
  // clip is never decoding audio or video off screen.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.isIntersecting);
        if (visible) setSeen(true);
        setInView(visible);
      },
      { rootMargin: "200px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="nf-reels"
      aria-labelledby="nf-reels-heading"
      className="nf-halftone relative overflow-hidden bg-ink py-16 md:py-24"
    >
      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <p className="nf-eyebrow text-xs text-pink">From the feed</p>
        <h2
          id="nf-reels-heading"
          className="nf-display mt-3 text-4xl text-text-inverse md:text-5xl"
        >
          Catch up with NF
        </h2>

        <ReelRow
          reels={PINNED_REELS}
          seen={seen}
          inView={inView}
          idPrefix="Pinned"
          heading="Pinned reels"
        />

        <ReelRow
          reels={LATEST_REELS}
          seen={seen}
          inView={inView}
          idPrefix="Latest"
          heading="Latest reels"
          showArrows
          trailingCard={<InstagramCard />}
        />
      </div>
    </section>
  );
}
