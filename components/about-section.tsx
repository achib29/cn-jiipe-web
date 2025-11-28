"use client";

import { useRef } from "react";
import { CheckCircle2, Play } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

export default function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, threshold: 0.3 });

  // Link Video
  const videoLink =
    "https://player.bilibili.com/player.html?isOutside=true&aid=114872088010011&bvid=BV1ubguzDEyd&cid=31119049247&p=1";

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* --- Image Side --- */}
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
            <div className="aspect-video overflow-hidden rounded-lg shadow-xl relative group">
              {/* Cover Image */}
              <img
                src="/images/jiipe-about-cover.jpg"
                alt="JIIPE Gate"
                className="w-full h-full object-cover"
              />

              {/* Soft overlay */}
              <div className="absolute inset-0 bg-black/10 pointer-events-none" />

              {/* CENTER PLAY BUTTON – dipakai di semua layar */}
              <a
                href={videoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex items-center justify-center z-20 group/play cursor-pointer"
              >
                <div className="relative flex items-center justify-center">
                  {/* ripple */}
                  <span className="absolute h-full w-full rounded-full bg-white opacity-30 animate-ping duration-1000" />
                  {/* circle + play */}
                  <div className="relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white bg-white/10 backdrop-blur-sm shadow-xl transition-all duration-300 group-hover/play:scale-110">
                    <svg
                      className="w-9 h-9 md:w-10 md:h-10 text-white fill-white translate-x-0.5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </a>

              {/* CAPSULE BUTTON – hanya muncul di md ke atas */}
              <a
                href={videoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex absolute bottom-5 left-5 z-30 group/capsule"
              >
                <div className="flex items-center gap-3 bg-white/95 backdrop-blur-sm px-5 py-3 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-white/50 transition-all duration-300 transform group-hover/capsule:-translate-y-1 group-hover/capsule:shadow-xl">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 shrink-0">
                    <Play className="h-4 w-4 text-red-600 fill-red-600 ml-0.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-gray-500 tracking-wider leading-none mb-1">
                      点击播放
                    </span>
                    <span className="text-base font-bold text-gray-900 leading-none">
                      观看视频
                    </span>
                  </div>
                  <svg
                    className="w-4 h-4 text-gray-400 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </a>
            </div>

            {/* decorative glow */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
          </div>

          {/* --- Content Side --- */}
          <div>
            <div className="flex flex-col gap-2">
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
                关于印尼吉配保税港工业园（JIIPE）
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
                战略枢纽 产业引擎
              </h3>
              <p
                className={cn(
                  "text-gray-600 dark:text-gray-400 mb-6 opacity-0 transition-all duration-700 ease-out",
                  isInView && "opacity-100 translate-y-0"
                )}
                style={{
                  transitionDelay: "600ms",
                  transform: isInView ? "translateY(0)" : "translateY(20px)",
                }}
              >
                作为印尼国家级战略项目，印尼吉配保税港工业园（JIIPE）占地3000公顷，
                位于印度尼西亚东爪哇省的战略要地。园区旨在打造成为工业增长中心，融合了世界一流的基础设施、公用设施及专属深水港，为跨领域企业提供全方位支持。
              </p>
              <p
                className={cn(
                  "text-gray-600 dark:text-gray-400 mb-8 opacity-0 transition-all duration-700 ease-out",
                  isInView && "opacity-100 translate-y-0"
                )}
                style={{
                  transitionDelay: "800ms",
                  transform: isInView ? "translateY(0)" : "translateY(20px)",
                }}
              >
                JIIPE坐拥印尼经济走廊核心位置，无缝连接主要交通网络，为寻求在东南亚建立或拓展业务的企业提供无与伦比的优势。
              </p>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["战略要地", "深水港口", "设施完备", "能源保障", "税收优惠", "人才资源"].map(
                (feature, index) => (
                  <div
                    key={feature}
                    className={cn(
                      "flex items-center gap-3 opacity-0 transition-all duration-700 ease-out",
                      isInView && "opacity-100 translate-y-0"
                    )}
                    style={{
                      transitionDelay: `${1000 + index * 100}ms`,
                      transform: isInView ? "translateY(0)" : "translateY(20px)",
                    }}
                  >
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    <span>{feature}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
