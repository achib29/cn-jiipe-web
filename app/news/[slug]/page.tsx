import type { Metadata } from "next";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import ArticleDetailCN from "@/components/ArticleDetailCN";

export const revalidate = 60;

// Server Component: Generates SEO metadata including og:image for WhatsApp/Facebook sharing
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = params;

  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT title, title_cn, summary, summary_cn, coverImage, content, content_cn FROM articles WHERE slug = ? LIMIT 1",
    [slug]
  );

  const article = rows[0];

  if (!article) {
    return {
      title: "Article Not Found - JIIPE",
    };
  }

  // Use Chinese title/summary if available, fallback to English
  const displayTitle = article.title_cn || article.title;
  const displaySummary = article.summary_cn || article.summary;

  // Prioritize first image in body content, fallback to coverImage
  let ogImageUrl = article.coverImage as string;
  const imgRegex = /<img[^>]+src="([^">]+)"/;
  const contentToSearch = article.content_cn || article.content;
  const match = imgRegex.exec(contentToSearch || "");
  if (match && match[1]) {
    ogImageUrl = match[1];
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cn.jiipe.com";

  // Build absolute OG image URL
  let formattedOgImage: string;
  if (ogImageUrl.startsWith("http")) {
    formattedOgImage = ogImageUrl;
  } else {
    formattedOgImage = `${baseUrl}${ogImageUrl.startsWith("/") ? "" : "/"}${ogImageUrl}`;
  }

  const canonicalUrl = `${baseUrl}/news/${slug}`;

  return {
    title: `${displayTitle} | JIIPE News`,
    description: displaySummary,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: displayTitle,
      description: displaySummary,
      url: canonicalUrl,
      images: [formattedOgImage],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: displayTitle,
      description: displaySummary,
      images: [formattedOgImage],
    },
  };
}

// Server Component wrapper — renders the client-side UI component
export default function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  return <ArticleDetailCN slug={params.slug} />;
}
