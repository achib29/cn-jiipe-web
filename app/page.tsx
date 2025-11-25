import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import SpecialEconomicZoneSection from "@/components/SpecialEconomicZoneSection";
import FacilitiesSection from "@/components/facilities-section";
import LocationSection from "@/components/location-section";
import ContactSection from "@/components/contact-section";
import CTASection from "@/components/cta-section";
import ChineseCompaniesSection from "@/components/chinese-companies-section";
import HomeFeaturedStories from "@/components/home/HomeFeaturedStories";


export default function Home() {
  return (
    <div>
      <HeroSection />
      <ChineseCompaniesSection />
      <HomeFeaturedStories />
      <AboutSection />
      <SpecialEconomicZoneSection />
      <FacilitiesSection />
      <LocationSection />
      <CTASection />
      <ContactSection />
    </div>
  );
}