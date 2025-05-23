"use client";

import { useState } from "react";
import { FileText, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  {
    key: "fiscal",
    label: "Fiscal Facilities",
    icon: FileText,
    facilities: [
      {
        title: "VAT or VAT and Tax on Luxury Goods",
        desc: "Delivery of taxable goods/services in free zones or bonded areas not taxed for developers or tenants.",
      },
      {
        title: "Customs, PDRI, and Excises",
        desc: "Exemption or suspension of import duties for capital and consumption goods.",
      },
      {
        title: "Local Tax",
        desc: "Incentives for local tax and/or local retribution between 50%–100%.",
      },
    ],
  },
  {
    key: "nonfiscal",
    label: "Non-Fiscal Facilities",
    icon: ShieldCheck,
    facilities: [
      {
        title: "One Stop Service",
        desc: "Business licensing and non-licensing services from KEK Administrator.",
      },
      {
        title: "Building Permit by Developer",
        desc: "No permit needed if developer has established estate regulations.",
      },
      {
        title: "Land Procurement and Titling",
        desc: "Up to 80 years of land use and ownership rights with accelerated procedures.",
      },
      {
        title: "Immigration",
        desc: "VoA extensions, permits for foreigners & families, and residence for owners.",
      },
      {
        title: "No Negative List",
        desc: "Goods importation without restrictions.",
      },
      {
        title: "Environmental License by Developer",
        desc: "Licenses issued directly by developer.",
      },
      {
        title: "No Export Obligation",
        desc: "Tenants not required to export goods.",
      },
      {
        title: "Excisable Goods",
        desc: "Not applied to SEZs under specific terms.",
      },
    ],
  },
];

export default function SEZSection() {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <section className="py-20 bg-white dark:bg-gray-900" id="sez">
      <div className="container mx-auto px-4">
        {/* Title & Description */}
        <div className="text-center mb-12 max-w-4xl mx-auto">
          <h2 className="text-sm uppercase text-primary font-semibold mb-2">Special Economic Zone</h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Strategic Zone for Investment
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Special Economic Zones (SEZs) are the Government's strategic policy to be developed as centers of economic growth, national economic equity, supporting industrialization, and increasing employment in Indonesia. The area with the ultimate incentives is presented to domestic and foreign investors.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200",
                activeTab.key === tab.key
                  ? "bg-primary text-white border-primary"
                  : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-primary hover:text-white hover:border-primary"
              )}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Facility Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab.facilities.map((item, idx) => (
            <div
              key={idx}
              className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800 hover:shadow-md transition"
            >
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {item.title}
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{item.desc}</p>
              <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 italic">
                Legal Basis: Government Regulation No. 40 of 2021
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
