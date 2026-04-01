// app/articles/[slug]/page.tsx
// Standalone landing page — no Navbar/Footer, OG meta, SSR, RFI form at bottom
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import ArticleLandingClient from '@/components/articles/ArticleLandingClient';

export const dynamic = 'force-dynamic';

/** Inject sequential IDs into H2/H3 tags server-side (avoids hydration mismatch from client-side DOMParser) */
function injectHeadingIds(html: string): string {
  let idx = 0;
  return html.replace(/<(h2|h3)(\s[^>]*)?>([\s\S]*?)<\/\1>/gi, (match, tag, attrs, text) => {
    const id = `heading-${idx++}`;
    return `<${tag} id="${id}"${attrs || ''}>${text}</${tag}>`;
  });
}

/** Strip HTML for SEO metadata */
function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').trim();
}


interface ArticleRow extends RowDataPacket {
  id: number;
  title: string;
  title_cn: string | null;
  slug: string;
  category: string;
  status: string;
  type: string;
  summary: string;
  summary_cn: string | null;
  content: string;
  content_cn: string | null;
  coverImage: string | null;
  coverImageMobile: string | null;
  og_image: string | null;
  date: string;
  cta_text: string | null;
}

async function getArticle(slug: string): Promise<ArticleRow | null> {
  try {
    const [rows] = await pool.query<ArticleRow[]>(
      "SELECT * FROM articles WHERE slug = ? AND status = 'Published' AND type = 'landing' LIMIT 1",
      [slug]
    );
    return rows[0] ?? null;
  } catch (e) {
    console.error('getArticle error:', e);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getArticle(params.slug);
  if (!article) {
    return { title: 'JIIPE - Article Not Found' };
  }

  const titleRaw = article.title_cn || article.title;
  const descriptionRaw = article.summary_cn || article.summary;

  const title = stripHtml(titleRaw);
  const description = stripHtml(descriptionRaw);
  const ogImage = article.og_image || article.coverImage || 'https://en.jiipe.com/logo-jiipe-red.png';
  const url = `https://cn.jiipe.com/articles/${article.slug}`;

  return {
    title: `${title} | JIIPE Industrial Estate`,
    description,
    openGraph: {
      title: `${title} | JIIPE`,
      description,
      url,
      type: 'article',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: 'JIIPE Industrial Estate',
      locale: 'zh_CN',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | JIIPE`,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
    },
    other: {
      'baidu-site-verification': 'codeva-xxx', // update with actual key
    },
  };
}

export default async function ArticleSlugPage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);
  if (!article) notFound();

  // Pre-process heading IDs server-side to avoid hydration mismatch
  const processedContent = injectHeadingIds(article.content || '');
  const processedContentCn = article.content_cn ? injectHeadingIds(article.content_cn) : null;

  return (
    <ArticleLandingClient
      article={{
        ...article,
        content: processedContent,
        content_cn: processedContentCn,
      }}
    />
  );
}
