"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CompanyCountrySelect from "@/components/ui/CompanyCountrySelect";
import {
  Copy, Check, Calendar, Tag, ChevronRight, ChevronDown,
  ArrowUp, Send, Loader2, X, CheckCircle, AlertCircle,
  BookOpen, Share2, Building2, Globe, Clock, Menu,
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
  cta_text: string | null;
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ type, message, onClose }: { type: "success" | "error"; message: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 5000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border text-sm font-semibold max-w-md w-full animate-up ${type === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"
      }`}>
      {type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
      <span className="flex-1">{message}</span>
      <button onClick={onClose}><X size={16} className="opacity-50 hover:opacity-100" /></button>
    </div>
  );
}

// ─── Floating Sticky Nav ──────────────────────────────────────────────────────
function StickyNav({ title, headings, activeId }: { title: string; headings: { id: string; text: string; level: number }[]; activeId: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  if (!scrolled) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-4">
        {/* JIIPE Logo */}
        <a href="https://cn.jiipe.com" className="flex items-center gap-2 shrink-0">
          <img src="https://cn.jiipe.com/logo-jiipe-red.png" alt="JIIPE" className="h-7 w-auto" />
        </a>
        <div className="w-px h-5 bg-gray-200" />
        {/* Title truncated */}
        <p className="text-sm font-semibold text-gray-700 truncate flex-1">{title}</p>
        {/* ToC dropdown */}
        {headings.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-primary bg-gray-100 hover:bg-primary/10 px-3 py-1.5 rounded-full transition-all"
            >
              <BookOpen size={14} /> Contents <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 max-h-64 overflow-y-auto z-50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Table of Contents</p>
                {headings.map(({ id, text, level }) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    onClick={() => setOpen(false)}
                    className={`block py-1.5 text-sm rounded transition-colors ${level === 3 ? "pl-4 text-gray-400 hover:text-gray-700" : "text-gray-600 hover:text-primary font-medium"} ${activeId === id ? "text-primary font-bold" : ""}`}
                  >
                    {text}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
        {/* CTA */}
        <a href="#contact" className="hidden sm:flex items-center gap-1.5 text-xs font-bold bg-primary text-white px-4 py-1.5 rounded-full hover:bg-primary/90 transition-all">
          <Send size={12} /> 联系我们
        </a>
      </div>
    </div>
  );
}

// ─── Reading Progress ─────────────────────────────────────────────────────────
function ReadingProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const fn = () => {
      const el = document.documentElement;
      const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
      setPct(Math.min(100, pct));
    };
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-0.5 bg-gray-100">
      <div className="h-full bg-gradient-to-r from-primary to-red-400 transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
}

// ─── Sidebar Table of Contents ────────────────────────────────────────────────
function SidebarToC({ headings, activeId, isOpen, setIsOpen }: { headings: { id: string; text: string; level: number }[]; activeId: string; isOpen: boolean; setIsOpen: (v: boolean) => void }) {
  if (headings.length === 0) return null;

  if (!isOpen) {
    return (
      <nav className="sticky top-20 flex justify-end">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center p-3 w-12 h-12 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all text-gray-500 group"
          title="Tampilkan Daftar Isi"
        >
          <Menu size={18} className="group-hover:text-primary transition-colors shrink-0" />
        </button>
      </nav>
    );
  }

  return (
    <nav className="sticky top-20">
      <div className="bg-gray-50/80 border border-gray-200 rounded-2xl p-5 backdrop-blur-sm shadow-sm transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen size={14} className="text-primary" />
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Contents</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-700 hover:bg-gray-200/50 p-1.5 rounded-md transition-colors"
            title="Sembunyikan Daftar Isi"
          >
            <X size={14} />
          </button>
        </div>
        <ul className="space-y-0.5 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          {headings.map(({ id, text, level }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); }}
                className={`flex items-center gap-2 py-1.5 text-[13px] rounded-lg px-2 transition-all ${level === 3 ? "pl-5 text-gray-400 hover:text-gray-600" : ""} ${activeId === id
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                  }`}
              >
                {activeId === id && <span className="w-1 h-1 rounded-full bg-primary" />}
                <span className="truncate">{text}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

// ─── Floating CTA ─────────────────────────────────────────────────────────────
function FloatingCTA({ ctaLabel }: { ctaLabel: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 200);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* ── Desktop: full-width bottom bar ────────────────────────────── */}
      <div className="hidden lg:flex fixed bottom-0 left-0 right-0 z-40 items-center justify-between gap-6 px-10 py-4 bg-gray-950/95 backdrop-blur-md border-t border-white/10 shadow-2xl">
        <div className="flex items-center gap-4">
          <img
            src="https://cn.jiipe.com/logo-jiipe-white.png"
            alt="JIIPE"
            className="h-7 w-auto opacity-90 shrink-0"
          />
          <div className="w-px h-6 bg-white/20 shrink-0" />
          <p className="text-white text-sm font-bold">
            准备好在 JIIPE 扩展业务了吗？
          </p>
        </div>
        <a
          href="#contact"
          className="shrink-0 inline-flex items-center gap-2 bg-primary hover:bg-red-700 text-white text-sm font-black px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-primary/30 whitespace-nowrap"
        >
          <Send size={13} /> {ctaLabel}
        </a>
      </div>

      {/* ── Mobile: slim bottom bar ────────────────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-primary to-red-700 text-white flex items-center justify-between gap-3 px-4 py-3 shadow-2xl shadow-primary/40">
        <div className="flex items-center gap-2 min-w-0">
          <Send size={14} className="shrink-0" />
          <span className="text-xs font-bold truncate">准备好在 JIIPE 扩展业务了吗？</span>
        </div>
        <a
          href="#contact"
          className="shrink-0 bg-white text-primary text-xs font-black px-4 py-1.5 rounded-full hover:bg-gray-100 transition-all shadow-sm whitespace-nowrap"
        >
          {ctaLabel} →
        </a>
      </div>
    </>
  );
}

// ─── Rich Content ─────────────────────────────────────────────────────────────
function RichContent({ html }: { html: string }) {
  // Process the HTML to ensure any brochure links have the tracking attributes natively
  const processedHtml = React.useMemo(() => {
    if (!html) return "";
    let str = html.replace(/<a([^>]+href=["']\/brochure\/cn-jiipe\.pdf["'][^>]*)>/gi, (match, p1) => {
      let newAttrs = p1;
      if (!newAttrs.includes('data-agl-cvt="6"')) {
        newAttrs += ' data-agl-cvt="6"';
      }
      if (!newAttrs.includes('data-track="download_brochure"')) {
        newAttrs += ' data-track="download_brochure"';
      }
      return `<a${newAttrs}>`;
    });

    // Remove target="_blank" and rel from intra-page hash links (e.g. #contact)
    str = str.replace(/<a([^>]+href=["']#[^"']+["'][^>]*)>/gi, (match, p1) => {
      let newAttrs = p1
        .replace(/\s+target=["'][^"']*["']/gi, "")
        .replace(/\s+rel=["'][^"']*["']/gi, "");
      return `<a${newAttrs}>`;
    });

    return str;
  }, [html]);

  return (
    <>
      <style>{`
        .article-body h2 {
          font-size: 1.65rem;
          font-weight: 800;
          color: #111827;
          margin-top: 3rem;
          margin-bottom: 1rem;
          padding-bottom: 0.6rem;
          padding-left: 1rem;
          border-left: 4px solid #dc2626;
          border-bottom: 1px solid #f3f4f6;
          line-height: 1.3;
          letter-spacing: -0.01em;
        }
        .article-body h3 {
          font-size: 1.2rem;
          font-weight: 700;
          color: #1f2937;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          padding-left: 0.75rem;
          border-left: 3px solid #fca5a5;
          line-height: 1.4;
        }
        .article-body p {
          font-size: 1rem;
          color: #4b5563;
          line-height: 1.85;
          margin-bottom: 1rem;
        }
        .article-body ul, .article-body ol {
          margin: 1rem 0 1.25rem 1.5rem;
          color: #4b5563;
          line-height: 1.8;
        }
        .article-body ul { list-style-type: disc; }
        .article-body ol { list-style-type: decimal; }
        .article-body li { margin-bottom: 0.35rem; font-size: 0.97rem; }
        .article-body strong { color: #111827; font-weight: 700; }
        .article-body a { color: #dc2626; text-decoration: none; }
        .article-body a:hover { text-decoration: underline; }
        .article-body table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.9rem; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 8px rgba(0,0,0,0.07); }
        .article-body thead tr { background: #f9fafb; }
        .article-body th { padding: 12px 14px; font-weight: 700; color: #374151; text-align: left; border-bottom: 2px solid #e5e7eb; }
        .article-body td { padding: 11px 14px; color: #4b5563; border-bottom: 1px solid #f3f4f6; }
        .article-body tr:last-child td { border-bottom: none; }
        .article-body tr:nth-child(even) td { background: #fafafa; }
        .article-body img { max-width: 100%; border-radius: 12px; margin: 1.5rem 0; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .article-body blockquote { border-left: 4px solid #dc2626; background: #fef2f2; padding: 1rem 1.25rem; margin: 1.5rem 0; border-radius: 0 8px 8px 0; color: #7f1d1d; font-style: italic; }
        /* ── Button inserted via editor ── */
        .article-body .btn-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #dc2626;
          color: #ffffff !important;
          font-weight: 700;
          font-size: 0.9rem;
          padding: 0.6rem 1.4rem;
          border-radius: 10px;
          text-decoration: none !important;
          margin: 1rem 0;
          transition: background 0.2s, transform 0.15s;
          box-shadow: 0 4px 14px rgba(220,38,38,0.35);
          cursor: pointer;
        }
        .article-body .btn-cta:hover {
          background: #b91c1c;
          transform: translateY(-1px);
          text-decoration: none !important;
        }
        .article-body .btn-cta-outline {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          color: #dc2626 !important;
          font-weight: 700;
          font-size: 0.9rem;
          padding: 0.6rem 1.4rem;
          border-radius: 10px;
          border: 2px solid #dc2626;
          text-decoration: none !important;
          margin: 1rem 0;
          transition: background 0.2s, color 0.2s, transform 0.15s;
          cursor: pointer;
        }
        .article-body .btn-cta-outline:hover {
          background: #dc2626;
          color: #ffffff !important;
          transform: translateY(-1px);
          text-decoration: none !important;
        }
      `}</style>
      <div
        className="article-body"
        dangerouslySetInnerHTML={{ __html: processedHtml }}
      />
    </>
  );
}


// ─── Thank You Overlay ────────────────────────────────────────────────────────
function ThankYouOverlay({ name, onClose }: { name: string; onClose: () => void }) {
  const [countdown, setCountdown] = useState(25);
  const sentRef = useRef(false);

  useEffect(() => {
    // 1. Trigger Baidu tracking identical to /thank-you page
    const pushBaiduSuccess = () => {
      if (sentRef.current) return;
      if (window._agl && typeof window._agl.push === 'function') {
        window._agl.push(['track', ['success', { t: '3' }]]);
        sentRef.current = true;
        return true;
      }
      return false;
    };

    let tries = 0;
    const intervalId = setInterval(() => {
      if (pushBaiduSuccess() || ++tries >= 5) clearInterval(intervalId);
    }, 300);
    const fallbackId = setTimeout(pushBaiduSuccess, 800);

    // 2. Countdown to auto-close
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(timer); onClose(); return 0; }
        return c - 1;
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(fallbackId);
      clearInterval(timer);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-gray-950/85 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center relative animate-up">
        {/* Animated check icon */}
        <div className="mb-5 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-60" />
            <div className="relative w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <CheckCircle size={32} strokeWidth={2.5} />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-black mb-2 text-gray-900">感谢您的咨询{name ? `, ${name}` : ''}!</h2>
        <p className="text-gray-500 mb-6 text-sm leading-relaxed">
          我们已收到您的问询信息，<br />专属顾问团队会尽快与您联系。
        </p>

        {/* Chinese Desk Contact */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100">
          <h3 className="text-gray-900 font-bold mb-1">中国区专属服务</h3>
          <p className="text-xs text-gray-400 mb-3 uppercase tracking-widest font-semibold">微信扫码咨询</p>
          <img src="/wechat-barcode.png" alt="WeChat" className="w-28 h-28 mx-auto rounded-lg shadow-sm border border-gray-200 mb-3" />
          <p className="text-sm font-semibold flex items-center justify-center gap-1.5 text-gray-700">
            电话: <a href="tel:+8613641501595" className="text-primary hover:underline">+86 136 4150 1595</a>
          </p>
        </div>

        <button onClick={onClose} className="w-full py-3.5 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 hover:bg-red-700 transition-all">
          关闭窗口 ({countdown}s)
        </button>
      </div>
    </div>
  );
}

// ─── Inline RFI Form ─────────────────────────────────────────────────────────

function ArticleRFIForm() {
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [showThankYou, setShowThankYou] = useState(false);
  const [submittedName, setSubmittedName] = useState("");

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

    // Turnstile disabled per user request
    const token = "bypass";

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, cfTurnstileResponse: token }),
      });
      if (!res.ok) throw new Error("Server error");

      // Fire GA4 / gtag event for analytics tracking
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "form_submission_success", {
          event_category: "Contact Form",
          event_label: "Article RFI Form",
          value: 1,
        });
      }

      // ✅ Show inline thank-you overlay without leaving the page
      setSubmittedName(formData.lastName || formData.firstName);
      setShowThankYou(true);
    } catch {
      setToast({ type: "error", message: "提交失败，请稍后再试。" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inp = "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all";
  const lbl = "block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5";

  const STEP_LABELS = ["基本信息", "公司信息", "需求详情"];

  return (
    <section id="contact" className="relative py-24 px-4 bg-gray-950 overflow-hidden">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      {/* ── Thank You Overlay ─────────────────────────────────────────── */}
      {showThankYou && (
        <ThankYouOverlay name={submittedName} onClose={() => setShowThankYou(false)} />
      )}

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'white\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'1\' cy=\'1\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E")' }} />
      </div>

      <div className="relative max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/20 text-primary text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5">
            <Send size={12} /> 联系我们
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">
            联系我们的<span className="text-primary">投资专家</span>
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            请填写以下表格。我们的投资顾问将在24小时内与您联系，为您提供专属投资方案。
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEP_LABELS.map((label, i) => (
            <React.Fragment key={i}>
              <div
                className={`flex items-center gap-1.5 text-xs font-bold transition-all ${step === i + 1 ? "text-primary" : step > i + 1 ? "text-green-400" : "text-gray-600"}`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black transition-all ${step === i + 1 ? "bg-primary text-white shadow-lg shadow-primary/40" : step > i + 1 ? "bg-green-500 text-white" : "bg-gray-800 text-gray-500"}`}>
                  {step > i + 1 ? <Check size={12} /> : i + 1}
                </div>
                <span className="hidden sm:inline">{label}</span>
              </div>
              {i < 2 && <div className={`flex-1 h-px max-w-[60px] transition-all ${step > i + 1 ? "bg-green-500" : "bg-gray-700"}`} />}
            </React.Fragment>
          ))}
        </div>

        <Card className="bg-white/5 border-white/10 rounded-3xl backdrop-blur-md">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit}>
              {/* Step 1 */}
              {step === 1 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={lbl}>名 *</label><input required className={inp} placeholder="名" value={formData.firstName} onChange={set("firstName")} /></div>
                    <div><label className={lbl}>姓 *</label><input required className={inp} placeholder="姓" value={formData.lastName} onChange={set("lastName")} /></div>
                  </div>
                  <div><label className={lbl}>电子邮件 *</label><input required type="email" className={inp} placeholder="your@email.com" value={formData.email} onChange={set("email")} /></div>
                  <div><label className={lbl}>电话号码 *</label><input required className={inp} placeholder="+86 xxx xxxx xxxx" value={formData.phone} onChange={set("phone")} /></div>
                  <button type="button" onClick={() => setStep(2)} className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2">
                    下一步 <ChevronRight size={18} />
                  </button>
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div className="space-y-5 animate-fade-in">
                  <div><label className={lbl}>公司名称 *</label><input required className={inp} placeholder="贵公司全称" value={formData.company} onChange={set("company")} /></div>
                  <div>
                    <label className={lbl}>国家 / 地区 *</label>
                    <CompanyCountrySelect value={formData.country} onChange={(v) => setFormData((p) => ({ ...p, country: v }))} className={inp} />
                  </div>
                  <div><label className={lbl}>行业 *</label><input required className={inp} placeholder="例如：铜加工、化工、制造业" value={formData.industry} onChange={set("industry")} /></div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(1)} className="flex-1 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all">← 上一步</button>
                    <button type="button" onClick={() => setStep(3)} className="flex-1 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all">下一步 →</button>
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={lbl}>咨询目的</label>
                      <select className={inp} value={formData.reason} onChange={set("reason")}>
                        <option value="">请选择</option>
                        <option value="New investment">新投资</option>
                        <option value="Relocation">工厂迁移</option>
                        <option value="Expansion">产能扩张</option>
                        <option value="Other">其他</option>
                      </select>
                    </div>
                    <div>
                      <label className={lbl}>计划时间</label>
                      <select className={inp} value={formData.timeline} onChange={set("timeline")}>
                        <option value="">请选择</option>
                        <option value="Within 6 months">6个月内</option>
                        <option value="6–12 months">6–12 个月</option>
                        <option value="1–2 years">1–2 年</option>
                        <option value="Still exploring">仍在考察中</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={lbl}>土地需求 (公顷)</label><input className={inp} placeholder="例：5" value={formData.landPlot} onChange={set("landPlot")} /></div>
                    <div><label className={lbl}>电力需求 (MW)</label><input className={inp} placeholder="例：10" value={formData.power} onChange={set("power")} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={lbl}>用水需求 (m³/天)</label><input className={inp} placeholder="例：500" value={formData.water} onChange={set("water")} /></div>
                    <div><label className={lbl}>天然气需求 (MMBTU/年)</label><input className={inp} placeholder="例：10000" value={formData.gas} onChange={set("gas")} /></div>
                  </div>
                  <div>
                    <label className={lbl}>港口需求 (吨/年)</label>
                    <input className={inp} placeholder="例：50000" value={formData.seaport} onChange={set("seaport")} />
                  </div>
                  {formData.reason === "Other" && (
                    <div><label className={lbl}>请说明</label><input className={inp} placeholder="请详细说明..." value={formData.reasonOther} onChange={set("reasonOther")} /></div>
                  )}
                  <div className="flex gap-3 mt-4">
                    <button type="button" onClick={() => setStep(2)} className="flex-none py-4 px-6 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all">← 上一步</button>
                    <Button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/40 text-base">
                      {isSubmitting ? <><Loader2 className="animate-spin mr-2 h-4 w-4" />提交中…</> : <><Send className="mr-2 h-4 w-4" />提交咨询</>}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Trust indicators */}
        <div className="mt-8 flex items-center justify-center gap-8 text-gray-500 text-xs">
          <div className="flex items-center gap-1.5"><Globe size={14} /> 国家战略项目</div>
          <div className="flex items-center gap-1.5"><Clock size={14} /> 24小时内回复</div>
          <div className="flex items-center gap-1.5"><CheckCircle size={14} /> 免费咨询</div>
        </div>
      </div>
    </section>
  );
}

// ─── Main Landing Page ────────────────────────────────────────────────────────
export default function ArticleLandingClient({ article }: { article: Article }) {
  const [activeId, setActiveId] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const title = article.title_cn || article.title;
  const summary = article.summary_cn || article.summary;
  const content = article.content_cn || article.content;
  const cover = article.coverImage || article.og_image;
  const ctaLabel = article.cta_text || "1对1投资顾问免费对接";

  // Extract headings from pre-processed HTML (IDs already injected server-side via regex)
  const headings = React.useMemo(() => {
    const matches: { id: string; text: string; level: number }[] = [];
    const regex = /<(h2|h3)[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/\1>/gi;
    let m;
    while ((m = regex.exec(content)) !== null) {
      const tag = m[1].toLowerCase();
      const id = m[2];
      const text = m[3].replace(/<[^>]+>/g, "").trim();
      matches.push({ id, text, level: tag === "h2" ? 2 : 3 });
    }
    return matches;
  }, [content]);


  // Reading progress + scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 600);
      const scrollPos = window.scrollY + 120;
      let current = "";
      headings.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPos) current = id;
      });
      setActiveId(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const formatDate = (d: string) => {
    try { return new Date(d).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" }); }
    catch { return d; }
  };

  // Estimate reading time
  const wordCount = content.replace(/<[^>]+>/g, "").split(/\s+/).length;
  const readMins = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <>
      <style>{`
        @keyframes fade-in { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        @keyframes up { from{opacity:0;transform:translateY(20px) translateX(-50%)} to{opacity:1;transform:translateY(0) translateX(-50%)} }
        .animate-up { animation: up 0.4s ease-out; }
        @keyframes hero-in { from{opacity:0;transform:scale(1.04)} to{opacity:1;transform:scale(1)} }
        .hero-img { animation: hero-in 1.2s ease-out forwards; }
        /* Extra bottom padding on mobile to avoid content being hidden behind the floating bottom bar */
        @media (max-width: 1023px) {
          .article-mobile-pad { padding-bottom: 80px; }
        }
      `}</style>

      <ReadingProgress />
      <StickyNav title={title} headings={headings} activeId={activeId} />
      <FloatingCTA ctaLabel={ctaLabel} />

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <header className="relative w-full overflow-hidden bg-gray-950" style={{ minHeight: "75vh" }}>
        {/* Cover image */}
        {cover && (
          <div className="absolute inset-0 hero-img bg-black">
            <img src={cover} alt={title} className="w-full h-full object-cover opacity-60" />
          </div>
        )}
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'60\' height=\'60\'%3E%3Cpath d=\'M 60 0 L 0 0 0 60\' fill=\'none\' stroke=\'white\' stroke-width=\'1\'/%3E%3C/svg%3E")' }} />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 max-sm:px-6 md:px-8 flex flex-col justify-end h-full" style={{ minHeight: "75vh", paddingBottom: "5rem", paddingTop: "7rem" }}>
          <div className="animate-fade-in">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6">
              <a href="https://cn.jiipe.com" className="hover:text-white transition-colors">JIIPE</a>
              <ChevronRight size={14} />
              <span className="text-primary font-medium">{article.category}</span>
            </nav>

            {/* Category + meta */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="bg-primary/90 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded flex items-center gap-1.5 shadow-sm">
                <Tag size={11} /> {article.category}
              </span>
              <span className="text-gray-300 text-xs flex items-center gap-1.5 font-medium bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
                <Calendar size={11} /> {formatDate(article.date)}
              </span>
              <span className="text-gray-300 text-xs flex items-center gap-1.5 font-medium bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
                <Clock size={11} /> 约 {readMins} 分钟阅读
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-5 max-w-4xl tracking-tight drop-shadow-md">
              {title}
            </h1>

            {/* Summary */}
            {summary && (
              <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mb-8 whitespace-pre-line">{summary}</p>
            )}

            {/* Action row */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 text-sm"
              >
                <Send size={14} /> {ctaLabel}
              </a>
              <button
                onClick={copyLink}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-3 rounded-xl transition-all border border-white/20 text-sm"
              >
                {copied ? <><Check size={14} /> 已复制!</> : <><Share2 size={14} /> 分享</>}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── ARTICLE BODY ────────────────────────────────────────────────────── */}
      <div className="bg-white article-mobile-pad">
        <div className="max-w-7xl mx-auto px-4 max-sm:px-6 md:px-8 py-16">
          <div className="flex gap-8 lg:gap-14">
            {/* Sidebar */}
            <aside className={`hidden lg:block shrink-0 transition-all duration-500 ease-in-out relative ${sidebarOpen ? 'w-64' : 'w-12'}`}>
              <SidebarToC headings={headings} activeId={activeId} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            </aside>

            {/* Content */}
            <main className="flex-1 min-w-0">
              <RichContent html={content} />

              {/* Bottom share bar */}
              <div className="mt-16 pt-8 border-t border-gray-100 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar size={14} /> 发布于 {formatDate(article.date)}
                </div>
                <button
                  onClick={copyLink}
                  className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-primary hover:text-white text-gray-600 px-4 py-2 rounded-full transition-all"
                >
                  {copied ? <><Check size={14} /> 已复制链接</> : <><Share2 size={14} /> 复制链接</>}
                </button>
              </div>

              {/* CTA Banner */}
              <div className="mt-12 rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 p-8 md:p-10 relative">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-primary/20 to-transparent pointer-events-none" />
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-black text-white mb-2">
                      准备好在 JIIPE 扩展业务了吗？
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      加入全球领先企业的生态系统。以 JIIPE 作为您进入印度尼西亚和东南亚的战略门户。
                    </p>
                  </div>
                  <a
                    href="#contact"
                    className="shrink-0 inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 text-sm whitespace-nowrap"
                  >
                    <Send size={14} /> 立即咨询
                  </a>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* ── RFI FORM ─────────────────────────────────────────────────────────── */}
      <ArticleRFIForm />

      {/* ── FOOTER STRIP ─────────────────────────────────────────────────────── */}
      <footer className="bg-gray-950 border-t border-white/5 py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="https://cn.jiipe.com/logo-jiipe-white.png" alt="JIIPE" className="h-7 w-auto" />
          </div>
          <p className="text-gray-600 text-xs text-center">
            © {new Date().getFullYear()} PT Berkah Kawasan Manyar Sejahtera · Gresik, East Java, Indonesia
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <a href="https://cn.jiipe.com" className="hover:text-gray-400 transition-colors">主页</a>
            <a href="#contact" className="hover:text-gray-400 transition-colors">联系我们</a>
          </div>
        </div>
      </footer>

      {/* ── SCROLL TOP ───────────────────────────────────────────────────────── */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-20 right-4 z-50 lg:bottom-20 lg:right-6 w-10 h-10 rounded-full bg-primary text-white shadow-xl shadow-primary/40 flex items-center justify-center hover:bg-primary/90 hover:-translate-y-0.5 transition-all"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </>
  );
}
