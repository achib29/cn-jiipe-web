// Corporate-email enforcement for RFI / contact forms.
// Shared by the client forms (instant feedback) and /api/contact (the real guard).

export const FREE_EMAIL_DOMAINS = new Set<string>([
  // Global
  "gmail.com", "googlemail.com",
  "yahoo.com", "yahoo.co.id", "yahoo.co.uk", "yahoo.co.jp", "yahoo.com.sg", "yahoo.com.hk",
  "yahoo.com.tw", "yahoo.com.cn", "ymail.com", "rocketmail.com",
  "hotmail.com", "hotmail.co.uk", "hotmail.co.id", "outlook.com", "outlook.co.id",
  "live.com", "msn.com", "windowslive.com",
  "icloud.com", "me.com", "mac.com",
  "aol.com", "aim.com",
  "proton.me", "protonmail.com", "pm.me", "tutanota.com", "tuta.io",
  "gmx.com", "gmx.net", "gmx.de", "mail.com", "email.com", "zoho.com", "zohomail.com",
  "yandex.com", "yandex.ru", "mail.ru", "inbox.ru", "list.ru", "bk.ru",
  "fastmail.com", "hushmail.com", "lycos.com", "rediffmail.com", "web.de", "t-online.de",
  // China / Taiwan / HK (qq.com and 163.com are intentionally allowed —
  // many legitimate Chinese companies use them)
  "foxmail.com", "126.com", "yeah.net", "vip.163.com", "vip.126.com",
  "sina.com", "sina.cn", "vip.sina.com", "sohu.com", "aliyun.com", "139.com", "189.cn",
  "wo.cn", "21cn.com", "tom.com", "hinet.net", "pchome.com.tw", "seed.net.tw",
  // Japan / Korea
  "naver.com", "daum.net", "hanmail.net", "kakao.com", "nate.com",
  "docomo.ne.jp", "ezweb.ne.jp", "softbank.ne.jp", "i.softbank.jp",
  // Disposable / temporary
  "mailinator.com", "guerrillamail.com", "10minutemail.com", "tempmail.com",
  "temp-mail.org", "yopmail.com", "trashmail.com", "sharklasers.com", "getnada.com",
  "dispostable.com", "maildrop.cc", "throwawaymail.com",
]);

export const CORPORATE_EMAIL_ERROR_EN =
  "Please use your company/corporate email address. Personal email addresses (e.g. Gmail, Yahoo, Outlook) are not accepted.";

export const CORPORATE_EMAIL_ERROR = "请使用企业邮箱（不接受 Gmail、Yahoo、Outlook 等个人邮箱）";

export function isCorporateEmail(email: unknown): boolean {
  if (typeof email !== "string") return false;
  const value = email.trim().toLowerCase();
  const at = value.lastIndexOf("@");
  if (at < 1 || at === value.length - 1) return false;
  const domain = value.slice(at + 1);
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(domain)) return false;
  if (FREE_EMAIL_DOMAINS.has(domain)) return false;
  // Also catch subdomains like "mail.yahoo.com"
  const parts = domain.split(".");
  for (let i = 1; i < parts.length - 1; i++) {
    if (FREE_EMAIL_DOMAINS.has(parts.slice(i).join("."))) return false;
  }
  return true;
}
