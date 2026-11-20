"use client";

// Promo links from the homepage to the Chemical Industry landing page.
// - ChemicalHeroLabel / ChemicalHeroButton: shown in the hero.
// - ChemicalFloatCard: slides in at the bottom-right after the visitor scrolls
//   past most of the hero; closing it hides it for the rest of the visit.

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, FlaskConical, X } from "lucide-react";

export const CHEMICAL_URL = "/articles/chemical-industry-jiipe";
const CARD_IMAGE = "/api/images/224";
const DISMISS_KEY = "chemPromoDismissed";

function track(label: string) {
  if (typeof window === "undefined") return;
  const w = window as any;
  try {
    w.gtag?.("event", "chemical_promo_click", { event_category: "Chemical Promo", event_label: label });
    w._hmt?.push(["_trackEvent", "Chemical Promo", "Click", label]);
  } catch {
    /* analytics must never break navigation */
  }
}

export function ChemicalHeroLabel() {
  return (
    <Link
      href={CHEMICAL_URL}
      onClick={() => track("hero_label")}
      className="group mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-white/30 bg-white/10 py-1 pl-1 pr-4 text-sm text-white backdrop-blur-md transition-colors hover:bg-white/20"
    >
      <span className="shrink-0 rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-bold">新</span>
      <span className="truncate">印尼化工产业展望 · 专题报告</span>
      <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

export function ChemicalHeroButton() {
  return (
    <Link
      href={CHEMICAL_URL}
      onClick={() => track("hero_button")}
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-white px-8 text-sm font-semibold text-red-600 shadow-lg transition-colors hover:bg-gray-100 sm:w-auto"
    >
      <FlaskConical className="h-4 w-4" />
      探索化工产业园
    </Link>
  );
}

export function ChemicalFloatCard() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      setDismissed(sessionStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      setDismissed(false);
    }
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  if (dismissed) return null;

  return (
    <div
      data-chem-card
      aria-hidden={!visible}
      className={`fixed bottom-4 right-4 z-40 w-[min(320px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-black/5 bg-white shadow-2xl transition-all duration-500 ease-out motion-reduce:transition-none md:bottom-6 md:right-6 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <div className="relative h-28 bg-cover bg-center" style={{ backgroundImage: `url(${CARD_IMAGE})` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-black/10" />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-red-600 px-2 py-0.5 text-[11px] font-bold text-white">
          <FlaskConical className="h-3 w-3" />
          化工专题
        </span>
        <button
          type="button"
          onClick={close}
          aria-label="关闭"
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60"
        >
          <X className="h-4 w-4" />
        </button>
        <p className="absolute bottom-2 left-3 right-3 text-sm font-bold leading-snug text-white">
          JIIPE 化工产业集群：中国化工企业落地印尼的首选
        </p>
      </div>
      <div className="p-4">
        <p className="text-xs leading-relaxed text-gray-600">深水港与水、电、气等公用设施一体化，助力化工企业高效落地印尼。</p>
        <Link
          href={CHEMICAL_URL}
          tabIndex={visible ? 0 : -1}
          onClick={() => track("float_card")}
          className="mt-3 flex h-10 items-center justify-center gap-1.5 rounded-lg bg-red-600 text-sm font-semibold text-white transition-colors hover:bg-red-700"
        >
          阅读专题 <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
