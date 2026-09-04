"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Fades and rises a section in once, the first time it enters the viewport.
 * IntersectionObserver only, never a scroll listener. Under
 * prefers-reduced-motion the section simply renders — no transform, no
 * opacity animation — per docs/homepage-concept.md section 15.
 */
export default function RevealOnScroll({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  // Renders visible so content is present with JS disabled and before
  // hydration. Hiding and revealing are both done imperatively on the node:
  // driving this through state was a bug, because the state's initial value
  // is already the revealed one, so setting it again never re-rendered and
  // the imperative `opacity: 0` below was never cleared — every section
  // past the fold stayed permanently invisible.
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      return;
    }

    // Hide imperatively (not via setState) so this effect never calls
    // setState synchronously in its own body — only from the observer's
    // async callback below, once the section actually enters view.
    node.style.opacity = "0";
    node.style.transform = "translateY(14px)";

    const reveal = () => {
      node.style.opacity = "1";
      node.style.transform = "translateY(0)";
      // Lets descendants opt into a scroll-triggered entrance via the
      // .nf-on-reveal-stamp class in globals.css. That selector only matches
      // once this is set, so an element's static styles are what renders
      // when the animation never runs (reduced motion, no JS, this effect
      // bailing out above) — motion is never the only carrier of meaning.
      node.dataset.revealed = "true";
      observer.disconnect();
      window.clearTimeout(fallbackTimer);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) reveal();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(node);

    // Safety net: some environments (privacy tooling, unusual rendering
    // pipelines) never fire IntersectionObserver callbacks. Content must
    // never stay permanently hidden because of an animation, so reveal
    // unconditionally shortly after mount if the observer hasn't already.
    const fallbackTimer = window.setTimeout(reveal, 1200);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: 1,
        transform: "translateY(0)",
        transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
      }}
    >
      {children}
    </div>
  );
}
