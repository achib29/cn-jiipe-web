"use client";

import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface Tenant {
  name: string;
  logo_url: string;
  description: string;
}

interface TenantsContent {
  heading?: { en: string | null; cn: string | null };
  subtitle?: { en: string | null; cn: string | null };
  tenants?: { en: string | null; cn: string | null };
}

const lang = "cn";

const DEFAULT_HEADING = {
  en: "Trusted by Global & Industry Leaders",
  cn: "全球及行业领军企业的信任之选",
};
const DEFAULT_SUBTITLE = {
  en: "JIIPE serves as the strategic expansion hub for leading multinational and domestic corporations. We provide the foundation for industrial giants to accelerate their growth in Southeast Asia and beyond.",
  cn: "JIIPE 是领先跨国企业和国内企业的战略扩张中心，为工业巨头加速在东南亚及更广地区的增长提供坚实基础。",
};

const DEFAULT_TENANTS: Tenant[] = [
  { name: 'PT Hailiang', logo_url: 'https://ik.imagekit.io/z3fiyhjnl/Tenant%20Logo/PT%20Hailiang%20Nova%20Material%20Indonesia.png?updatedAt=1764649696762', description: '铜材加工和有色金属制造的全球领导者。' },
  { name: 'Xinyi Glass', logo_url: 'https://ik.imagekit.io/z3fiyhjnl/Tenant%20Logo/Xinyi%20Glass.png?updatedAt=1764649697448', description: '高品质浮法玻璃和汽车玻璃的领先制造商。' },
  { name: 'Xinyi Solar', logo_url: 'https://ik.imagekit.io/z3fiyhjnl/Tenant%20Logo/Xinyi%20Solar.png?updatedAt=1764649697291', description: '光伏玻璃和太阳能解决方案的技术创新者。' },
  { name: 'Hebang Biotechnology', logo_url: 'https://ik.imagekit.io/z3fiyhjnl/Tenant%20Logo/Hebang%20Logo-web.png', description: '绿色化学品和生物基工业解决方案的先驱生产商。' },
  { name: 'GESC', logo_url: 'https://ik.imagekit.io/z3fiyhjnl/Tenant%20Logo/GESC-Logo.png?updatedAt=1764649697594', description: '三聚氰胺、硝酸铵、合成胺及尿素的专业制造商。' }
];

function get(content: TenantsContent, key: keyof TenantsContent): string {
  return (content[key] as any)?.[lang] ?? "";
}

export default function ChineseCompaniesSection({ initialData }: { initialData?: TenantsContent }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, threshold: 0.3 });
  const [content, setContent] = useState<TenantsContent>(initialData || {});

  useEffect(() => {
    fetch("/api/site-content?section=tenants")
      .then(r => r.json())
      .then(data => setContent(data.data ?? {}))
      .catch(() => {});
  }, []);

  const heading = get(content, "heading") || DEFAULT_HEADING[lang];
  const subtitle = get(content, "subtitle") || DEFAULT_SUBTITLE[lang];

  let tenants: Tenant[] = DEFAULT_TENANTS;
  try {
    const raw = get(content, "tenants");
    if (raw) tenants = JSON.parse(raw);
  } catch {}

  return (
    <section ref={ref} className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2
            className={cn("text-2xl sm:text-3xl md:text-4xl font-bold mb-6 leading-snug text-center opacity-0", isInView && "opacity-100 translate-y-0")}
            style={{ transitionDelay: "200ms", transform: isInView ? "translateY(0)" : "translateY(20px)" }}
          >
            {heading}
          </h2>
          <p
            className={cn("text-gray-600 dark:text-gray-400 opacity-0 transition-all duration-700 ease-out", isInView && "opacity-100 translate-y-0")}
            style={{ transitionDelay: "400ms", transform: isInView ? "translateY(0)" : "translateY(20px)" }}
          >
            {subtitle}
          </p>
        </div>

        {/* Tenant Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tenants.map((tenant, index) => (
            <Card
              key={`${tenant.name}-${index}`}
              className={cn("border-0 shadow-lg hover:shadow-xl transition-all duration-300 opacity-0", isInView && "opacity-100 translate-y-0")}
              style={{ transitionDelay: `${600 + index * 100}ms`, transform: isInView ? "translateY(0)" : "translateY(20px)" }}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center mb-4 w-full h-24 relative">
                    <Image
                      src={tenant.logo_url}
                      alt={tenant.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  {tenant.name && <h3 className="text-lg font-semibold mb-2">{tenant.name}</h3>}
                  <p className="text-sm leading-snug text-gray-600 dark:text-gray-400">{tenant.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
