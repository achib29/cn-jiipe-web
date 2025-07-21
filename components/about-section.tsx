"use client";

import { useEffect, useRef } from "react";
import { CheckCircle2 } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

export default function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, threshold: 0.3 });

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <div
            ref={ref}
            className={cn(
              "relative overflow-hidden rounded-lg opacity-0 transition-all duration-1000 ease-out",
              isInView && "opacity-100 translate-x-0"
            )}
            style={{ transform: isInView ? "translateX(0)" : "translateX(-50px)" }}
          >
            <div className="aspect-video overflow-hidden rounded-lg shadow-xl">
              <iframe
                src="https://player.bilibili.com/player.html?isOutside=true&aid=114872088010011&bvid=BV1ubguzDEyd&cid=31119049247&p=1"
                allowFullScreen
                frameBorder="0"
                className="w-full h-full rounded-lg"
              /> 
            </div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/30 to-transparent pointer-events-none" />
          </div>

          {/* Content Side */}
          <div>
            <div className="flex flex-col gap-2">
              <h2
                className={cn(
                  "text-sm uppercase font-semibold tracking-wider text-primary mb-2 opacity-0 transition-all duration-700 ease-out",
                  isInView && "opacity-100 translate-y-0"
                )}
                style={{ transitionDelay: "200ms", transform: isInView ? "translateY(0)" : "translateY(20px)" }}
              >
                关于印尼吉配保税港工业园（JIIPE）
              </h2>
              <h3
                className={cn(
                  "text-3xl md:text-4xl font-bold mb-6 opacity-0 transition-all duration-700 ease-out",
                  isInView && "opacity-100 translate-y-0"
                )}
                style={{ transitionDelay: "400ms", transform: isInView ? "translateY(0)" : "translateY(20px)" }}
              >
                战略枢纽 产业引擎
              </h3>
              <p
                className={cn(
                  "text-gray-600 dark:text-gray-400 mb-6 opacity-0 transition-all duration-700 ease-out",
                  isInView && "opacity-100 translate-y-0"
                )}
                style={{ transitionDelay: "600ms", transform: isInView ? "translateY(0)" : "translateY(20px)" }}
              >
                作为印尼国家级战略项目，印尼吉配保税港工业园（JIIPE）占地3000公顷，位于印度尼西亚东爪哇省的战略要地。园区旨在打造成为工业增长中心，融合了世界一流的基础设施、公用设施及专属深水港，为跨领域企业提供全方位支持。
              </p>
              <p
                className={cn(
                  "text-gray-600 dark:text-gray-400 mb-8 opacity-0 transition-all duration-700 ease-out",
                  isInView && "opacity-100 translate-y-0"
                )}
                style={{ transitionDelay: "800ms", transform: isInView ? "translateY(0)" : "translateY(20px)" }}
              >
                JIIPE坐拥印尼经济走廊核心位置，无缝连接主要交通网络，为寻求在东南亚建立或拓展业务的企业提供无与伦比的优势。
              </p>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "战略要地",
                "深水港口",
                "设施完备",
                "能源保障",
                "税收优惠",
                "人才资源"
              ].map((feature, index) => (
                <div
                  key={feature}
                  className={cn(
                    "flex items-center gap-3 opacity-0 transition-all duration-700 ease-out",
                    isInView && "opacity-100 translate-y-0"
                  )}
                  style={{ transitionDelay: `${1000 + index * 100}ms`, transform: isInView ? "translateY(0)" : "translateY(20px)" }}
                >
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}