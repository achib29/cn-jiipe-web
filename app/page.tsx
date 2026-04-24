import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import SpecialEconomicZoneSection from "@/components/SpecialEconomicZoneSection";
import FacilitiesSection from "@/components/facilities-section";
import LocationSection from "@/components/location-section";
import ContactSection from "@/components/contact-section";
import CTASection from "@/components/cta-section";
import ChineseCompaniesSection from "@/components/chinese-companies-section";
import HomeFeaturedStories from "@/components/home/HomeFeaturedStories";


import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export const dynamic = 'force-dynamic';

async function getSiteContent() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT section, field_key, value_en, value_cn FROM site_content');
    const result: Record<string, Record<string, { en: string | null; cn: string | null }>> = {};
    for (const row of rows) {
      if (!result[row.section]) result[row.section] = {};
      result[row.section][row.field_key] = { en: row.value_en, cn: row.value_cn };
    }
    return result;
  } catch (error) {
    console.error('Failed to fetch site content SSR:', error);
    return {};
  }
}

export default async function Home() {
  const allContent = await getSiteContent();

  return (
    <div>
      <HeroSection initialData={allContent['hero'] as any} />
      <ChineseCompaniesSection initialData={allContent['tenants'] as any} />
      <AboutSection initialData={allContent['about'] as any} />
      <HomeFeaturedStories initialData={allContent['newsroom'] as any} />
      <SpecialEconomicZoneSection initialData={allContent['sez'] as any} />
      <FacilitiesSection initialData={allContent['facilities'] as any} />
      <LocationSection initialData={allContent['location'] as any} />
      <CTASection initialData={allContent['cta'] as any} />
      <ContactSection initialData={allContent['contact'] as any} />
    </div>
  );
}