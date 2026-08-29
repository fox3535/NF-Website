"use client";

import { useEffect, useState } from "react";
import TicketCtaCluster from "./TicketCtaCluster";

/**
 * Mobile-only sticky CTA bar. Appears once the hero's own primary CTA has
 * scrolled out of view, and hides again while the featured-event or final
 * CTA is on screen so two identical actions are never adjacent — per
 * docs/homepage-concept.md section 13.
 */
export default function StickyCta() {
  const [pastHero, setPastHero] = useState(false);
  const [obscured, setObscured] = useState(false);

  useEffect(() => {
    const heroCta = document.getElementById("hero-primary-cta");
    const hideTargets = ["featured-event", "final-cta"]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el instanceof HTMLElement);

    let heroObserver: IntersectionObserver | undefined;
    if (heroCta) {
      heroObserver = new IntersectionObserver(
        ([entry]) => setPastHero(!entry.isIntersecting),
        { threshold: 0 }
      );
      heroObserver.observe(heroCta);
    }

    const intersecting = new Set<Element>();
    const hideObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            intersecting.add(entry.target);
          } else {
            intersecting.delete(entry.target);
          }
        }
        setObscured(intersecting.size > 0);
      },
      { threshold: 0 }
    );
    hideTargets.forEach((el) => hideObserver.observe(el));

    return () => {
      heroObserver?.disconnect();
      hideObserver.disconnect();
    };
  }, []);

  const visible = pastHero && !obscured;

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-border-inverse bg-ink px-4 pt-3 shadow-[0_-4px_16px_rgba(0,0,0,0.2)] transition-transform duration-300 ease-out md:hidden ${
        visible ? "translate-y-0" : "translate-y-full pointer-events-none"
      }`}
      style={{
        paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))",
      }}
    >
      <div className="flex items-center gap-3">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-gold-bright">
          <span aria-hidden="true">✦</span>
          Free
        </p>
        <div className="flex-1">
          <TicketCtaCluster surface="ink" fullWidth showDirections={false} />
        </div>
      </div>
    </div>
  );
}
