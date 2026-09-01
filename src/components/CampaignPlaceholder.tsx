import Image from "next/image";
import type { CampaignPlaceholder as Placeholder } from "@/lib/campaigns";

/**
 * Branded stand-in for a website campaign banner.
 *
 * Rendered as DOM at exactly 16:9 rather than shipped as an image file: an
 * SVG loaded through <img> is an isolated document, so it could reach neither
 * the page's Archivo webfont nor the NF wordmark, and would have fallen back
 * to a generic system font — the opposite of what a branding placeholder is
 * for. This occupies the identical frame a real 1600x900 banner will.
 *
 * It is deliberately obvious that the artwork is not final.
 */
const TONES: Record<
  Placeholder["tone"],
  { surface: string; accent: string; rule: string; glow: string }
> = {
  expo: {
    surface: "bg-brand",
    accent: "text-gold-bright",
    rule: "text-pink-bright",
    glow: "radial-gradient(90% 70% at 50% 118%, #b47cff 0%, transparent 70%)",
  },
  halloween: {
    surface: "bg-ink",
    accent: "text-halloween",
    rule: "text-halloween",
    glow: "radial-gradient(90% 70% at 50% 118%, #ff8a3d 0%, transparent 68%)",
  },
  announcement: {
    surface: "bg-brand-deep",
    accent: "text-cyan-bright",
    rule: "text-cyan-bright",
    glow: "radial-gradient(90% 70% at 50% 118%, #5eead4 0%, transparent 66%)",
  },
};

export default function CampaignPlaceholder({
  placeholder,
  size = "large",
}: {
  placeholder: Placeholder;
  /** Secondary tiles are roughly a third the width, so the content stack
   *  needs its own scale rather than a shrunk copy of the primary. */
  size?: "large" | "small";
}) {
  const tone = TONES[placeholder.tone];
  const s = size === "large";

  return (
    <div
      className={`nf-halftone nf-foil absolute inset-0 flex flex-col items-center justify-center overflow-hidden ${tone.surface}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-55"
        style={{ background: tone.glow }}
      />

      {/* Corner registration marks — print-proof language. */}
      {[
        "top-3 left-3 border-t-2 border-l-2",
        "top-3 right-3 border-t-2 border-r-2",
        "bottom-3 left-3 border-b-2 border-l-2",
        "bottom-3 right-3 border-b-2 border-r-2",
      ].map((pos) => (
        <span
          key={pos}
          aria-hidden="true"
          className={`pointer-events-none absolute border-white/35 ${s ? "h-5 w-5 md:h-8 md:w-8" : "h-3 w-3 md:h-4 md:w-4"} ${pos}`}
        />
      ))}

      <div className={`relative flex flex-col items-center text-center ${s ? "px-6" : "px-3"}`}>
        <Image
          src="/images/brand/logo-wide.png"
          alt=""
          aria-hidden="true"
          width={800}
          height={500}
          className={`hidden h-auto sm:block ${s ? "sm:w-[110px] md:w-[200px]" : "sm:w-[80px] md:w-[104px]"}`}
        />

        <p className={`nf-display leading-[0.95] text-paper ${s ? "mt-2.5 text-[1.15rem] md:mt-6 md:text-[3.4rem]" : "mt-2 text-[1rem] md:mt-3 md:text-[1.5rem]"}`}>
          {placeholder.title}
        </p>

        <div
          aria-hidden="true"
          className={`nf-perforation ${s ? "mt-2.5 w-24 md:mt-7 md:w-72" : "mt-2 w-16 md:mt-3 md:w-28"} ${tone.rule}`}
        />

        <p className={`nf-eyebrow text-paper/85 ${s ? "mt-2.5 text-[8px] md:mt-6 md:text-xs" : "mt-2 text-[7px] md:mt-3 md:text-[9px]"}`}>
          Website campaign banner
        </p>
        <p
          className={`nf-numeral tabular-nums ${s ? "mt-1 text-base md:mt-3 md:text-4xl" : "mt-0.5 text-sm md:mt-1 md:text-xl"} ${tone.accent}`}
        >
          1600 × 900
        </p>

        <span className={`nf-stamp hidden text-paper sm:inline-flex ${s ? "sm:mt-4 md:mt-7 md:text-[11px]" : "sm:mt-3 md:mt-3 md:text-[8px]"}`}>
          Final artwork coming
        </span>
      </div>
    </div>
  );
}
