"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { MapPin, Globe, Plane, Ship, Truck } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import Icon360 from "@/components/icons/Icon360";

interface ConnectivityItem {
  title: string;
  desc: string;
}

interface LocationContent {
  label?: { en: string | null; cn: string | null };
  heading?: { en: string | null; cn: string | null };
  description?: { en: string | null; cn: string | null };
  map_image?: { en: string | null; cn: string | null };
  map_link?: { en: string | null; cn: string | null };
  map_title?: { en: string | null; cn: string | null };
  map_desc?: { en: string | null; cn: string | null };
  map_highlights_title?: { en: string | null; cn: string | null };
  map_highlights?: { en: string | null; cn: string | null };
  tour_label?: { en: string | null; cn: string | null };
  tour_heading?: { en: string | null; cn: string | null };
  tour_description?: { en: string | null; cn: string | null };
  tour_cover_image?: { en: string | null; cn: string | null };
  tour_link?: { en: string | null; cn: string | null };
  connectivity_items?: { en: string | null; cn: string | null };
}

const lang = "cn";

const DEFAULT_HIGHLIGHTS_EN = [
  "45 minutes to Juanda International Airport",
  "30 minutes to Surabaya CBD",
  "60 minutes to Sidoarjo and Pasuruan Industrial Hubs",
  "Direct frontage to the Surabaya West Access Channel (APBS)"
];

const DEFAULT_HIGHLIGHTS_CN = [
  "距朱安达国际机场 45 分钟车程",
  "距泗水中央商务区 30 分钟车程",
  "距诗都阿佐和巴苏鲁安工业中心 60 分钟车程",
  "直接面向泗水西航道 (APBS)"
];

const DEFAULT_CONNECTIVITY_EN: ConnectivityItem[] = [
  { title: "Sea Transport", desc: "Direct access to global trade routes via the APBS deep-water channel." },
  { title: "Air Transport", desc: "Only 45 minutes to Juanda International Airport" },
  { title: "Land Transport", desc: "Direct Toll Access connected to the Trans-Java Highway Network." },
  { title: "Global Connectivity", desc: "Located at the heart of Southeast Asia's fastest-growing economic corridor." }
];

const DEFAULT_CONNECTIVITY_CN: ConnectivityItem[] = [
  { title: "海运", desc: "通过 APBS 深水航道可直接连接全球贸易路线。" },
  { title: "空运", desc: "距朱安达国际机场仅 45 分钟车程" },
  { title: "陆运", desc: "直接通过收费公路连接爪哇岛跨岛高速公路网络。" },
  { title: "全球连接", desc: "位于东南亚增长最快的经济走廊中心。" }
];

const DEFAULT: LocationContent = {
  label: { en: "GLOBAL GATEWAY", cn: "全球门户" },
  heading: { en: "Prime Connectivity & Strategic Access", cn: "主要连接性和战略访问" },
  description: {
    en: "Located in East Java, JIIPE offers seamless connectivity to domestic and global markets through integrated multimodal transportation networks (Sea, Road, and Rail).",
    cn: "位于东爪哇的 JIIPE 通过综合多式联运网络（海运、公路和铁路）提供与国内和全球市场的无缝连接。"
  },
  map_image: { en: "/images/jiipe-location-map-cn.jpg", cn: "/images/jiipe-location-map-cn.jpg" },
  map_link: { en: "https://maps.app.goo.gl/ZETT9Gm28JfmcJwh7", cn: "https://maps.app.goo.gl/ZETT9Gm28JfmcJwh7" },
  map_title: { en: "Prime Location in East Java", cn: "东爪哇的黄金地段" },
  map_desc: {
    en: "Strategically positioned in Gresik, East Java—the heart of Indonesia's industrial growth corridor.",
    cn: "战略性地位于东爪哇的锦石（Gresik）——印度尼西亚工业增长走廊的核心。"
  },
  map_highlights_title: { en: "Key Distance Highlights:", cn: "主要距离亮点：" },
  map_highlights: {
    en: JSON.stringify(DEFAULT_HIGHLIGHTS_EN),
    cn: JSON.stringify(DEFAULT_HIGHLIGHTS_CN)
  },
  tour_label: { en: "Virtual Tour", cn: "虚拟旅游" },
  tour_heading: { en: "Explore JIIPE in a 360° Virtual Tour", cn: "在360度虚拟旅游中探索JIIPE" },
  tour_description: {
    en: "Through this virtual tour, explore JIIPE’s strategic geography and key facilities. Experience the port, industrial zones, and office areas immersively—and discover why JIIPE is an ideal investment destination in Indonesia and Southeast Asia.",
    cn: "通过这个虚拟旅游，探索JIIPE的战略地理位置和关键设施。沉浸式体验港口、工业区和办公区——发现为什么JIIPE是印度尼西亚和东南亚理想的投资目的地。"
  },
  tour_cover_image: { en: "/images/jiipe-360-cover.jpg", cn: "/images/jiipe-360-cover.jpg" },
  tour_link: { en: "https://tours.jiipe.com/tours/5Ss66DNIH", cn: "https://tours.jiipe.com/tours/5Ss66DNIH" },
  connectivity_items: {
    en: JSON.stringify(DEFAULT_CONNECTIVITY_EN),
    cn: JSON.stringify(DEFAULT_CONNECTIVITY_CN)
  }
};

function get(content: LocationContent, key: keyof LocationContent): string {
  return (content[key] as any)?.[lang] ?? (DEFAULT[key] as any)?.[lang] ?? "";
}

function parseHighlights(raw: string): string[] {
  try { return JSON.parse(raw); } catch { return []; }
}

function parseConnectivity(raw: string): ConnectivityItem[] {
  try { return JSON.parse(raw); } catch { return []; }
}

const GET_ICON = (index: number) => {
  const icons = [
    <Ship key="0" className="h-6 w-6 text-primary" />,
    <Plane key="1" className="h-6 w-6 text-primary" />,
    <Truck key="2" className="h-6 w-6 text-primary" />,
    <Globe key="3" className="h-6 w-6 text-primary" />
  ];
  return icons[index % icons.length];
};

export default function LocationSection({ initialData }: { initialData?: LocationContent }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, threshold: 0.3 });

  const [content, setContent] = useState<LocationContent>(initialData || DEFAULT);

  useEffect(() => {
    fetch("/api/site-content?section=location")
      .then(r => r.json())
      .then(data => { if (data.data) setContent(data.data); })
      .catch(() => {});
  }, []);

  const highlightsRaw = get(content, "map_highlights");
  const highlights = parseHighlights(highlightsRaw).length > 0 ? parseHighlights(highlightsRaw) : (lang === "cn" ? DEFAULT_HIGHLIGHTS_CN : DEFAULT_HIGHLIGHTS_EN);

  const connectivityRaw = get(content, "connectivity_items");
  const connectivityData = parseConnectivity(connectivityRaw).length > 0 ? parseConnectivity(connectivityRaw) : (lang === "cn" ? DEFAULT_CONNECTIVITY_CN : DEFAULT_CONNECTIVITY_EN);

  return (
    <section id="location" className="py-20 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2
            className={cn(
              "text-sm uppercase font-semibold tracking-wider text-primary mb-2 opacity-0 transition-all duration-700 ease-out",
              isInView && "opacity-100 translate-y-0"
            )}
            style={{
              transitionDelay: "200ms",
              transform: isInView ? "translateY(0)" : "translateY(20px)",
            }}
          >
            {get(content, "label")}
          </h2>
          <h3
            className={cn(
              "text-3xl md:text-4xl font-bold mb-6 opacity-0 transition-all duration-700 ease-out",
              isInView && "opacity-100 translate-y-0"
            )}
            style={{
              transitionDelay: "400ms",
              transform: isInView ? "translateY(0)" : "translateY(20px)",
            }}
          >
            {get(content, "heading")}
          </h3>
          <p
            className={cn(
              "whitespace-pre-line text-gray-600 dark:text-gray-400 opacity-0 transition-all duration-700 ease-out",
              isInView && "opacity-100 translate-y-0"
            )}
            style={{
              transitionDelay: "600ms",
              transform: isInView ? "translateY(0)" : "translateY(20px)",
            }}
          >
            {get(content, "description")}
          </p>
        </div>

        {/* Map & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
          {/* Map Image Side */}
          <div
            ref={ref}
            className={cn(
              "relative overflow-hidden rounded-lg opacity-0 transition-all duration-1000 ease-out",
              isInView && "opacity-100 translate-x-0"
            )}
            style={{
              transform: isInView ? "translateX(0)" : "translateX(-50px)",
            }}
          >
            <div className="relative aspect-video overflow-hidden rounded-lg shadow-xl bg-gray-100">
              <Image
                src={get(content, "map_image") || "/images/jiipe-location-map-cn.jpg"}
                alt={get(content, "map_title")}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority={false}
              />

              <a
                href={get(content, "map_link") || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  absolute bottom-4 left-4 z-20
                  inline-flex items-center gap-2
                  rounded-full border border-gray-200
                  bg-white text-gray-900
                  px-4 py-2 text-sm font-semibold
                  shadow-md mix-blend-normal
                  hover:bg-red-600 hover:text-white hover:border-red-600
                  transition-all duration-200
                "
              >
                <MapPin className="h-4 w-4" />
                <span>View on Maps</span>
              </a>
            </div>

            <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/20 to-transparent pointer-events-none" />
          </div>

          {/* Content Side */}
          <div>
            <div
              className={cn(
                "space-y-4 opacity-0 transition-all duration-1000 ease-out",
                isInView && "opacity-100 translate-y-0"
              )}
              style={{
                transitionDelay: "800ms",
                transform: isInView ? "translateY(0)" : "translateY(30px)",
              }}
            >
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-lg">{get(content, "map_title")}</h4>
                  <p className="whitespace-pre-line text-gray-600 dark:text-gray-400">
                    {get(content, "map_desc")}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold text-lg mb-2">{get(content, "map_highlights_title")}</h4>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  {highlights.map((highlight, index) => (
                    <li key={index} className="flex gap-2">
                      <span>•</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>  
          </div>
        </div>

        {/* 360 Virtual Tour */}
        <div className="text-center max-w-3xl mx-auto mb-12 mt-24">
          <h2
            className={cn(
              "text-sm uppercase font-semibold tracking-wider text-primary mb-2 opacity-0 transition-all duration-700 ease-out",
              isInView && "opacity-100 translate-y-0"
            )}
            style={{
              transitionDelay: "200ms",
              transform: isInView ? "translateY(0)" : "translateY(20px)",
            }}
          >
            {get(content, "tour_label")}
          </h2>
          <h3
            className={cn(
              "text-3xl md:text-4xl font-bold mb-6 opacity-0 transition-all duration-700 ease-out",
              isInView && "opacity-100 translate-y-0"
            )}
            style={{
              transitionDelay: "400ms",
              transform: isInView ? "translateY(0)" : "translateY(20px)",
            }}
          >
            {get(content, "tour_heading")}
          </h3>
          <p
            className={cn(
              "whitespace-pre-line text-gray-600 dark:text-gray-400 opacity-0 transition-all duration-700 ease-out",
              isInView && "opacity-100 translate-y-0"
            )}
            style={{
              transitionDelay: "600ms",
              transform: isInView ? "translateY(0)" : "translateY(20px)",
            }}
          >
            {get(content, "tour_description")}
          </p>
        </div>

        {/* 360° Cover */}
        <div
          className={cn(
            "relative mt-4 w-full aspect-[16/6] rounded-3xl overflow-hidden shadow-xl bg-gray-100 group",
            isInView && "opacity-100 translate-y-0"
          )}
          style={{
            transition: "all 700ms ease-out",
            transform: isInView ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <Image
            src={get(content, "tour_cover_image") || "/images/jiipe-360-cover.jpg"}
            alt={get(content, "tour_heading")}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="100vw"
          />

          <div className="absolute inset-0 bg-black/20 pointer-events-none" />

          <a
            href={get(content, "tour_link") || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 flex items-center justify-center z-20 cursor-pointer group/btn"
          >
            <div className="relative flex items-center justify-center w-32 h-32 rounded-full transition-transform duration-300 group-hover/btn:scale-110">
              <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-20 animate-ping duration-1000" />
              <Icon360 className="relative z-10 w-24 h-24 text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]" />
            </div>
          </a>
        </div>

        {/* Connectivity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {connectivityData.map((item, index) => (
            <Card
              key={index}
              className={cn(
                "border-0 shadow-md hover:shadow-lg transition-all duration-700 opacity-0 ease-out h-full",
                isInView && "opacity-100 translate-y-0"
              )}
              style={{
                transitionDelay: `${1200 + index * 100}ms`,
                transform: isInView ? "translateY(0)" : "translateY(30px)",
              }}
            >
              <CardContent className="pt-6 h-full">
                <div className="flex flex-col items-center text-center h-full">
                  <div className="p-3 bg-primary/10 rounded-full mb-4 shrink-0">
                    {GET_ICON(index)}
                  </div>
                  <h4 className="font-semibold text-lg mb-2">
                    {item.title}
                  </h4>
                  <p className="whitespace-pre-line text-gray-600 dark:text-gray-400">
                    {item.desc}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
