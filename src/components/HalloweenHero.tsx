import Image from "next/image";
import TicketButton from "./TicketButton";
import { halloween2026 } from "@/lib/events";

/**
 * Halloween hero. No approved Halloween campaign art exists yet
 * (references/nf-brand/halloween-2026/ is empty), so this doesn't fabricate
 * a poster the way Expo's hero uses its approved banner. Instead it leans
 * on a real previous-event photo, graded dark and moody rather than the
 * warm/bright treatment that same photo gets elsewhere on the site.
 *
 * SIGNATURE MOMENT 1 — the room before the doors open. The depth comes
 * from stacked layers rather than a single flat image: photograph, two
 * ambient light sources drifting at different speeds, one slow stage wash,
 * film grain, then the type on top of all of it. Every animated layer is
 * decorative, transform/opacity only, and declared inside
 * prefers-reduced-motion: no-preference (see globals.css, Signature 5), so
 * the still composition is the real design.
 */
export default function HalloweenHero() {
  return (
    <section
      aria-label="Nostalgia Fest Halloween"
      className="relative overflow-hidden bg-ink"
    >
      <div className="absolute inset-0">
        <Image
          src="/images/photos/scale-crowd.jpg"
          alt="A wide view of a packed ballroom aisle lined with vendor tables at a previous Nostalgia Fest."
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40 grayscale-[45%]"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink via-ink/88 to-ink/62" />

        {/* Key light, warm, high on the trailing side. */}
        <div
          aria-hidden="true"
          className="nf-lightfield inset-[-12%]"
          style={{
            background:
              "radial-gradient(46% 42% at 78% 14%, rgb(255 138 61 / 34%) 0%, transparent 72%)",
          }}
        />
        {/* Fill light, NF purple, low on the leading side. Out of phase
            with the key light so the field breathes rather than throbs. */}
        <div
          aria-hidden="true"
          className="nf-lightfield nf-lightfield-alt inset-[-12%]"
          style={{
            background:
              "radial-gradient(52% 48% at 14% 88%, rgb(131 46 255 / 40%) 0%, transparent 74%)",
          }}
        />
        <div aria-hidden="true" className="nf-sweep" />
        <div aria-hidden="true" className="nf-grain" />
      </div>

      <div className="relative mx-auto flex min-h-[78svh] max-w-6xl flex-col justify-end px-4 pt-24 pb-14 md:px-6 md:pt-36 md:pb-20">
        <span className="pointer-events-none absolute top-4 right-4 rounded bg-ink/80 px-2 py-1 text-[10px] font-medium text-text-inverse md:top-6 md:right-6">
          Previous Nostalgia Fest event
        </span>

        <p className="nf-eyebrow text-xs text-halloween">
          Nostalgia Fest Halloween
        </p>
        <h1 className="nf-display mt-3 max-w-3xl text-[clamp(2.75rem,10vw,5.5rem)] text-text-inverse">
          Come in costume. Come collect.
        </h1>

        {/* The two dates set at display size: on this page they are the
            single most-repeated fact, and they read as a poster line
            rather than a metadata row. */}
        <p className="nf-display tabular-nums mt-6 text-2xl text-halloween md:text-3xl">
          {halloween2026.dateRange}
        </p>
        <p className="mt-2 text-base text-text-inverse-secondary md:text-lg">
          {halloween2026.venue}, Mississauga
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
          <p className="flex items-center gap-2 text-base font-semibold text-gold-bright">
            <span aria-hidden="true" className="text-lg leading-none">✦</span>
            Free General Admission
          </p>
          <p className="text-sm text-text-inverse-secondary">
            Featuring a major cosplay competition
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <TicketButton
            eventSlug="halloween-2026"
            className="nf-action nf-action-halloween px-7 py-3.5 text-base"
          >
            Get your tickets
            <span aria-hidden="true">→</span>
          </TicketButton>
          <a
            href="#cosplay"
            className="text-sm font-medium text-text-inverse-secondary underline underline-offset-2 hover:text-text-inverse"
          >
            See the cosplay competition
          </a>
        </div>
      </div>
    </section>
  );
}
