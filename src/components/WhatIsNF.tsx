"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * "What is Nostalgia Fest?" — brand explainer as one tight composition.
 *
 * Heading, category run and photography sit in a single two-column block
 * rather than drifting apart down the page, so the eye moves headline →
 * categories → imagery without hunting.
 *
 * Hovering, focusing or tapping a category shifts it, flips it to gold and
 * reveals a small stamp; where a category has a matching photograph, that
 * photograph comes forward in the stack, and the description below the list
 * swaps to match. Pointer, keyboard and touch all drive the same state, so
 * nothing is hover-only information.
 */
/**
 * One visual per category.
 *
 * `photo` is used only where verified NF photography genuinely shows that
 * category. We have no confirmed sports-card or comics photograph, so those
 * two get a designed NF panel instead of a mislabelled crowd shot — naming an
 * unrelated photo "Sports cards" would be exactly the kind of false
 * specificity Product Rule 3 rules out.
 */
interface Category {
  name: string;
  /** Verified photograph for this category, when one honestly exists. */
  photo?: number;
  stamp: string;
  /** Shown beneath the list for this category — 1–2 sentences, no invented
   *  vendors, quantities, guests or programming beyond what's given here. */
  description: string;
}

const CATEGORIES: Category[] = [
  {
    name: "Trading cards",
    photo: 0,
    stamp: "Singles & sealed",
    description:
      "Pokémon and One Piece anchor the floor, alongside vendors carrying Gundam, Riftbound, Dragon Ball, Magic: The Gathering, Yu-Gi-Oh! and plenty more.",
  },
  {
    name: "Sports cards",
    stamp: "Rookies & inserts",
    description:
      "Rookies, inserts and vintage sets move across the tables all weekend, alongside graded slabs for collectors chasing something specific.",
  },
  {
    name: "Toys & figures",
    photo: 3,
    stamp: "Boxed & loose",
    description:
      "Boxed and loose figures fill tables throughout the floor, from vintage finds to today's releases.",
  },
  {
    name: "Comics",
    stamp: "Back issues",
    description:
      "Back issues and long boxes sit alongside the rest of the floor for anyone digging for a specific run.",
  },
  {
    name: "Original art & artists",
    photo: 1,
    stamp: "Artist alley",
    description:
      "Artist alley brings original art, prints and commissions from creators working the room in person.",
  },
  {
    name: "Collectibles",
    photo: 2,
    stamp: "Cases & binders",
    description:
      "Cases and binders hold everything from pins and plush to graded pieces collectors bring specifically to trade.",
  },
  {
    name: "Pop culture & nostalgia",
    photo: 4,
    stamp: "The whole floor",
    description:
      "The whole floor leans into the shows, games and toys that shaped growing up — the feeling behind every table, not just one.",
  },
];

/** Shown when nothing is hovered or focused. */
const DEFAULT_DESCRIPTION =
  "Nostalgia Fest brings collectors, vendors, artists and families together under one roof for a weekend of trading cards, toys, comics and the collectibles that keep nostalgia alive.";

/** Resting visual when nothing is hovered or focused. */
const DEFAULT_PHOTO = 0;

const PHOTOS = [
  {
    src: "/images/photos/hero-crowd.jpg",
    label: "Cards",
    alt: "Glass display cases of trading cards with a packed ballroom behind them at a previous Nostalgia Fest.",
    position: "50% 68%",
  },
  {
    src: "/images/photos/artists-marvin.jpg",
    label: "Artists",
    alt: "An artist showing original artwork to a visitor at a previous Nostalgia Fest artist-alley table.",
    position: "40% 40%",
  },
  {
    src: "/images/photos/deal-cassy.jpg",
    label: "Trades",
    alt: "A vendor showing a binder of trading cards to a customer at their table.",
    position: "50% 50%",
  },
  {
    src: "/images/photos/family-artist-alley.jpg",
    label: "Toys",
    alt: "A table of plush toys and collectibles being browsed at a previous Nostalgia Fest.",
    position: "50% 55%",
  },
  {
    src: "/images/photos/scale-crowd.jpg",
    label: "The floor",
    alt: "A wide view of a packed ballroom aisle lined with vendor tables at a previous Nostalgia Fest.",
    position: "50% 50%",
  },
];

export default function WhatIsNF() {
  const [active, setActive] = useState<number | null>(null);
  // With nothing hovered the frame rests on the trading-cards photograph.
  const activePhoto =
    active === null ? DEFAULT_PHOTO : (CATEGORIES[active].photo ?? null);
  const shown =
    active === null
      ? {
          label: PHOTOS[DEFAULT_PHOTO].label,
          stamp: CATEGORIES[0].stamp,
          description: DEFAULT_DESCRIPTION,
        }
      : {
          label: CATEGORIES[active].name,
          stamp: CATEGORIES[active].stamp,
          description: CATEGORIES[active].description,
        };
  const shownCaption =
    activePhoto === null
      ? "Photography for this category is still to come."
      : PHOTOS[activePhoto].alt;

  return (
    <section
      id="what-is-nf"
      aria-labelledby="what-is-nf-heading"
      className="nf-halftone relative overflow-hidden bg-brand py-14 text-paper md:py-20"
    >
      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <div className="md:grid md:grid-cols-12 md:gap-10">
          {/* Headline + interactive category run. */}
          <div className="md:col-span-7">
            <p className="nf-eyebrow text-xs text-gold-bright">
              What is Nostalgia Fest?
            </p>
            <h2
              id="what-is-nf-heading"
              className="nf-display mt-3 text-[2.6rem] leading-[0.92] md:text-[4rem]"
            >
              A room full of the things you grew up on
            </h2>

            <ul className="mt-8 md:mt-10" onMouseLeave={() => setActive(null)}>
              {CATEGORIES.map((cat, i) => {
                const isActive = active === i;
                const dimmed = active !== null && !isActive;
                return (
                  <li key={cat.name}>
                    <button
                      type="button"
                      // Not a link — it drives the photo stack and the
                      // description below it, nothing more. onClick covers
                      // touch: there's no hover on mobile, so a tap is what
                      // sets the active category there.
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onBlur={() => setActive(null)}
                      onClick={() => setActive(i)}
                      className={
                        "nf-display flex w-full items-baseline gap-3 py-0.5 text-left text-[1.9rem] leading-[1.05] transition-[translate,color,opacity] duration-200 ease-out md:text-[2.6rem] " +
                        (isActive
                          ? "translate-x-2 text-gold-bright opacity-100"
                          : dimmed
                            ? "text-paper opacity-40"
                            : "text-paper opacity-100")
                      }
                    >
                      {/* Tab marker — the little gold pull on the edge of a
                          divider card. Grows in only on the active row. */}
                      <span
                        aria-hidden="true"
                        className={
                          "mt-[0.45em] h-[0.5em] w-1 shrink-0 rounded-full bg-gold-bright transition-[scale,opacity] duration-200 ease-out " +
                          (isActive
                            ? "scale-y-100 opacity-100"
                            : "scale-y-0 opacity-0")
                        }
                      />
                      <span>{cat.name}</span>
                      {/* Descriptor rides in with the active category. Purely
                          additive — the category name is always present. */}
                      <span
                        aria-hidden="true"
                        className={
                          "nf-eyebrow hidden shrink-0 rounded border border-current px-1.5 py-0.5 text-[9px] transition-[opacity,translate] duration-200 ease-out md:inline-block " +
                          (isActive
                            ? "translate-x-0 opacity-100"
                            : "-translate-x-1 opacity-0")
                        }
                      >
                        {cat.stamp}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Keyed so a category change remounts this node and replays the
                fade — same beat as the photo crossfade opposite it. */}
            <p
              key={active ?? "default"}
              className="nf-copy-swap mt-8 max-w-md text-lg text-paper"
            >
              {shown.description}
            </p>
          </div>

          {/* One display slab that crossfades to the active category's
              visual, rather than seven photographs on screen at once. */}
          <div className="mt-10 md:col-span-5 md:mt-0">
            <figure className="nf-case nf-foil md:sticky md:top-24">
              <div className="nf-case-label text-text-secondary">
                <span>{shown.label}</span>
                <span className="text-brand">{shown.stamp}</span>
              </div>

              <div className="relative aspect-4/5 overflow-hidden rounded-lg bg-brand-deep">
                {PHOTOS.map((p, i) => (
                  <Image
                    key={p.src}
                    src={p.src}
                    alt={p.alt}
                    fill
                    sizes="(min-width: 768px) 40vw, 92vw"
                    className={
                      "object-cover transition-opacity duration-300 ease-out " +
                      (activePhoto === i ? "opacity-100" : "opacity-0")
                    }
                    style={{ objectPosition: p.position }}
                    priority={i === DEFAULT_PHOTO}
                    loading={i === DEFAULT_PHOTO ? undefined : "lazy"}
                  />
                ))}

                {/* Categories with no verified photograph get a designed NF
                    panel instead of a mislabelled one. */}
                <div
                  className={
                    "nf-halftone absolute inset-0 flex flex-col items-center justify-center gap-3 bg-brand-deep text-center transition-opacity duration-300 ease-out " +
                    (activePhoto === null && active !== null
                      ? "opacity-100"
                      : "pointer-events-none opacity-0")
                  }
                >
                  <span aria-hidden="true" className="text-3xl text-gold-bright">
                    ✦
                  </span>
                  <p className="nf-display px-6 text-3xl text-paper">
                    {active !== null ? CATEGORIES[active].name : ""}
                  </p>
                  <span className="nf-stamp text-pink-bright">
                    Photography coming
                  </span>
                </div>
              </div>

              <figcaption className="px-1 pt-3 pb-1 text-sm text-text-secondary">
                {shownCaption}
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
