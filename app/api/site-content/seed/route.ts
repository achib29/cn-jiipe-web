import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ResultSetHeader } from 'mysql2';

export const dynamic = 'force-dynamic';

// One-time seed endpoint: GET /api/site-content/seed
// Seeds all default content values from hardcoded components
export async function GET() {
    const seeds = [
        // ── HERO ──────────────────────────────────────────────────────────────
        { section: 'hero', field_key: 'title_line1', value_en: "Indonesia's Premier", value_cn: '印尼首席' },
        { section: 'hero', field_key: 'title_line2', value_en: 'Integrated Industrial', value_cn: '综合工业' },
        { section: 'hero', field_key: 'title_line3', value_en: 'Port Estate', value_cn: '港口庄园' },
        { section: 'hero', field_key: 'subtitle', value_en: 'A strategic location featuring world-class infrastructure, a dedicated deep-water port, and comprehensive utilities designed to support your business growth.', value_cn: '战略位置，拥有世界一流的基础设施、专用深水港口和综合配套设施，旨在支持您的业务增长。' },
        { section: 'hero', field_key: 'bg_image_desktop', value_en: 'https://ik.imagekit.io/z3fiyhjnl/jiipe-gresik7.jpg?updatedAt=1764314866627', value_cn: 'https://ik.imagekit.io/z3fiyhjnl/jiipe-gresik7.jpg?updatedAt=1764314866627' },
        { section: 'hero', field_key: 'bg_image_mobile', value_en: 'https://ik.imagekit.io/z3fiyhjnl/Mobile-jiipe-gresik7.jpg', value_cn: 'https://ik.imagekit.io/z3fiyhjnl/Mobile-jiipe-gresik7.jpg' },
        { section: 'hero', field_key: 'brochure_url', value_en: 'https://ik.imagekit.io/z3fiyhjnl/FlyerJIIPE-EN-2025.pdf', value_cn: 'https://ik.imagekit.io/z3fiyhjnl/FlyerJIIPE-CN-2025.pdf' },
        { section: 'hero', field_key: 'btn_brochure', value_en: 'Download Brochure', value_cn: '下载简介' },
        { section: 'hero', field_key: 'btn_contact', value_en: 'Contact Us', value_cn: '联系我们' },

        // ── ABOUT ─────────────────────────────────────────────────────────────
        { section: 'about', field_key: 'label', value_en: 'About JIIPE', value_cn: '关于 JIIPE' },
        { section: 'about', field_key: 'heading', value_en: "Indonesia's Premier Integrated Industrial Estate", value_cn: '印尼首席综合工业园区' },
        { section: 'about', field_key: 'paragraph_1', value_en: "Designated as a National Strategic Project, JIIPE spans 3,000 hectares in East Java. As the region's premier industrial hub, we integrate world-class infrastructure, comprehensive utilities, and a dedicated deep-water port—providing an ecosystem built for enterprise success across diverse sectors.", value_cn: 'JIIPE 被列为国家战略项目，占地 3,000 公顷，位于东爪哇。作为该地区首席工业中心，我们整合了世界一流的基础设施、综合配套设施和专用深水港口，为不同行业的企业成功打造了一个生态系统。' },
        { section: 'about', field_key: 'paragraph_2', value_en: "JIIPE is positioned at the core of Indonesia's economic corridor, seamlessly connected to major transportation networks, offering unparalleled advantages for enterprises seeking to establish or expand their operations in Southeast Asia.", value_cn: 'JIIPE 位于印度尼西亚经济走廊的核心，与主要交通网络无缝连接，为寻求在东南亚建立或扩展业务的企业提供了无与伦比的优势。' },
        { section: 'about', field_key: 'image_url', value_en: '/images/jiipe-about-cover.jpg', value_cn: '/images/jiipe-about-cover.jpg' },
        { section: 'about', field_key: 'video_url', value_en: 'https://ik.imagekit.io/z3fiyhjnl/Rev3%20-%20Chinese%20Company%20at%20JIIPE.mp4', value_cn: 'https://ik.imagekit.io/z3fiyhjnl/Rev3%20-%20Chinese%20Company%20at%20JIIPE.mp4' },
        { section: 'about', field_key: 'features', value_en: JSON.stringify(['Strategic Location', 'Deep Water Port', 'Integrated Utilities', 'Energy Security', 'Tax Incentives', 'Skilled Workforce']), value_cn: JSON.stringify(['战略位置', '深水港口', '综合配套设施', '能源安全', '税收优惠', '技术人才']) },

        // ── FACILITIES ────────────────────────────────────────────────────────
        { section: 'facilities', field_key: 'label', value_en: 'Overview of Facilities', value_cn: '设施概况' },
        { section: 'facilities', field_key: 'heading', value_en: 'World-Class Industrial & Port Infrastructure', value_cn: '世界一流工业和港口基础设施' },
        { section: 'facilities', field_key: 'description', value_en: 'JIIPE features a comprehensive industrial ecosystem, supported by cutting-edge infrastructure, integrated utilities, and smart logistics capabilities designed to empower diverse industrial growth.', value_cn: 'JIIPE 拥有完善的工业生态系统，以尖端基础设施、综合配套设施和智能物流能力为支撑，旨在推动多元化工业发展。' },
        {
            section: 'facilities', field_key: 'tabs', value_en: JSON.stringify([
                { id: 'industrial-area', title: 'Industrial Area', description: 'A 1,800-hectare industrial cluster designed with flexible plotting to accommodate diverse operational needs.', image: 'https://ik.imagekit.io/z3fiyhjnl/PT%20Hailiang%20%26%20PT%20Freeport%20Indonesia.jpg', features: ['Flexible plot sizes', 'Ready-to-Build (RTB) Plots', 'Industrial zoning', 'Premium Standard Infrastructure', 'Integrated Waste Management', '24/7 security system'] },
                { id: 'port-area', title: 'Multifunctional Port Area', description: 'A dedicated deep-water port featuring modern infrastructure for the efficient handling of diverse cargo types.', image: 'https://ik.imagekit.io/z3fiyhjnl/JIIPE%20-%20Ports.jpg', features: ['Deep-Water Berths (-16 LWS)', 'Multipurpose docks', 'Liquid bulk terminal', 'Container terminal', 'Dry bulk terminal', 'Heavy-Duty Handling Equipment'] },
                { id: 'utilities', title: 'Utilities', description: 'A self-sufficient utility ecosystem ensuring reliable and uninterrupted industrial operations.', image: 'https://ik.imagekit.io/z3fiyhjnl/Utility%20Center.jpg', features: ['Dedicated power plant', 'Water treatment facilities', 'Natural gas supply system', 'Telecommunications infrastructure', 'Wastewater treatment plant', 'Renewable Energy Solutions'] },
                { id: 'infrastructure', title: 'Infrastructure', description: 'A well-planned infrastructure network that facilitates seamless connectivity within and outside the park.', image: 'https://ik.imagekit.io/z3fiyhjnl/Gate%20-%20JIIPE.jpg', features: ['Internal road network', 'Direct Highway Access', 'Drainage system', 'Advanced Flood Control System', 'Public transportation facilities'] },
                { id: 'residential', title: 'Residential Area', description: 'A modern integrated township designed to provide a high quality of life for your workforce and executives.', image: 'https://ik.imagekit.io/z3fiyhjnl/AKR%20LAND%201.jpg', features: ['Modern Workforce Housing', 'Commercial amenities', 'Educational institutions', 'Healthcare facilities', 'Parks & Recreation Centers'] }
            ]), value_cn: JSON.stringify([
                { id: 'industrial-area', title: '工业区', description: '1,800公顷的工业集群，采用灵活的地块规划，以满足多样化的运营需求。', image: 'https://ik.imagekit.io/z3fiyhjnl/PT%20Hailiang%20%26%20PT%20Freeport%20Indonesia.jpg', features: ['灵活地块大小', '即建地块 (RTB)', '工业分区', '高级标准基础设施', '综合废物管理', '全天候安保系统'] },
                { id: 'port-area', title: '多功能港区', description: '专用深水港，配备现代化基础设施，高效处理各类货物。', image: 'https://ik.imagekit.io/z3fiyhjnl/JIIPE%20-%20Ports.jpg', features: ['深水泊位 (-16 LWS)', '多用途码头', '液体散货码头', '集装箱码头', '干散货码头', '重型装卸设备'] },
                { id: 'utilities', title: '公用事业', description: '自给自足的公用事业生态系统，确保工业运营可靠、不间断。', image: 'https://ik.imagekit.io/z3fiyhjnl/Utility%20Center.jpg', features: ['专用发电厂', '水处理设施', '天然气供应系统', '电信基础设施', '废水处理厂', '可再生能源解决方案'] },
                { id: 'infrastructure', title: '基础设施', description: '规划完善的基础设施网络，促进园区内外的无缝连接。', image: 'https://ik.imagekit.io/z3fiyhjnl/Gate%20-%20JIIPE.jpg', features: ['内部道路网络', '直接高速公路通道', '排水系统', '先进防洪系统', '公共交通设施'] },
                { id: 'residential', title: '住宅区', description: '现代化综合城镇，旨在为员工和高管提供高品质的生活。', image: 'https://ik.imagekit.io/z3fiyhjnl/AKR%20LAND%201.jpg', features: ['现代员工住房', '商业配套设施', '教育机构', '医疗设施', '公园与休闲中心'] }
            ])
        },

        // ── CTA ───────────────────────────────────────────────────────────────
        { section: 'cta', field_key: 'heading', value_en: 'Ready to expand your business at JIIPE?', value_cn: '准备好在 JIIPE 扩展您的业务了吗？' },
        { section: 'cta', field_key: 'subtitle', value_en: 'Join a thriving ecosystem of global leaders. Leverage JIIPE as your strategic gateway to Indonesia and Southeast Asia.', value_cn: '加入由全球领袖组成的蓬勃发展的生态系统。以 JIIPE 作为您进入印度尼西亚和东南亚的战略门户。' },
        { section: 'cta', field_key: 'btn_contact', value_en: 'Contact Our Investment Team', value_cn: '联系我们的投资团队' },
        { section: 'cta', field_key: 'btn_brochure', value_en: 'Download Brochure', value_cn: '下载简介' },
        { section: 'cta', field_key: 'brochure_url', value_en: 'https://ik.imagekit.io/z3fiyhjnl/FlyerJIIPE-EN-2025.pdf', value_cn: 'https://ik.imagekit.io/z3fiyhjnl/FlyerJIIPE-CN-2025.pdf' },

        // ── TENANTS ───────────────────────────────────────────────────────────
        { section: 'tenants', field_key: 'heading', value_en: 'Trusted by Global & Industry Leaders', value_cn: '全球及行业领军企业的信任之选' },
        { section: 'tenants', field_key: 'subtitle', value_en: 'JIIPE serves as the strategic expansion hub for leading multinational and domestic corporations. We provide the foundation for industrial giants to accelerate their growth in Southeast Asia and beyond.', value_cn: 'JIIPE 是领先跨国企业和国内企业的战略扩张中心，为工业巨头加速在东南亚及更广地区的增长提供坚实基础。' },
        {
            section: 'tenants', field_key: 'tenants', value_en: JSON.stringify([
                { name: 'PT Freeport Indonesia', logo_url: 'https://ik.imagekit.io/z3fiyhjnl/Tenant%20Logo/001-PT%20Freeport%20Indonesia%20(vertical).png?updatedAt=1764649697032', description: "Operator of one of the world's largest copper smelters and a leading global mining company." },
                { name: 'Antam', logo_url: 'https://ik.imagekit.io/z3fiyhjnl/Tenant%20Logo/antam-seeklogo.png', description: "Indonesia's leading diversified mining and metals company, specializing in nickel, gold, and bauxite exploration." },
                { name: 'Bank Indonesia', logo_url: 'https://ik.imagekit.io/z3fiyhjnl/Tenant%20Logo/BI_Logo.png?updatedAt=1764649697433', description: 'The Central Bank of the Republic of Indonesia, serving as a key pillar for national economic stability.' },
                { name: 'PT Hailiang', logo_url: 'https://ik.imagekit.io/z3fiyhjnl/Tenant%20Logo/PT%20Hailiang%20Nova%20Material%20Indonesia.png?updatedAt=1764649696762', description: 'Global leader in copper processing and non-ferrous metal manufacturing.' },
                { name: 'Xinyi Glass', logo_url: 'https://ik.imagekit.io/z3fiyhjnl/Tenant%20Logo/Xinyi%20Glass.png?updatedAt=1764649697448', description: 'Leading manufacturer of high-quality float glass and automotive glass.' },
                { name: 'Xinyi Solar', logo_url: 'https://ik.imagekit.io/z3fiyhjnl/Tenant%20Logo/Xinyi%20Solar.png?updatedAt=1764649697291', description: 'Technology innovator in photovoltaic glass and solar energy solutions.' },
                { name: 'Hebang Biotechnology', logo_url: 'https://ik.imagekit.io/z3fiyhjnl/Tenant%20Logo/Hebang%20Logo-web.png', description: 'Pioneering producer of green chemicals and bio-based industrial solutions.' },
                { name: 'GESC', logo_url: 'https://ik.imagekit.io/z3fiyhjnl/Tenant%20Logo/GESC-Logo.png?updatedAt=1764649697594', description: 'Specialized manufacturer of melamine, ammonium nitrate, synthetic amines, and urea.' }
            ]), value_cn: JSON.stringify([
                { name: 'PT Hailiang', logo_url: 'https://ik.imagekit.io/z3fiyhjnl/Tenant%20Logo/PT%20Hailiang%20Nova%20Material%20Indonesia.png?updatedAt=1764649696762', description: '铜材加工和有色金属制造的全球领导者。' },
                { name: 'Xinyi Glass', logo_url: 'https://ik.imagekit.io/z3fiyhjnl/Tenant%20Logo/Xinyi%20Glass.png?updatedAt=1764649697448', description: '高品质浮法玻璃和汽车玻璃的领先制造商。' },
                { name: 'Xinyi Solar', logo_url: 'https://ik.imagekit.io/z3fiyhjnl/Tenant%20Logo/Xinyi%20Solar.png?updatedAt=1764649697291', description: '光伏玻璃和太阳能解决方案的技术创新者。' },
                { name: 'Hebang Biotechnology', logo_url: 'https://ik.imagekit.io/z3fiyhjnl/Tenant%20Logo/Hebang%20Logo-web.png', description: '绿色化学品和生物基工业解决方案的先驱生产商。' },
                { name: 'GESC', logo_url: 'https://ik.imagekit.io/z3fiyhjnl/Tenant%20Logo/GESC-Logo.png?updatedAt=1764649697594', description: '三聚氰胺、硝酸铵、合成胺及尿素的专业制造商。' }
            ])
        },

        // ── SEZ ───────────────────────────────────────────────────────────────
        { section: 'sez', field_key: 'label', value_en: 'Special Economic Zone', value_cn: '经济特区' },
        { section: 'sez', field_key: 'heading', value_en: 'Exclusive SEZ Incentives & Benefits', value_cn: '独家经济特区激励措施与优惠' },
        { section: 'sez', field_key: 'description', value_en: 'As a designated Special Economic Zone (SEZ), JIIPE offers the highest level of fiscal and non-fiscal incentives in Indonesia. We provide a pro-business environment designed to accelerate your ROI through tax holidays, simplified licensing, and regulatory support.', value_cn: '作为指定的经济特区（SEZ），JIIPE 提供印度尼西亚最高水平的财政和非财政激励措施。我们提供有利于商业的环境，通过税收假期、简化许可证和监管支持来加速您的投资回报率。' },
        { section: 'sez', field_key: 'tab_fiscal_label', value_en: 'Fiscal Incentives', value_cn: '财政激励' },
        {
            section: 'sez', field_key: 'tab_fiscal_items',
            value_en: JSON.stringify([
                { title: 'VAT and Luxury Tax Exemptions', desc: 'Exemption from VAT for taxable goods/services transactions in free zones/bonded zones', legal_basis: 'Legal Basis: Government Regulation No. 40 of 2021' },
                { title: 'Customs & Import Duty Exemptions', desc: 'Exemption or deferral of import duties for capital goods and raw materials.', legal_basis: 'Legal Basis: Government Regulation No. 40 of 2021' },
                { title: 'Local Tax Incentives', desc: 'Benefit from a 50%-100% reduction in local taxes and/or local administrative fees.', legal_basis: 'Legal Basis: Government Regulation No. 40 of 2021' },
            ]),
            value_cn: JSON.stringify([
                { title: '增值税及奢侈品税豁免', desc: '对自由区/保税区内的应税商品/服务交易免征增值税', legal_basis: '法律依据：2021年第40号政府规定' },
                { title: '关税及进口税豁免', desc: '对资本货物和原材料的进口关税豁免或延期缴纳。', legal_basis: '法律依据：2021年第40号政府规定' },
                { title: '地方税激励', desc: '享受地方税及/或地方行政费用50%-100%的减免。', legal_basis: '法律依据：2021年第40号政府规定' },
            ]),
        },
        { section: 'sez', field_key: 'tab_nonfiscal_label', value_en: 'Non-Fiscal Facilitation Measures', value_cn: '非财政便利措施' },
        {
            section: 'sez', field_key: 'tab_nonfiscal_items',
            value_en: JSON.stringify([
                { title: 'Integrated One-Stop Service', desc: 'Streamlined licensing and non-licensing services managed directly by the SEZ Administrator.', legal_basis: 'Legal Basis: Government Regulation No. 40 of 2021' },
                { title: 'Simplified Construction Licensing', desc: "Construction permits are expedited under the Estate's integrated regulations, eliminating bureaucratic delays.", legal_basis: 'Legal Basis: Government Regulation No. 40 of 2021' },
                { title: 'Secure Long-Term Land Tenure', desc: 'Obtain land use rights and ownership for up to 80 years through expedited procedures', legal_basis: 'Legal Basis: Government Regulation No. 40 of 2021' },
                { title: 'Visa & Residency Support', desc: 'Visa on arrival extension, residence permits for foreigners and their families, permanent residency for owners', legal_basis: 'Legal Basis: Government Regulation No. 40 of 2021' },
                { title: 'Unrestricted Import Policy', desc: 'Exemption from import restrictions for goods used within the SEZ.', legal_basis: 'Legal Basis: Government Regulation No. 40 of 2021' },
                { title: 'Integrated Environmental Licensing', desc: 'Streamlined environmental approval process facilitated directly within the estate.', legal_basis: 'Legal Basis: Government Regulation No. 40 of 2021' },
                { title: 'Export Obligation Exemption', desc: 'No mandatory export requirements for resident enterprises', legal_basis: 'Legal Basis: Government Regulation No. 40 of 2021' },
                { title: 'Consumption Tax Policies', desc: 'Not applicable to goods within the economic special zone under specific terms', legal_basis: 'Legal Basis: Government Regulation No. 40 of 2021' },
            ]),
            value_cn: JSON.stringify([
                { title: '综合一站式服务', desc: '由经济特区管理机构直接管理的简化许可证及非许可证服务。', legal_basis: '法律依据：2021年第40号政府规定' },
                { title: '简化建筑许可证', desc: '在园区综合法规下加快施工许可证审批，消除官僚拖延。', legal_basis: '法律依据：2021年第40号政府规定' },
                { title: '安全的长期土地使用权', desc: '通过加快程序获得长达80年的土地使用权和所有权', legal_basis: '法律依据：2021年第40号政府规定' },
                { title: '签证及居留支持', desc: '落地签延期、外籍人士及家属居留许可、业主永久居留权', legal_basis: '法律依据：2021年第40号政府规定' },
                { title: '无限制进口政策', desc: '对在经济特区内使用的商品免除进口限制。', legal_basis: '法律依据：2021年第40号政府规定' },
                { title: '综合环境许可证', desc: '在园区内直接办理的简化环境审批程序。', legal_basis: '法律依据：2021年第40号政府规定' },
                { title: '出口义务豁免', desc: '园区内企业无强制性出口要求', legal_basis: '法律依据：2021年第40号政府规定' },
                { title: '消费税政策', desc: '在特定条件下不适用于经济特区内的商品', legal_basis: '法律依据：2021年第40号政府规定' },
            ]),
        },

        // ── FACILITIES ────────────────────────────────────────────────────────
        { section: 'facilities', field_key: 'label', value_en: 'Overview of Facilities', value_cn: '设施概览' },
        { section: 'facilities', field_key: 'heading', value_en: 'World-Class Industrial & Port Infrastructure', value_cn: '世界级的工业与港口基础设施' },
        { section: 'facilities', field_key: 'description', value_en: 'JIIPE features a comprehensive industrial ecosystem, supported by cutting-edge infrastructure, integrated utilities, and smart logistics capabilities designed to empower diverse industrial growth.', value_cn: 'JIIPE 拥有全面的工业生态系统，在尖端基础设施、综合公用事业和智能物流能力的支持下，旨在赋能多样化的工业增长。' },
        {
            section: 'facilities', field_key: 'tabs',
            value_en: JSON.stringify([
                {
                    id: "industrial-area", title: "Industrial Area", image: "https://ik.imagekit.io/z3fiyhjnl/PT%20Hailiang%20&%20PT%20Freeport%20Indonesia.jpg",
                    description: "A 1,800-hectare industrial cluster designed with flexible plotting to accommodate diverse operational needs.",
                    features: ["Flexible plot sizes", "Ready-to-Build (RTB) Plots", "Industrial zoning", "Premium Standard Infrastructure", "Integrated Waste Management", "24/7 security system"]
                },
                {
                    id: "port-area", title: "Multifunctional Port Area", image: "https://ik.imagekit.io/z3fiyhjnl/JIIPE%20-%20Ports.jpg",
                    description: "A dedicated deep-water port featuring modern infrastructure for the efficient handling of diverse cargo types.",
                    features: ["Deep-Water Berths (-16 LWS)", "Multipurpose docks", "Liquid bulk terminal", "Container terminal", "Dry bulk terminal", "Heavy-Duty Handling Equipment"]
                },
                {
                    id: "utilities", title: "Utilities", image: "https://ik.imagekit.io/z3fiyhjnl/Utility%20Center.jpg",
                    description: "A self-sufficient utility ecosystem ensuring reliable and uninterrupted industrial operations.",
                    features: ["Dedicated power plant", "Water treatment facilities", "Natural gas supply system", "Telecommunications infrastructure", "Wastewater treatment plant", "Renewable Energy Solutions"]
                },
                {
                    id: "infrastructure", title: "Infrastructure", image: "https://ik.imagekit.io/z3fiyhjnl/Gate%20-%20JIIPE.jpg",
                    description: "A well-planned infrastructure network that facilitates seamless connectivity within and outside the park.",
                    features: ["Internal road network", "Direct Highway Access", "Drainage system", "Advanced Flood Control System", "Public transportation facilities"]
                },
                {
                    id: "residential", title: "Residential Area", image: "https://ik.imagekit.io/z3fiyhjnl/AKR%20LAND%201.jpg",
                    description: "A modern integrated township designed to provide a high quality of life for your workforce and executives.",
                    features: ["Modern Workforce Housing", "Commercial amenities", "Educational institutions", "Healthcare facilities", "Parks & Recreation Centers"]
                }
            ]),
            value_cn: JSON.stringify([
                {
                    id: "industrial-area", title: "工业区", image: "https://ik.imagekit.io/z3fiyhjnl/PT%20Hailiang%20&%20PT%20Freeport%20Indonesia.jpg",
                    description: "占地 1,800 公顷的工业集群，规划灵活，可满足不同的运营需求。",
                    features: ["灵活的地块大小", "即可建设(RTB)地块", "工业区划", "高级标准基础设施", "综合废物管理", "24/7 安全系统"]
                },
                {
                    id: "port-area", title: "多功能港口区", image: "https://ik.imagekit.io/z3fiyhjnl/JIIPE%20-%20Ports.jpg",
                    description: "拥有现代基础设施的专用深水港，可高效处理各种类型的货物。",
                    features: ["深水泊位 (-16 LWS)", "多用途码头", "液体散货码头", "集装箱码头", "干散货码头", "重型装卸设备"]
                },
                {
                    id: "utilities", title: "公用事业", image: "https://ik.imagekit.io/z3fiyhjnl/Utility%20Center.jpg",
                    description: "自给自足的公用事业生态系统，确保工业运营可靠且不间断。",
                    features: ["专用发电厂", "水处理设施", "天然气供应系统", "电信基础设施", "废水处理厂", "可再生能源解决方案"]
                },
                {
                    id: "infrastructure", title: "基础设施", image: "https://ik.imagekit.io/z3fiyhjnl/Gate%20-%20JIIPE.jpg",
                    description: "规划完善的基础设施网络，实现园区内外的无缝连接。",
                    features: ["内部道路网络", "直达高速公路", "排水系统", "先进的防洪系统", "公共交通设施"]
                },
                {
                    id: "residential", title: "住宅区", image: "https://ik.imagekit.io/z3fiyhjnl/AKR%20LAND%201.jpg",
                    description: "现代化的综合型城镇，为您的高管和员工提供高品质的生活环境。",
                    features: ["现代化员工住房", "商业设施", "教育机构", "医疗设施", "公园和娱乐中心"]
                }
            ])
        },

        // ── CALL TO ACTION (CTA) ──────────────────────────────────────────────
        { section: 'cta', field_key: 'heading', value_en: 'Ready to expand your business at JIIPE?', value_cn: '准备好在 JIIPE 扩展您的业务了吗？' },
        { section: 'cta', field_key: 'subtitle', value_en: 'Join a thriving ecosystem of global leaders. Leverage JIIPE as your strategic gateway to Indonesia and Southeast Asia.', value_cn: '加入由全球领袖组成的蓬勃发展的生态系统。以 JIIPE 作为您进入印度尼西亚和东南亚的战略门户。' },
        { section: 'cta', field_key: 'btn_contact', value_en: 'Contact Our Investment Team', value_cn: '联系我们的投资团队' },
        { section: 'cta', field_key: 'btn_contact_url', value_en: '/#contact', value_cn: '/#contact' },
        { section: 'cta', field_key: 'btn_brochure', value_en: 'Download Brochure', value_cn: '下载简介' },
        { section: 'cta', field_key: 'brochure_url', value_en: 'https://ik.imagekit.io/z3fiyhjnl/FlyerJIIPE-EN-2025.pdf', value_cn: 'https://ik.imagekit.io/z3fiyhjnl/FlyerJIIPE-CN-2025.pdf' },

        // ── GLOBAL GATEWAY (LOCATION) ─────────────────────────────────────────
        { section: 'location', field_key: 'label', value_en: 'GLOBAL GATEWAY', value_cn: '全球门户' },
        { section: 'location', field_key: 'heading', value_en: 'Prime Connectivity & Strategic Access', value_cn: '主要连接性和战略访问' },
        { section: 'location', field_key: 'description', value_en: 'Located in East Java, JIIPE offers seamless connectivity to domestic and global markets through integrated multimodal transportation networks (Sea, Road, and Rail).', value_cn: '位于东爪哇的 JIIPE 通过综合多式联运网络（海运、公路和铁路）提供与国内和全球市场的无缝连接。' },
        
        { section: 'location', field_key: 'map_image', value_en: '/images/jiipe-location-map-cn.jpg', value_cn: '/images/jiipe-location-map-cn.jpg' },
        { section: 'location', field_key: 'map_link', value_en: 'https://maps.app.goo.gl/ZETT9Gm28JfmcJwh7', value_cn: 'https://maps.app.goo.gl/ZETT9Gm28JfmcJwh7' },
        { section: 'location', field_key: 'map_title', value_en: 'Prime Location in East Java', value_cn: '东爪哇的黄金地段' },
        { section: 'location', field_key: 'map_desc', value_en: "Strategically positioned in Gresik, East Java—the heart of Indonesia's industrial growth corridor.", value_cn: '战略性地位于东爪哇的锦石（Gresik）——印度尼西亚工业增长走廊的核心。' },
        
        { section: 'location', field_key: 'map_highlights_title', value_en: 'Key Distance Highlights:', value_cn: '主要距离亮点：' },
        {
            section: 'location', field_key: 'map_highlights',
            value_en: JSON.stringify([
                "45 minutes to Juanda International Airport",
                "30 minutes to Surabaya CBD",
                "60 minutes to Sidoarjo and Pasuruan Industrial Hubs",
                "Direct frontage to the Surabaya West Access Channel (APBS)"
            ]),
            value_cn: JSON.stringify([
                "距朱安达国际机场 45 分钟车程",
                "距泗水中央商务区 30 分钟车程",
                "距诗都阿佐和巴苏鲁安工业中心 60 分钟车程",
                "直接面向泗水西航道 (APBS)"
            ])
        },

        { section: 'location', field_key: 'tour_label', value_en: 'Virtual Tour', value_cn: '虚拟旅游' },
        { section: 'location', field_key: 'tour_heading', value_en: 'Explore JIIPE in a 360° Virtual Tour', value_cn: '在360度虚拟旅游中探索JIIPE' },
        { section: 'location', field_key: 'tour_description', value_en: 'Through this virtual tour, explore JIIPE’s strategic geography and key facilities. Experience the port, industrial zones, and office areas immersively—and discover why JIIPE is an ideal investment destination in Indonesia and Southeast Asia.', value_cn: '通过这个虚拟旅游，探索JIIPE的战略地理位置和关键设施。沉浸式体验港口、工业区和办公区——发现为什么JIIPE是印度尼西亚和东南亚理想的投资目的地。' },
        { section: 'location', field_key: 'tour_cover_image', value_en: '/images/jiipe-360-cover.jpg', value_cn: '/images/jiipe-360-cover.jpg' },
        { section: 'location', field_key: 'tour_link', value_en: 'https://tours.jiipe.com/tours/5Ss66DNIH', value_cn: 'https://tours.jiipe.com/tours/5Ss66DNIH' },

        {
            section: 'location', field_key: 'connectivity_items',
            value_en: JSON.stringify([
                { title: "Sea Transport", desc: "Direct access to global trade routes via the APBS deep-water channel." },
                { title: "Air Transport", desc: "Only 45 minutes to Juanda International Airport" },
                { title: "Land Transport", desc: "Direct Toll Access connected to the Trans-Java Highway Network." },
                { title: "Global Connectivity", desc: "Located at the heart of Southeast Asia's fastest-growing economic corridor." }
            ]),
            value_cn: JSON.stringify([
                { title: "海运", desc: "通过 APBS 深水航道可直接连接全球贸易路线。" },
                { title: "空运", desc: "距朱安达国际机场仅 45 分钟车程" },
                { title: "陆运", desc: "直接通过收费公路连接爪哇岛跨岛高速公路网络。" },
                { title: "全球连接", desc: "位于东南亚增长最快的经济走廊中心。" }
            ])
        },

        // ── CONTACT / RFI ────────────────────────────────────────────────────────
        { section: 'contact', field_key: 'label', value_en: 'Contact Us', value_cn: '联系我们' },
        { section: 'contact', field_key: 'heading', value_en: 'Connect with Our Investment Experts', value_cn: '联系我们的投资专家' },
        { section: 'contact', field_key: 'description', value_en: 'Please fill out the form below. Our investment consultants will contact you shortly to discuss your specific industrial needs.', value_cn: '请填写以下表格。我们的投资顾问将很快与您联系，讨论您的具体工业需求。' },
        { section: 'contact', field_key: 'rfi_emails', value_en: 'abdul.khasib@bkms.jiipe.co.id', value_cn: 'abdul.khasib@bkms.jiipe.co.id' },

        // ── FOOTER ────────────────────────────────────────────────────────
        { section: 'footer', field_key: 'logo', value_en: '/logo-jiipe-white.png', value_cn: '/logo-jiipe-white.png' },
        { section: 'footer', field_key: 'tagline', value_en: 'A strategic integrated industrial estate and deep seaport in East Java, Indonesia.', value_cn: '印度尼西亚东爪哇的战略综合工业区和深水海港。' },
        { section: 'footer', field_key: 'address', value_en: 'Jl. Raya Manyar Km. 11, Manyar-Gresik, East Java 61151', value_cn: 'Jl. Raya Manyar Km. 11, Manyar-Gresik, East Java 61151' },
        { section: 'footer', field_key: 'phone', value_en: '+623198540999', value_cn: '+623198540999' },
        
        { section: 'footer', field_key: 'social_fb', value_en: 'https://www.facebook.com/jiipe.gresik', value_cn: 'https://www.facebook.com/jiipe.gresik' },
        { section: 'footer', field_key: 'social_yt', value_en: 'https://www.youtube.com/@jiipeofficial', value_cn: 'https://www.youtube.com/@jiipeofficial' },
        { section: 'footer', field_key: 'social_ig', value_en: 'https://www.instagram.com/jiipe.official', value_cn: 'https://www.instagram.com/jiipe.official' },
        { section: 'footer', field_key: 'social_li', value_en: 'https://www.linkedin.com/company/jiipeofficial', value_cn: 'https://www.linkedin.com/company/jiipeofficial' },
        
        {
            section: 'footer', field_key: 'quick_links',
            value_en: JSON.stringify([
                { label: "Home", url: "/#home" },
                { label: "About Us", url: "/#about" },
                { label: "Facilities", url: "/#facilities" },
                { label: "Location", url: "/#location" },
                { label: "Contact", url: "/#contact" },
                { label: "News/Articles", url: "/news" }
            ]),
            value_cn: JSON.stringify([
                { label: "主页", url: "/#home" },
                { label: "关于我们", url: "/#about" },
                { label: "设施", url: "/#facilities" },
                { label: "位置", url: "/#location" },
                { label: "联系", url: "/#contact" },
                { label: "新闻/文章", url: "/news" }
            ])
        },
        {
            section: 'footer', field_key: 'facilities_links',
            value_en: JSON.stringify([
                { label: "Industrial Area", url: "/#industrial-area" },
                { label: "Port Area", url: "/#port-area" },
                { label: "Utilities", url: "/#utilities" },
                { label: "Infrastructure", url: "/#infrastructure" },
                { label: "Residential Area", url: "/#residential" }
            ]),
            value_cn: JSON.stringify([
                { label: "工业区", url: "/#industrial-area" },
                { label: "港口区", url: "/#port-area" },
                { label: "公用事业", url: "/#utilities" },
                { label: "基础设施", url: "/#infrastructure" },
                { label: "住宅区", url: "/#residential" }
            ])
        },
    ];


    const errors: string[] = [];

    for (const seed of seeds) {
        try {
            await pool.query<ResultSetHeader>(
                `INSERT INTO site_content (section, field_key, value_en, value_cn)
                 VALUES (?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE
                   value_en = VALUES(value_en),
                   value_cn = VALUES(value_cn)`,
                [seed.section, seed.field_key, seed.value_en, seed.value_cn]
            );
        } catch (err: any) {
            errors.push(`${seed.section}.${seed.field_key}: ${err.message}`);
        }
    }

    if (errors.length > 0) {
        return NextResponse.json({ success: false, errors });
    }

    return NextResponse.json({ success: true, seeded: seeds.length });
}
