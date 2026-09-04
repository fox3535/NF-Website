import type { Metadata } from "next";
import ExpoAnnouncements from "@/components/ExpoAnnouncements";
import ExpoExploreFloor from "@/components/ExpoExploreFloor";
import ExpoFaq from "@/components/ExpoFaq";
import ExpoFinalCta from "@/components/ExpoFinalCta";
import ExpoHero from "@/components/ExpoHero";
import ExpoPlanYourVisit from "@/components/ExpoPlanYourVisit";
import ExpoSponsors from "@/components/ExpoSponsors";
import ExpoSubNav from "@/components/ExpoSubNav";
import ExpoTicketChoices from "@/components/ExpoTicketChoices";
import ExpoVipExperience from "@/components/ExpoVipExperience";
import ExpoWhyAttend from "@/components/ExpoWhyAttend";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Nostalgia Fest Expo 2026 — October 9–11 — Free Admission",
  description:
    "Nostalgia Fest Expo, October 9–11, 2026 at Square One Event Hall, Mississauga. 200+ vendor tables of trading cards, toys, comics, art and collectibles. Free General Admission, VIP upgrade available.",
  openGraph: {
    title: "Nostalgia Fest Expo 2026",
    description:
      "October 9–11, 2026 · Square One Event Hall, Mississauga. Free General Admission.",
    images: ["/images/campaigns/expo-2026-banner.png"],
  },
};

/**
 * Expo 2026 — the primary conversion destination for Expo traffic. Owns the
 * depth the homepage deliberately doesn't: full hours, ticket comparison,
 * programming, sponsors, VIP and FAQ. See docs/homepage-concept.md section 1
 * for the homepage/event-page division of labour this follows.
 */
export default function Expo2026Page() {
  return (
    <>
      <SiteHeader />
      <ExpoSubNav />
      <main id="main-content">
        <ExpoHero />
        <ExpoTicketChoices />
        <ExpoWhyAttend />
        <ExpoAnnouncements />
        <ExpoExploreFloor />
        <ExpoSponsors />
        <ExpoVipExperience />
        <ExpoPlanYourVisit />
        <ExpoFaq />
        <ExpoFinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
