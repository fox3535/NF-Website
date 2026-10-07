import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import RevealOnScroll from "./RevealOnScroll";
import { EXPO_GUESTS, type ExpoGuest } from "@/lib/expo-content";

// Server component, prerendered: an image is used only if a supplied file
// exists, so a missing graphic falls back to the text layout, never a broken
// image.
function findImage(stem: string): string | null {
  for (const ext of ["png", "webp", "jpg", "jpeg"]) {
    if (existsSync(path.join(process.cwd(), "public", "images", "guests", `${stem}.${ext}`))) {
      return `/images/guests/${stem}.${ext}`;
    }
  }
  return null;
}

function GuestCard({ guest }: { guest: ExpoGuest }) {
  const src = findImage(guest.imageStem);
  return (
    <article className="nf-halftone relative flex flex-col overflow-hidden rounded-xl bg-brand-deep">
      {src ? (
        <div className="relative aspect-4/5 w-full">
          <Image
            src={src}
            alt={`${guest.name}, ${guest.credit.toLowerCase()}`}
            fill
            sizes="(min-width: 768px) 560px, 100vw"
            className="object-cover"
            loading="lazy"
          />
        </div>
      ) : null}
      <div className="relative flex flex-1 flex-col p-6 md:p-8">
        <span className="nf-stamp w-fit text-[10px] text-pink-bright">Special guest</span>
        <h3 className="nf-display mt-4 text-4xl text-paper md:text-5xl">{guest.name}</h3>
        <p className="mt-2 text-sm text-paper/85 md:text-base">{guest.credit}</p>
        <ul className="mt-6 grid gap-2">
          {guest.appearances.map((a) => (
            <li
              key={a.day}
              className="flex flex-wrap items-baseline justify-between gap-x-4 rounded-lg border border-white/15 bg-white/5 px-4 py-3"
            >
              <span className="nf-eyebrow text-[11px] text-paper">{a.day}</span>
              {a.time ? (
                <span className="tabular-nums text-sm font-semibold text-gold-bright">{a.time}</span>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default function ExpoGuests() {
  return (
    <section
      id="guests"
      aria-labelledby="guests-heading"
      className="relative overflow-hidden bg-ink py-12 md:py-16"
    >
      <RevealOnScroll className="relative mx-auto max-w-6xl px-4 md:px-6">
        <p className="nf-eyebrow text-xs text-pink">Meet the guests</p>
        <h2 id="guests-heading" className="nf-display mt-2 text-4xl text-text-inverse md:text-5xl">
          Special guests at Expo
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2 md:items-stretch">
          {EXPO_GUESTS.map((guest) => (
            <GuestCard key={guest.id} guest={guest} />
          ))}
        </div>
      </RevealOnScroll>
    </section>
  );
}
