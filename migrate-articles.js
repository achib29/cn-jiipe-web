const mysql = require('mysql2/promise');
const fs = require('fs');

// Manually parse .env.local
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
    const [cols] = await conn.query('SHOW COLUMNS FROM articles');
    const colNames = cols.map(c => c.Field);

    if (!colNames.includes('type')) {
      await conn.query("ALTER TABLE articles ADD COLUMN type VARCHAR(20) DEFAULT 'news' AFTER status");
      console.log('added: type');
    }

    if (!colNames.includes('og_image')) {
      await conn.query('ALTER TABLE articles ADD COLUMN og_image TEXT DEFAULT NULL AFTER coverImage');
      console.log('added: og_image');
    }

    const pages = [
      {
        title: 'Investing in and Building Factories in Indonesia',
        title_cn: '在印度尼西亚投资建厂',
        slug: 'investing-in-indonesia',
        category: 'Investment Guide',
        status: 'Published',
        type: 'landing',
        date: '2025-01-15',
        og_image: 'https://ik.imagekit.io/z3fiyhjnl/PT%20Hailiang%20%26%20PT%20Freeport%20Indonesia.jpg',
        coverImage: 'https://ik.imagekit.io/z3fiyhjnl/PT%20Hailiang%20%26%20PT%20Freeport%20Indonesia.jpg',
        summary: 'A comprehensive guide for Chinese companies on investing and building manufacturing facilities in Indonesia.',
        summary_cn: '为中国企业提供在印度尼西亚投资建立制造业设施的全面指南。',
        content: `<h2>Why Chinese Companies Are Investing in Indonesia</h2><p>Indonesia has emerged as one of Southeast Asia's most attractive destinations for Chinese manufacturing investment. With a population of over 280 million, abundant natural resources, competitive labor costs, and rapidly improving infrastructure, Indonesia offers a compelling alternative to domestic manufacturing in China.</p><h2>Step-by-Step Process to Establish a Factory</h2><ol><li><strong>Company Incorporation:</strong> Register a PT PMA with BKPM. Required capital: minimum USD 10 million.</li><li><strong>Business Licensing:</strong> Obtain NIB via the OSS platform.</li><li><strong>Land & Site Selection:</strong> Choose a certified industrial estate like JIIPE for streamlined permitting.</li><li><strong>Construction & Permits:</strong> Apply for IMB and environmental clearances (AMDAL).</li><li><strong>Operational Licensing:</strong> Obtain sector-specific licenses.</li><li><strong>Hiring:</strong> Recruit local staff; expatriates require IMTA permits.</li></ol><h2>Industrial Park Options in Indonesia</h2><ul><li><strong>East Java — JIIPE (Gresik):</strong> SEZ-designated, deep-water port, 3,000 ha. Hosts Freeport and Hailiang Copper.</li><li><strong>West Java — Karawang & Bekasi:</strong> Closest to Jakarta; automotive and consumer goods.</li><li><strong>Batam:</strong> Free Trade Zone; electronics and light manufacturing.</li><li><strong>Central Java — Kendal:</strong> Sino-Indonesian joint venture; textiles and garments.</li></ul><h2>Cost Comparison vs China</h2><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#f4f4f4;"><th style="padding:10px;border:1px solid #ddd;">Factor</th><th style="padding:10px;border:1px solid #ddd;">China</th><th style="padding:10px;border:1px solid #ddd;">Indonesia (JIIPE)</th></tr></thead><tbody><tr><td style="padding:10px;border:1px solid #ddd;">Labor (USD/month)</td><td style="padding:10px;border:1px solid #ddd;">$500–$800</td><td style="padding:10px;border:1px solid #ddd;">$200–$350</td></tr><tr><td style="padding:10px;border:1px solid #ddd;">Land (USD/m²)</td><td style="padding:10px;border:1px solid #ddd;">$150–$300</td><td style="padding:10px;border:1px solid #ddd;">$60–$100</td></tr><tr><td style="padding:10px;border:1px solid #ddd;">Corporate Tax</td><td style="padding:10px;border:1px solid #ddd;">25%</td><td style="padding:10px;border:1px solid #ddd;">10–22% (SEZ reduced)</td></tr></tbody></table><h2>Incentives and Government Policies</h2><ul><li><strong>Tax Holiday:</strong> 5–20 years exemption based on investment size.</li><li><strong>Import Duty Exemption:</strong> 0% on machinery and raw materials.</li><li><strong>VAT Exemption:</strong> For goods within the SEZ.</li><li><strong>Super Deduction:</strong> Up to 300% for R&D expenses.</li></ul><h2>Logistics Access and Export Routes to China</h2><p>JIIPE's deep-water port (draft -16m LWS) enables direct container shipping to Shanghai, Ningbo, Guangzhou, and Xiamen. Typical transit: <strong>7–12 days</strong> to South China ports.</p>`,
        content_cn: null,
      },
      {
        title: 'Indonesian Industrial Parks for Chinese Investors',
        title_cn: '为中国投资者提供的印度尼西亚工业园区',
        slug: 'industrial-parks-indonesia',
        category: 'Industrial Parks',
        status: 'Published',
        type: 'landing',
        date: '2025-02-01',
        og_image: 'https://ik.imagekit.io/z3fiyhjnl/JIIPE%20-%20Ports.jpg',
        coverImage: 'https://ik.imagekit.io/z3fiyhjnl/JIIPE%20-%20Ports.jpg',
        summary: 'An overview of Indonesia\'s top industrial parks for Chinese investors seeking to expand in Southeast Asia.',
        summary_cn: '为寻求在东南亚扩展的中国投资者提供印度尼西亚顶级工业园区概述。',
        content: `<h2>Overview of Industrial Parks in Indonesia</h2><p>Indonesia operates over 130 legally recognized industrial estates across major islands. These parks offer purpose-built infrastructure, streamlined licensing, and investor-ready facilities designed to accelerate manufacturing setup timelines from years to months.</p><h2>Advantages of Locating Within an Industrial Park</h2><ul><li><strong>One-Stop Licensing:</strong> SEZ-designated parks like JIIPE handle all permits under one roof.</li><li><strong>Ready Infrastructure:</strong> Roads, power, water, and telecom are pre-installed.</li><li><strong>Security & Maintenance:</strong> 24/7 professional estate management.</li><li><strong>Government Incentive Access:</strong> Investors automatically qualify for tax holidays and import exemptions.</li></ul><h2>Infrastructure and Utilities at JIIPE</h2><ul><li>Dedicated <strong>500 MW power plant</strong> with grid redundancy</li><li><strong>Water treatment</strong> capable of 10,000 m³/day</li><li><strong>Natural gas pipeline</strong> directly from Pertamina</li><li>High-speed <strong>fiber optic telecommunications</strong></li><li>Integrated <strong>wastewater treatment plant</strong></li></ul><h2>Logistics Connectivity</h2><ul><li>JIIPE Port — deep-water multipurpose terminal adjacent to the industrial zone</li><li>Direct highway connection to Tanjung Perak and Juanda Airport</li><li>Juanda International Airport — 45 minutes for air freight</li><li>Rail freight terminal access</li></ul><h2>Key Sectors and Investment Opportunities</h2><ul><li>🏭 Copper smelting & processing (Hailiang Copper — world's largest copper tube manufacturer)</li><li>⚗️ Petrochemical industry</li><li>⚡ Battery materials and EV components</li><li>🔩 Metal fabrication</li><li>🏗️ Heavy equipment and construction materials</li></ul>`,
        content_cn: null,
      },
      {
        title: 'ODI Registration Guide for Chinese Companies Investing Overseas',
        title_cn: '中国企业境外直接投资（ODI）备案指南',
        slug: 'odi-registration-guide',
        category: 'Regulatory Guide',
        status: 'Published',
        type: 'landing',
        date: '2025-02-15',
        og_image: 'https://ik.imagekit.io/z3fiyhjnl/Gate%20-%20JIIPE.jpg',
        coverImage: 'https://ik.imagekit.io/z3fiyhjnl/Gate%20-%20JIIPE.jpg',
        summary: 'A step-by-step guide to China\'s ODI registration process for companies planning to invest in Indonesia.',
        summary_cn: '为计划在印度尼西亚投资的企业提供中国ODI备案流程的逐步说明。',
        content: `<h2>What is ODI (Outward Direct Investment)?</h2><p>ODI (对外直接投资) refers to investments made by Chinese enterprises into foreign entities. Any Chinese company planning to invest in Indonesia must complete ODI registration before remitting funds overseas. This is managed by three government agencies: <strong>NDRC, MOFCOM, and SAFE</strong>.</p><h2>Regulatory Authorities</h2><ul><li><strong>NDRC:</strong> Reviews ODI projects above USD 300 million or in sensitive industries.</li><li><strong>MOFCOM:</strong> Responsible for ODI registration for all outbound investments.</li><li><strong>SAFE:</strong> Manages the foreign exchange component — approves remittance of RMB overseas.</li></ul><h2>ODI Filing Process — Step by Step</h2><ol><li><strong>Internal Feasibility Study:</strong> Prepare a project feasibility report.</li><li><strong>NDRC Registration:</strong> Submit via the NDRC enterprise overseas investment system.</li><li><strong>MOFCOM Registration:</strong> Submit to MOFCOM or provincial Commerce Bureau.</li><li><strong>Certificate Issuance:</strong> Receive the "Certificate of Overseas Investment Enterprise."</li><li><strong>SAFE Registration:</strong> Apply for foreign exchange registration.</li><li><strong>Overseas Company Establishment:</strong> Register the PT PMA in Indonesia.</li><li><strong>Annual Reporting:</strong> Submit annual reports to MOFCOM and SAFE.</li></ol><h2>Required Documentation</h2><ul><li>Business license of the investing entity</li><li>Board resolution approving overseas investment</li><li>Investment feasibility study</li><li>Financial statements (last 2 years, audited)</li><li>Draft articles of association of the overseas company</li><li>Due diligence report on the target country/project</li></ul><h2>Typical Approval Timeline</h2><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#f4f4f4;"><th style="padding:10px;border:1px solid #ddd;">Authority</th><th style="padding:10px;border:1px solid #ddd;">Timeline</th></tr></thead><tbody><tr><td style="padding:10px;border:1px solid #ddd;">NDRC</td><td style="padding:10px;border:1px solid #ddd;">7–20 business days</td></tr><tr><td style="padding:10px;border:1px solid #ddd;">MOFCOM</td><td style="padding:10px;border:1px solid #ddd;">3–15 business days</td></tr><tr><td style="padding:10px;border:1px solid #ddd;">SAFE</td><td style="padding:10px;border:1px solid #ddd;">5–10 business days</td></tr><tr><td style="padding:10px;border:1px solid #ddd;"><strong>Total</strong></td><td style="padding:10px;border:1px solid #ddd;"><strong>1–2 months</strong></td></tr></tbody></table>`,
        content_cn: null,
      },
      {
        title: 'Shipping and Logistics Between Indonesia and China',
        title_cn: '印度尼西亚与中国之间的航运和物流',
        slug: 'shipping-logistics-indonesia-china',
        category: 'Logistics',
        status: 'Published',
        type: 'landing',
        date: '2025-03-01',
        og_image: 'https://ik.imagekit.io/z3fiyhjnl/JIIPE%20-%20Ports.jpg',
        coverImage: 'https://ik.imagekit.io/z3fiyhjnl/JIIPE%20-%20Ports.jpg',
        summary: 'Shipping routes, transit times, and the strategic advantage of JIIPE\'s integrated port for manufacturers exporting to China.',
        summary_cn: '航运路线、运输时间以及JIIPE综合港口对出口到中国的制造商的战略优势。',
        content: `<h2>Shipping Routes Between Indonesia and China</h2><p>Indonesia and China are major bilateral trade partners — bilateral trade exceeds USD 130 billion annually. Main shipping corridors operate from East Java ports to South/East China ports.</p><p>Primary routes from JIIPE/Gresik to China:</p><ul><li><strong>Direct Route:</strong> JIIPE Port → Shanghai / Ningbo / Guangzhou / Xiamen</li><li><strong>Via Tanjung Perak (Surabaya):</strong> Feeder service then onward to Chinese ports</li></ul><h2>Typical Transit Times</h2><table style="width:100%;border-collapse:collapse;"><thead><tr style="background:#f4f4f4;"><th style="padding:10px;border:1px solid #ddd;">Route</th><th style="padding:10px;border:1px solid #ddd;">Transit Time</th></tr></thead><tbody><tr><td style="padding:10px;border:1px solid #ddd;">JIIPE → Shanghai</td><td style="padding:10px;border:1px solid #ddd;">8–10 days</td></tr><tr><td style="padding:10px;border:1px solid #ddd;">JIIPE → Guangzhou/Shenzhen</td><td style="padding:10px;border:1px solid #ddd;">7–9 days</td></tr><tr><td style="padding:10px;border:1px solid #ddd;">JIIPE → Ningbo</td><td style="padding:10px;border:1px solid #ddd;">9–11 days</td></tr></tbody></table><h2>Container Logistics and Export Flow</h2><ol><li><strong>Factory to Port Gate:</strong> Internal roads connect directly to JIIPE Port — less than 5 km from most factory plots.</li><li><strong>Port Handling:</strong> Container stuffing, customs pre-clearance, and export documentation on-site.</li><li><strong>Customs Clearance:</strong> SEZ customs zone — export clearance completed within 24–48 hours.</li></ol><h2>The Strategic Advantage of JIIPE Port</h2><p>JIIPE is one of the few industrial estates in Asia with a deep-water port within its own compound. The port is located <strong>less than 3 km from factory plots</strong> with dedicated truck lanes — bypassing public roads entirely.</p><h3>Logistics Efficiency for Manufacturers at JIIPE</h3><ul><li>✅ No trucking to external ports</li><li>✅ On-site customs clearance (SEZ customs post)</li><li>✅ Bulk liquid handling terminal</li><li>✅ Heavy lift capability</li><li>✅ 24/7 port operations</li></ul><h3>Anchor Tenants at JIIPE</h3><ul><li><strong>PT Hailiang Copper Indonesia</strong> — World's largest copper tube manufacturer, exporting to China and global markets</li><li><strong>PT Freeport Indonesia</strong> — 2 million ton/year copper smelter (world's largest under construction)</li><li><strong>PT Pertamina</strong> — Gas supply infrastructure anchor</li></ul>`,
        content_cn: null,
      },
    ];

    for (const page of pages) {
      const [existing] = await conn.query('SELECT id FROM articles WHERE slug = ?', [page.slug]);
      if (existing.length > 0) {
        console.log('exists: ' + page.slug);
        continue;
      }
      await conn.query(
        `INSERT INTO articles (title, title_cn, slug, category, status, type, date, og_image, coverImage, summary, summary_cn, content, content_cn, is_hot, hot_priority, is_hot_cn, hot_priority_cn) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, NULL, 0, NULL)`,
        [page.title, page.title_cn, page.slug, page.category, page.status, page.type, page.date, page.og_image, page.coverImage, page.summary, page.summary_cn, page.content, page.content_cn]
      );
      console.log('seeded: ' + page.slug);
    }
    console.log('done');
  } finally {
    conn.release();
    await pool.end();
  }
}
run().catch(e => { console.error(e); process.exit(1); });
