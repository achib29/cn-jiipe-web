"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import CompanyCountrySelect from "@/components/ui/CompanyCountrySelect";
import {
  Copy, Check, Calendar, Tag, ChevronRight,
  ArrowUp, Send, Loader2, X, CheckCircle, AlertCircle,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Article {
  id: number;
  title: string;
  title_cn: string | null;
  slug: string;
  category: string;
  summary: string;
  summary_cn: string | null;
  content: string;
  content_cn: string | null;
  coverImage: string | null;
  og_image: string | null;
  date: string;
}

// ─── Toast Component ─────────────────────────────────────────────────────────
function Toast({ type, message, onClose }: { type: "success" | "error"; message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border text-sm font-semibold max-w-sm animate-slide-in-up ${
      type === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"
    }`}>
      {type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="opacity-60 hover:opacity-100 transition"><X size={16} /></button>
    </div>
  );
}

// ─── Share Bar ───────────────────────────────────────────────────────────────
function ShareBar() {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 hidden xl:flex">
      <button
        onClick={copy}
        title="Copy link"
        className="w-11 h-11 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
      >
        {copied ? <Check size={18} /> : <Copy size={18} />}
      </button>
    </div>
  );
}

// ─── Table of Contents ───────────────────────────────────────────────────────
function TableOfContents({ content }: { content: string }) {
  const [activeId, setActiveId] = useState("");

  const headings = React.useMemo(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const els = Array.from(doc.querySelectorAll("h2, h3"));
    return els.map((el, i) => ({
      id: `heading-${i}`,
      text: el.textContent || "",
      level: el.tagName === "H2" ? 2 : 3,
    }));
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-20% 0% -70% 0%" }
    );
    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-8 bg-gray-50 rounded-2xl p-5 border border-gray-200">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Table of Contents</p>
      <ul className="space-y-1">
        {headings.map(({ id, text, level }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={`block text-sm py-1 rounded transition-all duration-150 ${
                level === 3 ? "pl-4" : ""
              } ${
                activeId === id
                  ? "text-primary font-semibold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// ─── Rich Content Renderer ───────────────────────────────────────────────────
function RichContent({ html }: { html: string }) {
  const enriched = React.useMemo(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    let idx = 0;
    doc.querySelectorAll("h2, h3").forEach((el) => {
      el.id = `heading-${idx++}`;
    });
    return doc.body.innerHTML;
  }, [html]);

  return (
    <div
      className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-l-4 prose-h2:border-primary prose-h2:pl-4 prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3 prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700 prose-strong:text-gray-900 prose-a:text-primary prose-table:text-sm"
      dangerouslySetInnerHTML={{ __html: enriched }}
    />
  );
}

// ─── Inline RFI Form ─────────────────────────────────────────────────────────
declare global {
  interface Window { turnstile: { reset: (id?: string) => void }; }
}

function ArticleRFIForm() {
  const router = useRouter();
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", phone: "", email: "", company: "",
    country: "", reason: "", reasonOther: "", industry: "",
    landPlot: "", timeline: "", power: "", water: "", gas: "", seaport: "",
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFormData((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (formData.reason === "Other" && !formData.reasonOther.trim()) {
      setToast({ type: "error", message: "请填写其他原因的详情。" });
      setIsSubmitting(false);
      return;
    }

    const isLocal = typeof window !== "undefined" && window.location.hostname === "localhost";
    const token = isLocal
      ? "bypass"
      : (document.querySelector('input[name="cf-turnstile-response"]') as HTMLInputElement)?.value;

    if (!isLocal && !token) {
      setToast({ type: "error", message: "验证失败，请刷新页面重试。" });
      setIsSubmitting(false);
      return;
    }

    if (typeof window !== "undefined") {
      sessionStorage.setItem("allowThankYou", "1");
      sessionStorage.setItem("lastName", formData.lastName);
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, cfTurnstileResponse: token }),
      });
      if (!res.ok) throw new Error("Server error");
      router.push("/thank-you");
    } catch {
      setToast({ type: "error", message: "提交失败，请稍后再试。" });
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition";
  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1";

  return (
    <section id="contact" className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20 px-4 mt-20">
      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-primary/20 text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            联系我们
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">联系我们的投资专家</h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
            请填写以下表格。我们的投资顾问将很快与您联系，讨论您的具体工业需求。
          </p>
        </div>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className={labelClass}>名 (First Name) *</label>
                <input required className={inputClass} placeholder="名" value={formData.firstName} onChange={set("firstName")} />
              </div>
              <div>
                <label className={labelClass}>姓 (Last Name) *</label>
                <input required className={inputClass} placeholder="姓" value={formData.lastName} onChange={set("lastName")} />
              </div>

              {/* Email */}
              <div>
                <label className={labelClass}>电子邮件 *</label>
                <input required type="email" className={inputClass} placeholder="your@email.com" value={formData.email} onChange={set("email")} />
              </div>

              {/* Phone */}
              <div>
                <label className={labelClass}>电话号码 *</label>
                <input required className={inputClass} placeholder="+86 xxx xxxx xxxx" value={formData.phone} onChange={set("phone")} />
              </div>

              {/* Company */}
              <div>
                <label className={labelClass}>公司名称 *</label>
                <input required className={inputClass} placeholder="贵公司名称" value={formData.company} onChange={set("company")} />
              </div>

              {/* Country */}
              <div>
                <label className={labelClass}>国家 / 地区 *</label>
                <CompanyCountrySelect
                  value={formData.country}
                  onChange={(v: string) => setFormData((p) => ({ ...p, country: v }))}
                  className={inputClass}
                />
              </div>

              {/* Industry */}
              <div>
                <label className={labelClass}>行业 *</label>
                <input required className={inputClass} placeholder="例如：铜加工、化工" value={formData.industry} onChange={set("industry")} />
              </div>

              {/* Land plot */}
              <div>
                <label className={labelClass}>土地面积需求 (公顷)</label>
                <input className={inputClass} placeholder="例如：5" value={formData.landPlot} onChange={set("landPlot")} />
              </div>

              {/* Timeline */}
              <div>
                <label className={labelClass}>计划建设时间</label>
                <select className={inputClass} value={formData.timeline} onChange={set("timeline")}>
                  <option value="">请选择</option>
                  <option value="Within 6 months">6个月内</option>
                  <option value="6–12 months">6–12 个月</option>
                  <option value="1–2 years">1–2 年</option>
                  <option value="Still exploring">仍在考察中</option>
                </select>
              </div>

              {/* Reason */}
              <div>
                <label className={labelClass}>咨询目的</label>
                <select className={inputClass} value={formData.reason} onChange={set("reason")}>
                  <option value="">请选择</option>
                  <option value="New investment">新投资</option>
                  <option value="Relocation">工厂迁移</option>
                  <option value="Expansion">产能扩张</option>
                  <option value="Other">其他</option>
                </select>
              </div>

              {formData.reason === "Other" && (
                <div className="md:col-span-2">
                  <label className={labelClass}>请说明</label>
                  <input className={inputClass} placeholder="请详细说明..." value={formData.reasonOther} onChange={set("reasonOther")} />
                </div>
              )}

              {/* Utilities — Power & Water */}
              <div>
                <label className={labelClass}>电力需求 (MW)</label>
                <input className={inputClass} placeholder="例如：10" value={formData.power} onChange={set("power")} />
              </div>
              <div>
                <label className={labelClass}>用水量 (m³/day)</label>
                <input className={inputClass} placeholder="例如：500" value={formData.water} onChange={set("water")} />
              </div>

              {/* Turnstile placeholder (production) */}
              {typeof window !== "undefined" && window.location.hostname !== "localhost" && (
                <div className="md:col-span-2">
                  <div className="cf-turnstile" data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} />
                </div>
              )}

              {/* Submit */}
              <div className="md:col-span-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl text-base font-bold shadow-lg shadow-primary/30 transition-all"
                >
                  {isSubmitting ? (
                    <><Loader2 className="animate-spin mr-2 h-4 w-4" /> 提交中…</>
                  ) : (
                    <><Send className="mr-2 h-4 w-4" /> 提交咨询</>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

// ─── Main Landing Page Client ─────────────────────────────────────────────────
export default function ArticleLandingClient({ article }: { article: Article }) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const title = article.title_cn || article.title;
  const summary = article.summary_cn || article.summary;
  const content = article.content_cn || article.content;
  const cover = article.og_image || article.coverImage;

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString("zh-CN", {
        year: "numeric", month: "long", day: "numeric",
      });
    } catch { return d; }
  };

  return (
    <>
      {/* Global slide-in animation */}
      <style>{`
        @keyframes slide-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in-up { animation: slide-in-up 0.4s ease-out; }
        @keyframes fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .fade-in { animation: fade-in 0.6s ease-out; }
      `}</style>

      <ShareBar />

      {/* ── HERO ── */}
      <header className="relative w-full min-h-[60vh] flex items-end overflow-hidden bg-gray-900">
        {cover && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{ backgroundImage: `url(${cover})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 pb-16 pt-32 w-full fade-in">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6">
            <span>JIIPE</span>
            <ChevronRight size={14} />
            <span className="text-primary">{article.category}</span>
          </nav>

          {/* Category badge */}
          <div className="flex items-center gap-3 mb-5">
            <span className="bg-primary text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Tag size={12} /> {article.category}
            </span>
            <span className="text-gray-400 text-xs flex items-center gap-1.5">
              <Calendar size={12} /> {formatDate(article.date)}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
            {title}
          </h1>

          {/* Summary */}
          {summary && (
            <p className="text-gray-300 text-lg max-w-3xl leading-relaxed">
              {summary}
            </p>
          )}
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex gap-12">
          {/* Sidebar — ToC */}
          <aside className="hidden lg:block w-72 shrink-0">
            <TableOfContents content={content} />
          </aside>

          {/* Article body */}
          <main className="flex-1 min-w-0">
            <RichContent html={content} />

            {/* Mobile Copy Link */}
            <div className="mt-12 pt-8 border-t border-gray-200 flex items-center gap-3 lg:hidden">
              <span className="text-sm text-gray-500">Share:</span>
              <button
                onClick={() => navigator.clipboard.writeText(window.location.href)}
                className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-primary hover:text-white px-4 py-2 rounded-full transition-all"
              >
                <Copy size={14} /> Copy Link
              </button>
            </div>

            {/* JIIPE Promo Banner */}
            <div className="mt-16 rounded-3xl overflow-hidden bg-gradient-to-br from-primary to-red-800 p-8 text-white relative">
              <div className="absolute inset-0 opacity-10">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <pattern id="dots" width="8" height="8" patternUnits="userSpaceOnUse">
                      <circle cx="1" cy="1" r="1" fill="white" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#dots)" />
                </svg>
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-3">准备好在 JIIPE 扩展您的业务了吗？</h3>
                <p className="text-white/80 mb-6 text-sm max-w-lg">
                  加入由全球领袖组成的蓬勃发展的生态系统。以 JIIPE 作为您进入印度尼西亚和东南亚的战略门户。
                </p>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 bg-white text-primary font-bold px-6 py-3 rounded-xl hover:bg-gray-50 transition-all text-sm"
                >
                  联系我们的投资团队 <ChevronRight size={16} />
                </a>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* ── RFI FORM ── */}
      <ArticleRFIForm />

      {/* ── FOOTER STRIP ── */}
      <footer className="bg-gray-900 border-t border-white/10 py-6 px-4 text-center text-gray-500 text-xs">
        © {new Date().getFullYear()} PT Berkah Kawasan Manyar Sejahtera — JIIPE Industrial Estate, Gresik, East Java.
      </footer>

      {/* ── SCROLL TO TOP ── */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all xl:bottom-6"
          aria-label="Scroll to top"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </>
  );
}
