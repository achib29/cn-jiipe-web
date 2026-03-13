"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Anchor, Truck, Lightbulb, Building2, Warehouse } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FacilityTab {
  id: string;
  title: string;
  description: string;
  image: string;
  features: string[];
}

interface FacilitiesContent {
  label?: { en: string | null; cn: string | null };
  heading?: { en: string | null; cn: string | null };
  description?: { en: string | null; cn: string | null };
  tabs?: { en: string | null; cn: string | null };
}

const lang = "cn";

const DEFAULT_TABS_EN: FacilityTab[] = [
  {
    id: "industrial-area",
    title: "Industrial Area",
    image: "https://ik.imagekit.io/z3fiyhjnl/PT%20Hailiang%20&%20PT%20Freeport%20Indonesia.jpg",
    description: "A 1,800-hectare industrial cluster designed with flexible plotting to accommodate diverse operational needs.",
    features: ["Flexible plot sizes", "Ready-to-Build (RTB) Plots", "Industrial zoning", "Premium Standard Infrastructure", "Integrated Waste Management", "24/7 security system"],
  },
  {
    id: "port-area",
    title: "Multifunctional Port Area",
    image: "https://ik.imagekit.io/z3fiyhjnl/JIIPE%20-%20Ports.jpg",
    description: "A dedicated deep-water port featuring modern infrastructure for the efficient handling of diverse cargo types.",
    features: ["Deep-Water Berths (-16 LWS)", "Multipurpose docks", "Liquid bulk terminal", "Container terminal", "Dry bulk terminal", "Heavy-Duty Handling Equipment"],
  },
  {
    id: "utilities",
    title: "Utilities",
    image: "https://ik.imagekit.io/z3fiyhjnl/Utility%20Center.jpg",
    description: "A self-sufficient utility ecosystem ensuring reliable and uninterrupted industrial operations.",
    features: ["Dedicated power plant", "Water treatment facilities", "Natural gas supply system", "Telecommunications infrastructure", "Wastewater treatment plant", "Renewable Energy Solutions"],
  },
  {
    id: "infrastructure",
    title: "Infrastructure",
    image: "https://ik.imagekit.io/z3fiyhjnl/Gate%20-%20JIIPE.jpg",
    description: "A well-planned infrastructure network that facilitates seamless connectivity within and outside the park.",
    features: ["Internal road network", "Direct Highway Access", "Drainage system", "Advanced Flood Control System", "Public transportation facilities"],
  },
  {
    id: "residential",
    title: "Residential Area",
    image: "https://ik.imagekit.io/z3fiyhjnl/AKR%20LAND%201.jpg",
    description: "A modern integrated township designed to provide a high quality of life for your workforce and executives.",
    features: ["Modern Workforce Housing", "Commercial amenities", "Educational institutions", "Healthcare facilities", "Parks & Recreation Centers"],
  }
];

const DEFAULT_TABS_CN: FacilityTab[] = [
  {
    id: "industrial-area",
    title: "工业区",
    image: "https://ik.imagekit.io/z3fiyhjnl/PT%20Hailiang%20&%20PT%20Freeport%20Indonesia.jpg",
    description: "占地 1,800 公顷的工业集群，规划灵活，可满足不同的运营需求。",
    features: ["灵活的地块大小", "即可建设(RTB)地块", "工业区划", "高级标准基础设施", "综合废物管理", "24/7 安全系统"],
  },
  {
    id: "port-area",
    title: "多功能港口区",
    image: "https://ik.imagekit.io/z3fiyhjnl/JIIPE%20-%20Ports.jpg",
    description: "拥有现代基础设施的专用深水港，可高效处理各种类型的货物。",
    features: ["深水泊位 (-16 LWS)", "多用途码头", "液体散货码头", "集装箱码头", "干散货码头", "重型装卸设备"],
  },
  {
    id: "utilities",
    title: "公用事业",
    image: "https://ik.imagekit.io/z3fiyhjnl/Utility%20Center.jpg",
    description: "自给自足的公用事业生态系统，确保工业运营可靠且不间断。",
    features: ["专用发电厂", "水处理设施", "天然气供应系统", "电信基础设施", "废水处理厂", "可再生能源解决方案"],
  },
  {
    id: "infrastructure",
    title: "基础设施",
    image: "https://ik.imagekit.io/z3fiyhjnl/Gate%20-%20JIIPE.jpg",
    description: "规划完善的基础设施网络，实现园区内外的无缝连接。",
    features: ["内部道路网络", "直达高速公路", "排水系统", "先进的防洪系统", "公共交通设施"],
  },
  {
    id: "residential",
    title: "住宅区",
    image: "https://ik.imagekit.io/z3fiyhjnl/AKR%20LAND%201.jpg",
    description: "现代化的综合型城镇，为您的高管和员工提供高品质的生活环境。",
    features: ["现代化员工住房", "商业设施", "教育机构", "医疗设施", "公园和娱乐中心"],
  }
];

const DEFAULT: FacilitiesContent = {
  label: { en: "Overview of Facilities", cn: "设施概览" },
  heading: { en: "World-Class Industrial & Port Infrastructure", cn: "世界级的工业与港口基础设施" },
  description: {
    en: "JIIPE features a comprehensive industrial ecosystem, supported by cutting-edge infrastructure, integrated utilities, and smart logistics capabilities designed to empower diverse industrial growth.",
    cn: "JIIPE 拥有全面的工业生态系统，在尖端基础设施、综合公用事业和智能物流能力的支持下，旨在赋能多样化的工业增长。"
  },
  tabs: {
    en: JSON.stringify(DEFAULT_TABS_EN),
    cn: JSON.stringify(DEFAULT_TABS_CN)
  }
};

function get(content: FacilitiesContent, key: keyof FacilitiesContent): string {
  return (content[key] as any)?.[lang] ?? (DEFAULT[key] as any)?.[lang] ?? "";
}

function parseTabs(raw: string): FacilityTab[] {
  try { return JSON.parse(raw); } catch { return []; }
}

const ICON_MAP: Record<string, React.ReactNode> = {
  "industrial-area": <Building2 className="h-10 w-10 mb-4 text-primary" />,
  "port-area": <Anchor className="h-10 w-10 mb-4 text-primary" />,
  "utilities": <Lightbulb className="h-10 w-10 mb-4 text-primary" />,
  "infrastructure": <Truck className="h-10 w-10 mb-4 text-primary" />,
  "residential": <Warehouse className="h-10 w-10 mb-4 text-primary" />,
};

export default function FacilitiesSection({ initialData }: { initialData?: FacilitiesContent }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, threshold: 0.3 });

  const [content, setContent] = useState<FacilitiesContent>(initialData || DEFAULT);
  const [activeTab, setActiveTab] = useState("industrial-area");
  
  const tabsRaw = get(content, "tabs");
  const facilities = parseTabs(tabsRaw).length > 0 ? parseTabs(tabsRaw) : (lang === "cn" ? DEFAULT_TABS_CN : DEFAULT_TABS_EN);

  useEffect(() => {
    fetch("/api/site-content?section=facilities")
      .then(r => r.json())
      .then(data => { if (data.data) setContent(data.data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      const validTabs = facilities.map((f) => f.id);
      if (validTabs.includes(hash)) {
        setActiveTab(hash);
        document.getElementById("facilities")?.scrollIntoView({ behavior: "smooth" });
      }
    };
    handleHashChange(); // apply on load
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [facilities]);


  return (
    <section id="facilities" ref={ref} className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className={cn("text-sm uppercase font-semibold tracking-wider text-primary mb-2 opacity-0 transition-all duration-700 ease-out", isInView && "opacity-100 translate-y-0")} style={{ transitionDelay: "200ms", transform: isInView ? "translateY(0)" : "translateY(20px)" }}>
            {get(content, "label")}
          </h2>
          <h3 className={cn("text-3xl md:text-4xl font-bold mb-6 opacity-0 transition-all duration-700 ease-out", isInView && "opacity-100 translate-y-0")} style={{ transitionDelay: "400ms", transform: isInView ? "translateY(0)" : "translateY(20px)" }}>
            {get(content, "heading")}
          </h3>
          <p className={cn("text-gray-600 dark:text-gray-400 opacity-0 transition-all duration-700 ease-out", isInView && "opacity-100 translate-y-0")} style={{ transitionDelay: "600ms", transform: isInView ? "translateY(0)" : "translateY(20px)" }}>
            {get(content, "description")}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tabs header */}
          <div className="mb-6 -mx-4 md:mx-0">
            <TabsList
              className={cn(
                "flex w-full gap-2 overflow-x-auto md:overflow-visible px-4 md:px-0 py-2",
                "bg-transparent no-scrollbar justify-start md:justify-center"
              )}
            >
              {facilities.map((facility) => (
                <TabsTrigger
                  key={facility.id}
                  value={facility.id}
                  className={cn(
                    "px-4 py-2 text-sm md:text-base rounded-full border border-transparent",
                    "whitespace-nowrap shrink-0",
                    "bg-gray-100/80 text-gray-700 dark:bg-gray-800 dark:text-gray-200",
                    "data-[state=active]:bg-primary data-[state=active]:text-white",
                    "data-[state=active]:border-primary",
                    "transition-colors duration-200"
                  )}
                >
                  {facility.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {facilities.map((facility, index) => {
            const icon = ICON_MAP[facility.id] ?? <Warehouse className="h-10 w-10 mb-4 text-primary" />;
            return (
              <TabsContent key={facility.id} value={facility.id} className={cn("opacity-0 transition-all duration-1000 ease-out", isInView && "opacity-100 translate-y-0")} style={{ transitionDelay: "1200ms", transform: isInView ? "translateY(0)" : "translateY(20px)" }}>
                {/* this div provides scroll target for anchor */}
                <div id={facility.id} className="scroll-mt-32">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <Card className="border-0 shadow-lg overflow-hidden">
                      <div className="aspect-video w-full relative">
                        {facility.image && (
                          <Image src={facility.image} alt={facility.title} fill className="object-cover object-center" sizes="(max-width: 1024px) 100vw, 50vw" />
                        )}
                      </div>
                    </Card>
                    <div>
                      <CardHeader>
                        <div className="mb-4">{icon}</div>
                        <CardTitle className="text-2xl">{facility.title}</CardTitle>
                        <CardDescription className="text-base whitespace-pre-line">{facility.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {(facility.features || []).map((feature, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <div className="rounded-full bg-primary/10 p-1 mt-0.5 shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary h-3 w-3">
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              </div>
                              <span className="text-gray-700 dark:text-gray-300 text-sm leading-snug">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </div>
                  </div>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </section>
  );
}
