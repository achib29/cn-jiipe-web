"use client";

import { useRef } from "react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

const fiscalFacilities = [
  {
    title: "VAT or VAT and Tax on Luxury Goods",
    description:
      "Delivery of Taxable Goods (BKP) and/or Taxable Services (JKP) from TLDDP, free zones, and bonded stockpiles to Developer and/or Tenants not collected, etc.",
    legal: "Government Regulation Number 40 of 2021 on Implementation of Special Economic Zones",
  },
  {
    title: "Customs, PDRI, and Excises",
    description:
      "Exemption and/or suspension of import duties on the entry of capital and consumption goods, etc.",
    legal: "Government Regulation Number 40 of 2021 on Implementation of Special Economic Zones",
  },
  {
    title: "Local Tax",
    description: "Incentives for local tax and/or local retribution between 50%–100%",
    legal: "Government Regulation Number 40 of 2021 on Implementation of Special Economic Zones",
  },
  {
    title: "Additional Facilities SEZ Tourism",
    description: "Eligible for VAT refund; exemption from PPnBM for purchase of residential homes/dwellings",
    legal: "Government Regulation Number 40 of 2021 on Implementation of Special Economic Zones",
  },
];

const nonFiscalFacilities = [
  {
    title: "One Stop Service",
    description: "Business licensing services, other licenses, and non-licensing services carried out by KEK Administrator",
    legal: "Government Regulation Number 40 of 2021 on Implementation of Special Economic Zones",
  },
  {
    title: "Building Permit by Developer",
    description: "Tenant doesn’t require building permit if Developer has established Estate Regulation",
    legal: "Government Regulation Number 40 of 2021 on Implementation of Special Economic Zones",
  },
  {
    title: "Land procurement and Titling",
    description: "Right to Use up to 80 years, Building Right up to 80 years, Special Accelerated Procedures",
    legal: "Government Regulation Number 40 of 2021 on Implementation of Special Economic Zones",
  },
  {
    title: "Immigration",
    description: "VoA can be extended 5x, Limited stay permits for foreigners & families, Residence permits",
    legal: "Government Regulation Number 40 of 2021 on Implementation of Special Economic Zones",
  },
  {
    title: "Environmental License by Developer",
    description: "Environmental License authorized by Developer",
    legal: "Government Regulation Number 40 of 2021 on Implementation of Special Economic Zones",
  },
  {
    title: "No Export Obligation",
    description: "Tenants within SEZ don’t have export obligation",
    legal: "Government Regulation Number 40 of 2021 on Implementation of Special Economic Zones",
  },
  {
    title: "Property Ownership",
    description: "Foreigners allowed to have property ownership within Tourism SEZ",
    legal: "Government Regulation Number 40 of 2021 on Implementation of Special Economic Zones",
  },
  {
    title: "Excisable Goods",
    description: "Excise regulations are not applied to SEZ+ (*terms & conditions apply)",
    legal: "Government Regulation Number 40 of 2021 on Implementation of Special Economic Zones",
  },
];

export default function SpecialEconomicZoneSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, threshold: 0.3 });

  return (
    <section id="sez" ref={ref} className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className={cn("text-3xl md:text-4xl font-bold mb-4 transition-all", isInView && "opacity-100")}>
            Special Economic Zone (SEZ)
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Special Economic Zones (SEZs) are the Government&apos;s strategic policy to be developed as centers of economic growth, national economic equity, supporting industrialization, and increasing employment in Indonesia. The area with the ultimate incentives is presented to domestic and foreign investors.
          </p>
        </div>

        <div className="mb-10">
          <h3 className="text-2xl font-semibold text-primary mb-6">Fiscal Facilities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fiscalFacilities.map((facility, index) => (
              <div key={index} className="p-6 rounded-lg shadow border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700">
                <h4 className="font-semibold text-lg mb-2">{facility.title}</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-2">{facility.description}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Legal Basis:</span> {facility.legal}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-primary mb-6">Non-Fiscal Facilities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nonFiscalFacilities.map((facility, index) => (
              <div key={index} className="p-6 rounded-lg shadow border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700">
                <h4 className="font-semibold text-lg mb-2">{facility.title}</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-2">{facility.description}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Legal Basis:</span> {facility.legal}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
