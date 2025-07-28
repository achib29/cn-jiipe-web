"use client";

import Image from "next/image";
import { useRef } from "react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

const companies = [
  {
    name: "海亮集团",
    description: "铜加工和有色金属制造领域的全球领导者",
    icon: () => (
      <Image
        src="/images/logos/hailiang.png"
        alt="Hailiang Group"
        width={250}
        height={250}
        objectFit="contain"
      />
    ),
  },
  {
    name: "信义玻璃",
    description: "高品质浮法玻璃和汽车玻璃的主要制造商",
    icon: () => (
      <Image
        src="/images/logos/xinyi-glass.png"
        alt="Xinyi Glass Indonesia"
        width={120}
        height={120}
        objectFit="contain"
      />
    ),
  },
  {
    name: "信义光能",
    description: "光伏玻璃和太阳能解决方案的技术革新者",
    icon: () => (
      <Image
        src="/images/logos/xinyi-solar.png"
        alt="Xinyi Solar"
        width={120}
        height={120}
        objectFit="contain"
      />
    ),
  },
  {
    name: "和邦生物科技",
    description: "专注于绿色化工和生物基工业应用的先锋",
    icon: () => (
      <Image
        src="/images/logos/hebang.png"
        alt="Hebang Biotechnology"
        width={250}
        height={250}
        objectFit="contain"
      />
    ),
  },
];

export default function ChineseCompaniesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, threshold: 0.3 });

  return (
    <section ref={ref} className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2
            className={cn(
              "text-2xl sm:text-3xl md:text-4xl font-bold mb-6 leading-snug text-center whitespace-nowrap overflow-hidden opacity-0 transition-all duration-700 ease-out",
              isInView && "opacity-100 translate-y-0"
            )}
            style={{
              transitionDelay: "200ms",
              transform: isInView ? "translateY(0)" : "translateY(20px)",
            }}
          >
            中国领军企业的信赖之选
          </h2>
          <p
            className={cn(
              "text-gray-600 dark:text-gray-400 opacity-0 transition-all duration-700 ease-out",
              isInView && "opacity-100 translate-y-0"
            )}
            style={{
              transitionDelay: "400ms",
              transform: isInView ? "translateY(0)" : "translateY(20px)",
            }}
          >
            印尼吉配保税港工业园（JIIPE）已成为多家快速发展的中国出海企业的基地，将其作为东南亚战略扩张中心。
          </p>
        </div>

        {/* Company Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {companies.map((company, index) => (
            <Card
              key={company.name}
              className={cn(
                "border-0 shadow-lg hover:shadow-xl transition-all duration-300 opacity-0",
                isInView && "opacity-100 translate-y-0"
              )}
              style={{
                transitionDelay: `${600 + index * 100}ms`,
                transform: isInView ? "translateY(0)" : "translateY(20px)",
              }}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center mb-4">
                    {company.icon()}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {company.name}
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg leading-snug text-gray-600 dark:text-gray-400 max-w-[90%] mx-auto">
                    {company.description}
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
