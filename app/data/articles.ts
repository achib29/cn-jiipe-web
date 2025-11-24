// Tipe data untuk Artikel
export interface Article {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  coverImage: string;
  content: string; // HTML string
  author: string;
}

// Data Dummy dengan Gambar Unsplash (Langsung muncul)
export const articlesDB: Article[] = [
  {
    id: '1',
    slug: 'freeport-smelter-operations',
    title: 'Freeport Indonesia Smelter in JIIPE Begins Full Commercial Operation',
    date: 'October 24, 2024',
    category: 'Industry News',
    author: 'Admin JIIPE',
    summary: 'A historic milestone for national downstreaming industries as the world’s largest single-line copper smelter commences operations within the JIIPE Special Economic Zone.',
    // Gambar Smelter / Pabrik Besar
    coverImage: 'https://images.unsplash.com/photo-1565193566173-0923d5a633f3?q=80&w=2070&auto=format&fit=crop',
    content: `
      <p><strong>GRESIK, East Java</strong> – The Java Integrated Industrial and Port Estate (JIIPE) celebrates a monumental achievement today as PT Freeport Indonesia (PTFI) officially begins full commercial operations of its new copper smelter.</p>
      
      <h3>Boosting National Economy</h3>
      <p>This facility, designed to be the largest single-line copper smelter in the world, has a processing capacity of 1.7 million tons of copper concentrate per year. The operation of this smelter is a concrete manifestation of the Indonesian government's downstreaming policy.</p>
      
      <p>"The synergy between JIIPE's integrated infrastructure and Freeport's technological prowess creates a robust ecosystem for industrial growth in East Java," stated the operational director during the inauguration ceremony.</p>
      
      <figure>
        <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop" alt="Industrial Engineer" class="w-full rounded-lg my-4" />
        <figcaption class="text-center text-sm text-gray-500">Engineers monitoring the control room at the new facility.</figcaption>
      </figure>

      <h3>Environmental Commitment</h3>
      <p>Despite its massive scale, the smelter is equipped with state-of-the-art waste management systems ensuring compliance with international environmental standards. This aligns with JIIPE's vision as a Green Industrial Estate.</p>
    `,
  },
  {
    id: '2',
    slug: 'jiipe-port-expansion-2025',
    title: 'JIIPE Port Capacity Doubles with New Crane Installation',
    date: 'September 15, 2024',
    category: 'Infrastructure',
    author: 'Port Authority',
    summary: 'To support increasing cargo volume from new tenants, JIIPE Port has successfully installed four new Post-Panamax quay cranes.',
    // Gambar Pelabuhan / Crane
    coverImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop',
    content: `
      <p><strong>GRESIK</strong> – Logistics efficiency in East Java is set to improve significantly. JIIPE Port announced the successful installation of four new Post-Panamax Quay Cranes (QC) and eight Rubber Tyred Gantry (RTG) cranes.</p>
      
      <h3>Handling Global Logistics</h3>
      <p>With deep sea depth reaching -16 LWS, JIIPE Port can now handle larger vessels. The new equipment will double the container handling speed, reducing dwell time significantly for tenants.</p>
      
      <ul>
        <li><strong>Project Investment:</strong> USD 50 Million</li>
        <li><strong>Capacity Increase:</strong> 200%</li>
        <li><strong>Target:</strong> Serving direct calls to Europe and China</li>
      </ul>
      
      <p>This expansion is critical as more multinational companies start their production within the industrial estate this year.</p>
    `,
  },
  {
    id: '3',
    slug: 'floating-solar-panel-project',
    title: 'JIIPE Launches Largest Floating Solar Panel Project in the Region',
    date: 'August 10, 2024',
    category: 'Sustainability',
    author: 'Green Team',
    summary: 'Committing to net-zero emissions, JIIPE utilizes its water retention ponds for a massive renewable energy generator.',
    // Gambar Solar Panel
    coverImage: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2073&auto=format&fit=crop',
    content: `
      <p>Sustainability is not just a buzzword at JIIPE. This week, the management unveiled the plan for a 50 MWp Floating Solar PV system installed atop the industrial water reservoirs.</p>
      
      <h3>Clean Energy for Tenants</h3>
      <p>The electricity generated will be supplied directly to the industrial tenants, providing them with green energy certificates (REC) crucial for their export compliance to markets like the European Union.</p>
      
      <p>"We utilize every available asset, including water surfaces, to generate clean energy without reducing industrial land area," explained the Head of Sustainability.</p>
    `,
  },
  {
    id: '4',
    slug: 'best-sez-award-2024',
    title: 'JIIPE Named "Best Special Economic Zone" for Manufacturing Investment',
    date: 'July 05, 2024',
    category: 'Awards',
    author: 'PR Dept',
    summary: 'Recognition for outstanding facility management and ease of doing business licensing services.',
    // Gambar Award / Bisnis
    coverImage: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=1932&auto=format&fit=crop',
    content: `
      <p>The National Council for Special Economic Zones (SEZ) has awarded JIIPE the title of <strong>Best SEZ for Manufacturing Investment 2024</strong>.</p>
      <p>This award recognizes JIIPE's excellence in:</p>
      <ol>
        <li>Integrated One-Stop Service (Licensing)</li>
        <li>World-class infrastructure readiness</li>
        <li>Digital management systems</li>
      </ol>
      <p>This accolade further cements JIIPE's position as the premier investment destination in Southeast Asia.</p>
    `,
  },
];