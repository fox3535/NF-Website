import type { ReactNode } from "react";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import { LEGAL_LAST_UPDATED } from "@/lib/legal";

/**
 * Shared shell for /privacy, /terms and /refunds.
 *
 * These are reading pages, not marketing pages, so the NF visual language is
 * used at its quietest: the ink header strip and the display face for the
 * H1, then plain paper and body type for everything after it. No slabs, no
 * foil, no halftone, no reveal animation. Someone looking for a refund rule
 * should find it, not admire it.
 *
 * The measure is capped at 68ch (better-typography: 60 to 75 characters) and
 * the type is left at browser-default body size, because this is long-form
 * reading rather than UI.
 */
export default function LegalPage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        {/* A div, not a <header>. A <header> here is a descendant of <main>,
            which per ARIA-in-HTML should make it generic, but browsers
            disagree: this one exposed it as a second `banner` landmark
            alongside SiteHeader's, and two banners on one page break landmark
            navigation for screen reader users. The heading carries the
            structure, so the element does not need to. */}
        <div className="bg-ink py-12 md:py-16">
          <div className="mx-auto max-w-[68ch] px-4 md:px-6">
            <p className="nf-eyebrow text-xs text-pink">{eyebrow}</p>
            <h1 className="nf-display mt-3 text-4xl text-text-inverse md:text-5xl">
              {title}
            </h1>
            <p className="mt-4 text-text-inverse-secondary">{intro}</p>
            <p className="mt-6 text-sm text-text-inverse-secondary">
              Last updated:{" "}
              <time dateTime="2026-09-18">{LEGAL_LAST_UPDATED}</time>
            </p>
          </div>
        </div>

        {/*
          The prose rules live here rather than on every heading and
          paragraph in three files: one place to adjust reading rhythm, and
          no chance of the three pages drifting apart.

          Spacing is set with margins on the elements themselves rather than
          space-y on the container, so a section that needs to break the
          rhythm can, without fighting a parent selector.
        */}
        <div className="bg-paper py-12 md:py-16">
          <div
            className="
              mx-auto max-w-[68ch] px-4 text-text md:px-6
              [&_a]:text-brand [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-brand-strong
              [&_h2]:nf-display [&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:text-text md:[&_h2]:text-3xl
              [&_h2:first-child]:mt-0
              [&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-text
              [&_p]:mt-4 [&_p]:leading-relaxed [&_p]:text-text-secondary
              [&_ul]:mt-4 [&_ul]:space-y-2 [&_ul]:pl-5
              [&_li]:list-disc [&_li]:leading-relaxed [&_li]:text-text-secondary
              [&_strong]:font-semibold [&_strong]:text-text
            "
          >
            {children}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

/**
 * A pending item: something the policy genuinely does not cover yet.
 *
 * Used instead of writing a rule that has not been decided. It reads as a
 * deliberate "not published yet" rather than an oversight, and it is
 * visually distinct from the surrounding prose without being alarming.
 */
export function NotYetPublished({ children }: { children: ReactNode }) {
  return (
    <div className="mt-6 rounded-lg border border-border bg-paper-strong p-5">
      <p className="nf-eyebrow text-[10px] text-brand">Not published yet</p>
      <div className="[&_p]:mt-2 [&_p:first-of-type]:mt-2">{children}</div>
    </div>
  );
}
