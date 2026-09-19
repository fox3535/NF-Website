import type { Metadata } from "next";
import ClubTeaser from "@/components/ClubTeaser";
import ExpoAnnouncements from "@/components/ExpoAnnouncements";
import ExpoCollectrActivation from "@/components/ExpoCollectrActivation";
import ExpoExploreFloor from "@/components/ExpoExploreFloor";
import ExpoFaq from "@/components/ExpoFaq";
import ExpoFinalCta from "@/components/ExpoFinalCta";
import ExpoHero from "@/components/ExpoHero";
import ExpoPlanYourVisit from "@/components/ExpoPlanYourVisit";
import ExpoSponsors from "@/components/ExpoSponsors";
import ExpoSubNav from "@/components/ExpoSubNav";
import ExpoTicketChoices from "@/components/ExpoTicketChoices";
import ExpoWhyAttend from "@/components/ExpoWhyAttend";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Nostalgia Fest Expo 2026: October 9 to 11, Free Admission",
  description:
    "Nostalgia Fest Expo, October 9 to 11, 2026 at Square One Event Hall, Mississauga. 200+ vendor tables of trading cards, toys, comics, art and collectibles. Free General Admission for everyone.",
  openGraph: {
    title: "Nostalgia Fest Expo 2026",
    description:
      "October 9 to 11, 2026 · Square One Event Hall, Mississauga. Free General Admission.",
    images: ["/images/campaigns/expo-2026-banner.png"],
  },
};

/**
 * Expo 2026 — the primary conversion destination for Expo traffic. Owns the
 * depth the homepage deliberately doesn't: full hours, programming, sponsors
 * and FAQ. See docs/homepage-concept.md section 1 for the homepage/event-page
 * division of labour this follows.
 *
 * Business decision (docs/event-data.md): Expo 2026 sells no VIP tier. It is
 * Free General Admission only, so this page carries no dedicated VIP
 * section, ticket comparison or VIP messaging anywhere.
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
        <ExpoCollectrActivation />
        <ExpoPlanYourVisit />
        <ExpoFaq />
        <ExpoFinalCta />
        <ClubTeaser
          source="expo-2026"
          heading="Stay in the loop after Expo"
          body="Join NF Club to hear about future Nostalgia Fest shows, guests and announcements."
        />
      </main>
      <SiteFooter />
    </>
  );
}
