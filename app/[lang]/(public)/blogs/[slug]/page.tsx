import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import BlogPostView from "@/components/blogs/BlogPostView";
import "@/styles/blogs/blog-post.css";
import "@/styles/buttons/CTAButton.css";

type Lang = "en" | "el" | "es";

type Props = {
  params: Promise<{ lang: Lang; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const supabase = await createSupabaseServerClient();
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://www.e-nutritionist.com";

  const { data } = await supabase
    .from("blog_translations")
    .select(
      "title,slug,excerpt,cover_image_url,meta_title,meta_description,og_image_url,meta_keywords, blogs!inner(id,is_published,published_at)"
    )
    .eq("language_code", lang)
    .eq("slug", slug)
    .eq("blogs.is_published", true)
    .maybeSingle();

  if (!data) return { title: `Blog • ${slug}` };

  const title = (data as any).meta_title || data.title;
  const description = (data as any).meta_description || data.excerpt || undefined;
  const ogImage = (data as any).og_image_url || data.cover_image_url || undefined;
  const keywords = Array.isArray((data as any).meta_keywords) ? ((data as any).meta_keywords as string[]) : undefined;
  const canonical = new URL(`/${lang}/blogs/${data.slug}`, site).toString();

  // Build language alternates from other translations of same blog
  let languages: Record<string, string> | undefined = undefined;
  const blogId = (data as any)?.blogs?.id as string | undefined;
  if (blogId) {
    const { data: trs } = await supabase
      .from("blog_translations")
      .select("language_code,slug")
      .eq("blog_id", blogId);
    if (trs?.length) {
      languages = {};
      for (const t of trs as any[]) {
        const code = String(t.language_code || "").trim();
        const s = String(t.slug || "").trim();
        if (!code || !s) continue;
        languages[code] = new URL(`/${code}/blogs/${s}`, site).toString();
      }
    }
  }

  return {
    title,
    description,
    keywords,
    alternates: { canonical, languages },
    openGraph: {
      title,
      description,
      type: "article",
      url: canonical,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function PublicBlogPostPage({ params }: Props) {
  const { lang, slug } = await params;
  const supabase = await createSupabaseServerClient();
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://www.e-nutritionist.com";

  // Find published blog by translation slug in current lang
  const { data, error } = await supabase
    .from("blog_translations")
    .select(
      "title,slug,excerpt,categories,cover_image_url,body_json,language_code, blogs!inner(id,is_published,published_at,created_at)"
    )
    .eq("language_code", lang)
    .eq("slug", slug)
    .eq("blogs.is_published", true)
    .maybeSingle();

  if (error || !data) notFound();

  const blocks = (data as any)?.body_json?.blocks && Array.isArray((data as any).body_json.blocks) ? (data as any).body_json.blocks : [];
  const publishedAt = (data as any)?.blogs?.published_at as string | null;
  const createdAt = (data as any)?.blogs?.created_at as string | null;
  const dateLabel = publishedAt ? new Date(publishedAt).toLocaleDateString() : createdAt ? new Date(createdAt).toLocaleDateString() : null;
  const canonical = new URL(`/${lang}/blogs/${(data as any).slug}`, site).toString();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: (data as any).title,
    description: (data as any).excerpt || undefined,
    image: (data as any).cover_image_url ? [(data as any).cover_image_url] : undefined,
    datePublished: publishedAt || undefined,
    dateModified: publishedAt || undefined,
    mainEntityOfPage: canonical,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostView
        lang={lang}
        title={data.title}
        slug={data.slug}
        excerpt={data.excerpt ?? null}
        categories={(data.categories as any) ?? []}
        coverImageUrl={data.cover_image_url ?? null}
        dateLabel={dateLabel}
        blocks={blocks as any}
        backHref={`/${lang}/blogs`}
        breadcrumb={[
          { label: "Home", href: `/${lang}` },
          { label: "Blog", href: `/${lang}/blogs` },
          { label: data.title },
        ]}
        shareUrl={`/${lang}/blogs/${data.slug}`}
      />
    </>
  );
}

