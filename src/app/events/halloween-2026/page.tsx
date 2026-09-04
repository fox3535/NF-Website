import type { Metadata } from "next";
import CosplayCompetition from "@/components/CosplayCompetition";
import HalloweenAnnouncements from "@/components/HalloweenAnnouncements";
import HalloweenAtmosphere from "@/components/HalloweenAtmosphere";
import HalloweenExploreFloor from "@/components/HalloweenExploreFloor";
import HalloweenFaq from "@/components/HalloweenFaq";
import HalloweenFinalCta from "@/components/HalloweenFinalCta";
import HalloweenHero from "@/components/HalloweenHero";
import HalloweenPlanYourVisit from "@/components/HalloweenPlanYourVisit";
import HalloweenSubNav from "@/components/HalloweenSubNav";
import HalloweenTicketCta from "@/components/HalloweenTicketCta";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Nostalgia Fest Halloween: October 31 and November 1, 2026",
  description:
    "Nostalgia Fest Halloween at Square One Event Hall, October 31 and November 1, 2026. Free General Admission and a major cosplay competition.",
};

/**
 * Halloween 2026: the second real event landing page, built the same way
 * as /events/expo-2026 (see that page for the architectural pattern) but
 * with its own sections and mood rather than a recolour of Expo's. No VIP
 * tier, no vendor-table count and no hours are confirmed for this event
 * (docs/event-data.md), so those Expo sections have no Halloween
 * equivalent here rather than being faked.
 */
export default function Halloween2026Page() {
  return (
    <>
      <SiteHeader />
      <HalloweenSubNav />
      <main id="main-content">
        <HalloweenHero />
        <HalloweenTicketCta />
        <CosplayCompetition />
        <HalloweenAnnouncements />
        <HalloweenExploreFloor />
        <HalloweenAtmosphere />
        <HalloweenPlanYourVisit />
        <HalloweenFaq />
        <HalloweenFinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
