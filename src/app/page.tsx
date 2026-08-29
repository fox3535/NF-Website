import CategoryBand from "@/components/CategoryBand";
import FeaturedEvent from "@/components/FeaturedEvent";
import FinalCta from "@/components/FinalCta";
import Hero from "@/components/Hero";
import Marketplace from "@/components/Marketplace";
import PlanYourVisit from "@/components/PlanYourVisit";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import SocialProof from "@/components/SocialProof";
import StickyCta from "@/components/StickyCta";
import UpcomingEvents from "@/components/UpcomingEvents";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="pb-24 md:pb-0">
        <Hero />
        <CategoryBand />
        <SocialProof />
        <Marketplace />
        <FeaturedEvent />
        <PlanYourVisit />
        <UpcomingEvents />
        <FinalCta />
      </main>
      <SiteFooter />
      <StickyCta />
    </>
  );
}
