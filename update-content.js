const mysql = require('mysql2/promise');
const fs = require('fs');

const envLines = fs.readFileSync('d:/WEBSITE/11.20.25/cn-jiipe-web/.env.local', 'utf8').split('\n');
const env = {};
for (const line of envLines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const idx = trimmed.indexOf('=');
  if (idx === -1) continue;
  env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
}

async function run() {
  const pool = await mysql.createPool({
    host: env.DB_HOST || 'localhost',
    port: Number(env.DB_PORT || 3306),
    database: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
  });
  const conn = await pool.getConnection();
  try {
    const newContent = `<h2>Why Chinese Companies Are Investing in Indonesia</h2>
<p>Indonesia has emerged as one of Southeast Asia's most attractive destinations for Chinese manufacturing investment. With a population of over 280 million, abundant natural resources, competitive labor costs, and rapidly improving infrastructure, Indonesia offers a compelling alternative to domestic manufacturing in China.</p>
<p>Key drivers include rising production costs in China, trade diversification strategies post-2018 US-China tariff tensions, Indonesia's growing consumer market, and the country's strategic location bridging the Indian Ocean and Pacific trade routes.</p>

<h2>Step-by-Step Process to Establish a Factory</h2>
<p>Setting up a manufacturing facility in Indonesia involves a structured sequence of legal and operational steps. Here is the complete roadmap for Chinese investors:</p>

<img src="https://ik.imagekit.io/z3fiyhjnl/JIIPE%20-%20Ports.jpg" alt="JIIPE Factory Setup Process Infographic" style="width:100%;border-radius:12px;margin:1.5rem 0;box-shadow:0 4px 20px rgba(0,0,0,0.1);" />

<ol>
  <li><strong>Step 1 — Company Incorporation:</strong> Register a PT PMA (Penanaman Modal Asing — Foreign-Owned Limited Liability Company) with BKPM (Indonesia Investment Coordinating Board). Minimum required capital: USD 10 million for foreign investment, with paid-up capital of at least USD 2.5 million.</li>
  <li><strong>Step 2 — Business Licensing (NIB):</strong> Obtain the Nomor Induk Berusaha (NIB) — a single business identification number — through the OSS (Online Single Submission) platform at oss.go.id. This integrates business registration, import licensing, and other operational permits in one system.</li>
  <li><strong>Step 3 — Land & Site Selection:</strong> Choose a certified industrial estate (Kawasan Industri) for streamlined permitting and ready-built infrastructure access. JIIPE Special Economic Zone in Gresik, East Java is among Indonesia's most strategically located estates.</li>
  <li><strong>Step 4 — Construction & Permits:</strong> Apply for IMB (Izin Mendirikan Bangunan — Building Construction Permit) and obtain environmental clearances (AMDAL). Inside an SEZ like JIIPE, these are processed through a dedicated one-stop service within the estate.</li>
  <li><strong>Step 5 — Operational Licensing:</strong> Obtain sector-specific operational licenses depending on your industry (e.g., manufacturing permit, import-export license, hazardous materials permit for chemical plants).</li>
  <li><strong>Step 6 — Hiring & Workforce:</strong> Recruit local staff through local employment agencies or job fairs. Expatriate workers require an IMTA (Izin Mempekerjakan Tenaga Kerja Asing — Foreign Worker Employment Permit), which must be renewed annually.</li>
</ol>

<h2>Industrial Park Options in Indonesia</h2>
<p>Indonesia has over 130 legally-recognized industrial estates across major islands. Key clusters for Chinese investors include:</p>
<ul>
  <li><strong>East Java — JIIPE (Gresik):</strong> SEZ-designated, integrated deep-water port, 3,000 ha. Currently hosts PT Freeport Indonesia (world's largest copper smelter), PT Hailiang Copper (world's largest copper tube maker), and 150+ other companies.</li>
  <li><strong>West Java — Karawang & Bekasi:</strong> Closest to Jakarta; suitable for consumer goods, automotive, and electronics.</li>
  <li><strong>Batam (Riau Islands):</strong> Free Trade Zone with proximity to Singapore; popular for electronics and light manufacturing.</li>
  <li><strong>Central Java — Kendal Industrial Park:</strong> Sino-Indonesian joint venture; strong for textiles, garments, and footwear.</li>
</ul>

<h2>Cost Comparison vs China</h2>
<table style="width:100%;border-collapse:collapse;">
  <thead><tr style="background:#f4f4f4;"><th style="padding:12px 14px;border-bottom:2px solid #e5e7eb;text-align:left;">Factor</th><th style="padding:12px 14px;border-bottom:2px solid #e5e7eb;">China (Avg.)</th><th style="padding:12px 14px;border-bottom:2px solid #e5e7eb;">Indonesia (JIIPE)</th></tr></thead>
  <tbody>
    <tr><td style="padding:11px 14px;border-bottom:1px solid #f3f4f6;">Labor Cost (USD/month)</td><td style="padding:11px 14px;border-bottom:1px solid #f3f4f6;text-align:center;">$500–$800</td><td style="padding:11px 14px;border-bottom:1px solid #f3f4f6;text-align:center;color:#16a34a;font-weight:700;">$200–$350</td></tr>
    <tr><td style="padding:11px 14px;border-bottom:1px solid #f3f4f6;background:#fafafa;">Land Price (USD/m²)</td><td style="padding:11px 14px;border-bottom:1px solid #f3f4f6;background:#fafafa;text-align:center;">$150–$300</td><td style="padding:11px 14px;border-bottom:1px solid #f3f4f6;background:#fafafa;text-align:center;color:#16a34a;font-weight:700;">$60–$100</td></tr>
    <tr><td style="padding:11px 14px;border-bottom:1px solid #f3f4f6;">Corporate Tax Rate</td><td style="padding:11px 14px;border-bottom:1px solid #f3f4f6;text-align:center;">25%</td><td style="padding:11px 14px;border-bottom:1px solid #f3f4f6;text-align:center;color:#16a34a;font-weight:700;">10–22% (SEZ)</td></tr>
    <tr><td style="padding:11px 14px;background:#fafafa;">Electricity (per kWh)</td><td style="padding:11px 14px;background:#fafafa;text-align:center;">$0.08</td><td style="padding:11px 14px;background:#fafafa;text-align:center;color:#16a34a;font-weight:700;">$0.07–$0.09</td></tr>
  </tbody>
</table>

<h2>Incentives and Government Policies</h2>
<p>Indonesia offers robust incentives for foreign investors, especially within Special Economic Zones (SEZ) like JIIPE:</p>
<ul>
  <li><strong>Tax Holiday:</strong> Corporate income tax exemption for 5–20 years based on investment value and strategic sector classification.</li>
  <li><strong>Import Duty Exemption:</strong> 0% import duty on machinery, raw materials, and capital goods used in production.</li>
  <li><strong>VAT Exemption:</strong> Goods and services delivered within the SEZ zone are exempt from Value Added Tax (PPN).</li>
  <li><strong>Super Deduction:</strong> Up to 300% deduction for R&D expenditure and vocational training programs.</li>
  <li><strong>Land Right Stability:</strong> Hak Guna Bangunan (HGB) land-use rights up to 80 years for industrial investors.</li>
</ul>

<h2>Logistics Access and Export Routes to China</h2>
<p>JIIPE's integrated deep-water port (draft capacity of -16m LWS) enables direct container shipping to major Chinese ports including Shanghai, Ningbo, Guangzhou, and Xiamen — with no need for transshipment via Singapore.</p>

<blockquote>Typical transit time from JIIPE Port to South China ports: <strong>7–12 days</strong>. Regular direct shipping lines operate weekly, significantly reducing logistics costs compared to routes via hub ports.</blockquote>

<h3>Port Capabilities at JIIPE</h3>
<ul>
  <li>Draft capacity: -16m LWS (suitable for Panamax-class vessels)</li>
  <li>Annual throughput: 5 million tons capacity</li>
  <li>Multipurpose: containers, bulk cargo, liquid cargo, heavy lifts</li>
  <li>Distance from factory plots: less than 3 km, via dedicated internal roads</li>
</ul>`;

    await conn.query(
      "UPDATE articles SET content = ? WHERE slug = 'investing-in-indonesia'",
      [newContent]
    );
    console.log('Updated: investing-in-indonesia content');
  } finally {
    conn.release();
    await pool.end();
  }
}
run().catch(e => { console.error(e); process.exit(1); });
